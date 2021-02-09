---
title: nodejs事件循环
date: 2019-02-16 23:52:18
tags:
- nodejs
- event loop
categories: Nodejs
---

# reason
这两天系统地学习了一下nodejs中的时间循环机制。这篇Post将把其基本内容以及我当时遇到的问题都记录下来。__Note__：为避免理解冲突，将在官方文档的例子上进行理解。
<!-- more -->

# 基础knowledge
nodejs的event loop是javascript实现非阻塞IO的手段。
## node的整体结构
借用一张图：
![nodejs](/images/node_js_total.png)

nodejs由c/c++库（主要为libuv依赖、v8实现部分和其它）和js实现的核心库。
## node的事件循环
既然本篇主要讨论事件循环，基本理解一下node中事件循环与js代码的对应关系：
![对应关系](/images/node_js_el.png)
这里只补充一下pending IO callback 这一phase。这个阶段主要处理一些IO操作的回调，比如读文件的回调，网络请求完成的回调等（排除任何close回调）。

每个phase有一个类似FIFO的堆栈。当运行到这个phase时，如果有回调的话，会从这个回调堆栈中取出所有回调来执行，或者是到达了该phase的最大执行数限制，接着进入下一phase。

## nodejs代码运行流程
![nodejs工作流](/images/nodejs_flow.png)
从main.js开始运行主程序代码，接着判断是否event loop结束（如果事件循环一轮都没有任何回调了，说明可以终止进程了）。有的话，会从timer phase开始进行event loop。

## nodejs event loop基础
![nodejs event loog](/images/node_js_event_loog.png)
上图是nodejs官网的图。表明event loop由以上phase组成：
- timer：定时器，用于执行setTimeout和setInterval定义的回调函数。从技术上来讲，该阶段通常由poll阶段控制。（注意这句话，后面有用）
- pending callbacks：上面已经说过了，用于执行一些IO回调。
- idle, prepare：内部使用，不讨论。
- poll：这是一个灰常重要的phase。这个阶段可能会得到新的IO事件，执行IO相关的回调，以及timer、setImmediate定义的回调等。总之功能多多。nodejs可能会在这个phase blocking住进程。
- check：这个phase用于检查是否有setImmediate定义的回调，并一次性清空整个栈。
- close callbacks：用于执行各种 close 事件。

## event loop detail
### timer
首先要搞清楚的是，定义的setTimeout的函数，并不一定在所定义的毫秒数到来时被**准时**执行（严格意义来讲，都是晚于该毫秒数）。为什么呢？对于timer phase来说，其工作流程大致如下：主程序执行完毕，进入event loop的timer phase。生成一个当前系统时间的格林时间毫秒数，再检查是否有timer，如果有，筛选出所有timer中满足毫秒数的回调，依次执行。
这里官网举了一个读文件的[例子](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#header-timers)，我就不重复说了，说个大概：
```js
function someAsyncOperation(callback) {
  // 假设 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
//   这里会显示一个大于100的值。
}, 100);

someAsyncOperation(() => {
  const startCallback = Date.now();

  // 手动把cpu给hang住10ms
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```
整个执行流程（最后的粗体数值表示启动程序后的相对毫秒数）：
1. 定义一个setTimeout 100ms的回调；**0ms**
2. 执行someAsyncOperation异步读文件操作；**0ms**
3. 主程序执行完毕，进入event loop；**0ms**；
4. 大概**95ms**后，在poll阶段收到读文件的添加回调，并执行，导致花费10ms；**105ms**
5. 在poll的队列空后，检查timer，存在，执行。**105ms**

因此，虽然定义的100ms后的回调，但仍然可能在大于这个值后才执行。

**Note**: 为了防止poll phase一直阻塞event loop，libuv对有poll接受更多事件的限制。

### pending callbacks
用于执行一些系统操作，比如tcp错误等，或者执行一些IO回调，比如读文件完成、网络请求返回等。

### poll
主要有两个作用：
1. 计算block住IO多久；
2. 处理poll队列中的事件。

当timer队列为空时，会：
1. 如果poll queue不为空，则同步执行全部或到达最大限制；
2. 为空，则会：
    1. 有setImmediate的回调，则结束poll phase，进入check phase；
    2. 没有setImmediate的回调，则等待回调被添加，然后执行。

一旦poll queue为空了（可能是一进入就为空，或者全部执行了queue而为空），会检查timer是否有到时间的回调。如果有，就回退到timer phase去执行。

### check
在poll阶段，当有setImmediate的回调，并且poll变的空闲时，会结束poll，进入check，来执行这些setImmediate定义的回调。

### close callbacks
当一个socket或者其它事件处理异常关闭时，close event会在这个phase触发。否则它将通过process.nextTick发出。

## 一些关注点
___
setImmediate() runs before setTimeout(fn, 0)?
___
要看场景。如果是这么调用的：
```js
setTimeout(function(){
    console.log("SETTIMEOUT");
});
setImmediate(function(){
    console.log("SETIMMEDIATE");
});
```
那么输出就不一定是哪个先。为什么呢？分析一下：
1. 主程序添加timer；
2. 主程序添加setImmediate；
3. 进入event loop；
4. 进入timer phase。得到系统时间，对比一下该timer延迟毫秒数->0，系统运行所经历的毫秒数：
    1. 如果 = 0（PS：使用Date.now()获取的值为格林时间毫秒数，意思是精确到毫秒级，不能再往下了），nodejs判断是否到达调用时间，不会按照是否等于毫秒数，而是是否**大于**该毫秒数，大于则执行，否则不执行。所以不执行该timer；
    2. 如果 > 0 （可能系统资源被其它进程占用太多，导致cpu调度比较晚），那么该timer执行。

由以上分析，能看出在非IO中为什么执行顺序不一致了。如果放在IO中：
```js
require('fs').readFile('file.txt', () => {
    setTimeout(() => console.log(1));
    setImmediate(() => console.log(2));
});
```
那么不管setImmediate和setTimeout是什么顺序书写，都会是setImmediate先执行：
1. 主程序执行读文件；
2. 进入event loop;
3. 进入pending phase，文件读完，执行匿名回调--添加一个timer和setImmediate；
4. 由于check phase在timer phase前面（以步骤3所在的pending phase为开始），所以天然的setImmediate先执行。

___
能用setTimeout(..., 0) 代替 setImmediate？
___
不考虑性能的话，可以。但实际上，timer维护了一个队列，添加、执行timer都设计到队列的维护；而setImmediate只是简单地将队列清空。（timer貌似实现上是二叉树，性能消耗也不小）

___
process.nextTick()是啥？
___
event loop中没有对nextTick作说明。根据文档：nextTickQueue will be processed after the current operation completes, regardless of the current phase of the event loop。类似setImmediate，它也有个队列，也会一次性清空队列，但它的执行时机是在当前phase都执行完毕后，在进入下一phase之前。官网的说法：process.nextTick和setImmediate其实应该互换名称，只是考虑到现在基于这个命名的应用太多，根本不可能改。


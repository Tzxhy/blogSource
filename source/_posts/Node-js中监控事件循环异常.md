---
title: Nodejs中监控事件循环异常
date: 2019-09-21 19:09:46
tags:
- Node.js
- libuv
- event loop
categories:
- libuv
---

## 开场白
最近在学习 libuv，也了解了一些 Node.js 中使用 libuv 的例子。当然，这篇文章不会去介绍 event loop，毕竟这些东西在各个论坛、技术圈里都被介绍烂了。本文介绍如何正确使用 Event loop，以及即使发现程序是否异常 block。

## 基础
event loop的基础想必各位读者都比较熟悉了。这里我引用官方的图，简单介绍两句，作为前置准备：
![libuv event loop](http://docs.libuv.org/en/v1.x/_images/loop_iteration.png)

event loop是作为**单线程实现异步**的方式之一。简而言之，就是在一个大的 while 循环中不断遍历这些 phase，执行对应的 callbacks。这样才实现了真正的异步调用：调用时不必等着响应，等调用的资源准备好了，回调我。

以上就是基础，接下来进入正题：

## 问题提出
开门见山，我们提出以下问题：
1. js 既然是单线程，那么总有办法 block 住整个程序，虽然用了 libuv，也可能会 block 住主程序。对吗？
2. 如何知道我们的程序 block 住了？

<!-- more -->

对于问题1，答案是肯定的。任何 io 密集计算都会 block 主进程，调用任何耗时的同步系统 api（比如同步读取大文件等），也会 block。

对于第2个问题，就需要对 libuv 有个基本认识了（想想我前面说的一个大 while）。event loop 既然是 loop，那么总有**循环**的概念吧？想到循环，能联想到**循环次数**吧？对~解决方案就是使用循环次数。

## 方案
这里我提一个思路（并不是说不写代码😄）：如果我们正常逻辑下，一秒钟能进行100W 次事件循环（数据基于我本机），那么如果有一段时间，我得到的1秒钟时间循环次数只有50W，那么是不是说明程序中有哪些地方稍微 block 住了？或者夸张地说，由正常的100W 次变为了个数次。这就很严重了。因此及时监控event loop 非常重要。

### 第一版代码
```js
// 环境准备
const http = require('http');
const path = require('path');
const {execFile, execFileSync} = require('child_process');

const max = 9999;
const getComputedValueFromChildProcess = (max) => execFileSync('node', [path.join(__dirname, './childprocess.js'), max]);

http.createServer((req, res) => {
    const k = getComputedValueFromChildProcess(max);
    res.write('origin-text: ' + k);
    res.end();
}).listen(8888);


// 第一版实现
const MS_MULTI = 1000 * 1000;
const blockDelta = 10 * MS_MULTI;
let start;
function meature() {
    start = process.hrtime();
    setImmediate(function() {
        let seconds;
        [seconds, start] = process.hrtime(start);
        if (seconds * 1000 * MS_MULTI + start > blockDelta) {
            console.log(`node.eventloop_blocked for ${seconds}secs and ${(start / MS_MULTI).toFixed(2)}ms.`);
        }
        meature();
    });
}
meature();

// childprocess.js 文件
#!/use/env node
const args = Number(process.argv[2]);
function computeIo(args) {
    let k;
    for (let i = 0; i < args; ++i) {
        for (let j = 0; j < args; ++j) {
            k = i + j;
        } 
    }
    return  k;
}
console.log(computeIo(args));
```
大环境是一个 web 服务器。我们选用了 check 这个 phase 来作为一个起点（这里不使用 timer phase的原因是，setTimeout 的 timeout 最低是1ms，在 event loop 空转时，1ms 可以跑好多好多次循环了，本机数据大概是100K次/ms）。应用一开始就调用 _meature_ 方法开始暴力测试。旨在测试这次 check 到下次 check 的时间是否大于10ms：
```base
# 没有请求前
# 等了很久出现一个15ms
➜  test node blocked.js
node.eventloop_blocked for 0secs and 15.71ms.

# 当我执行几次
curl http://localhost:8888
# 出现：
node.eventloop_blocked for 0secs and 175.60ms.
node.eventloop_blocked for 0secs and 149.92ms.
node.eventloop_blocked for 0secs and 147.25ms.
```
是的，基本雏形出来了。可以根据这些数值进行数据上报、排查问题等。但是！

如果读者有尝试了上面这个例子的话，会发现一个问题：电脑发烫，风扇不停转！

我看了任务管理器，发现 Node 进程的 cpu 占用率是100%左右！当我把 meature 逻辑注释掉，cpu 占用率恢复到了0%左右。看来这个版本不行。我们来修改一下~具体原因是不断地执行 setImmediate 代码，不断添加 callback，导致 cpu 一直 run！

### 第二版代码
我们增加一个采样的概念：每10秒，采样一个至少2秒的循环数（为什么是至少2秒？因为 setTimeout 的 timeout 的定义本来也就是至少鸭，哈哈哈哈😏）
```js
const EVERY_SEC_MIN_LOOPS = 1000000; // 定义每秒最小循环数
let times = 0; // 一次采样中的循环数
let nowShowIncreaseTimes = false; // 当前是否应该增加 times
let start = Date.now();
const CD = 10 * 1000; // 间隔
function meature(callback = () => {}) {
    setTimeout(function() {
        start = Date.now();
        nowShowIncreaseTimes = true;
        _inter();
        setTimeout(() => {
            endMeature();
            meature(); // 开始预约下次采样
        }, 2000);
    }, CD);
}
function _inter() {
    setImmediate(() => {
        if (nowShowIncreaseTimes) {
            ++times;
            return _inter();
        }
    });
}

function endMeature() {
    
    const now = Date.now();
    nowShowIncreaseTimes = false;
    const totalMsSpan = now - start;
    const everySecLoops = (times / (totalMsSpan / 1000)).toFixed(0);
    if (everySecLoops < EVERY_SEC_MIN_LOOPS) {
        console.log(`当前每秒循环数${everySecLoops}`);
    }
    times = 0;
    return everySecLoops
}
meature();
```

测试结果：
```bash
# 当我不断：
curl http://localhost:8888
# 出现
➜  test node blocked.js
当前每秒循环数777574
当前每秒循环数890565
# 当我们搞事情时：
ab -c 10 -n 200 http://localhost:8888/

# 结果是这样的：
➜  test node blocked.js
当前每秒循环数843594
当前每秒循环数913329
当前每秒循环数2
当前每秒循环数2
```
修改为了第2版后，电脑不再烫了，风扇不再转了。cpu 只有在采样时会上升到30、40样子，不错。

但同时也发现了问题：一秒才**2次循环**！！这时基本处于**拉闸**了。为什么呢？

因为我们的请求处理是**同步**的！同步地生成一个子进程，并且等到子进程运行完了，才把结果返回。可见，在 **server 项目中启用耗时的同步操作，风险是多么大！！**

我们把**同步**换为**异步**试试：
```js
// non-blocked.js
const max = 9999;
const getComputedValueFromChildProcess = (max) => new Promise((res, rej) => {
    execFile('node', [path.join(__dirname, './childprocess.js'), max], (err, stdout) => {
        const valueFromChildProcess = Number(stdout);
        res(valueFromChildProcess);
    });
});

http.createServer(async (req, res) => {
    const k = await getComputedValueFromChildProcess(max);
    res.write('origin-text: ' + k);
    res.end();
}).listen(8888);
```
PS: 为了示范同步、异步的区别，本文用的是子进程这种方式。其实更好的应该是用 worker_thread 的方式、或者分片计算等。让我们用相同的 ab 进行测试，得到结果：
```base
➜  test node non-blocked.js
当前每秒循环数239920
当前每秒循环数242286
```
可以看到，虽然比空转时的100W同样低了不是一点点。但相对于同步的方式，这个数量级简直不能对比！！

## 总结
到现在，大家应该对监控 event loop 有个基本认识了。本来想搞一个 npm 包的，但最近比较忙，只能先抛砖，大家有玉的使劲砸。😬😬😬

## 广告时间
**字节跳动招聘~头条研发前端**
头条研发前端团队期待你的加入，这里有今日头条、西瓜视频、搜索、小程序、皮皮虾、好好学习、飞聊、国际化、教育、安全、游戏、前端基础技术等等多个方向的机会任你挑选。
欢迎小伙伴们找我内推~内推直通车：tanzhixuan@bytedance.com
私聊亦可哟😘

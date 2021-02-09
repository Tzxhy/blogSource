---
title: 关于nodejs的调试
date: 2019-03-07 14:11:55
tags:
- Nodejs
- 调试
categories: Nodejs
---
# 关于调试
## 需要注意的
Node在V7.7之前，调试可以用node debug index.js启动命令行的debug，或者使用node --debug index.js启动可连接chrome的调试窗口。在v7.7之后，使用inspect代替（inspect-brk）。下面分情况来具体描述怎么愉快滴调试node。
<!-- more -->
## 关于版本
官方原话是，--inspect[=[host:]port]新增于6.3，--inspect-brk[=[host:]port]新增于7.6，--inspect-port=[host:]port同样于7.6。在v7.7的时候，官方就把debug和debug-brk给干掉了，让大家用他们的inspect、inspect-brk。好，历史介绍完，干正事。

## 关于老项目
啥是老项目？就是说其依赖的node版本比较低，在当时设计的时候没有使用、考虑到官方现在的一些新特性（当然没有，又不能穿越），并且项目也没有与时俱进，导致存在版本兼容问题，就是说我现在用高版本去运行这个项目，使用新特性的时候，可能这个项目并不支持。比如低版本对async、let、const等，以及对node命令行的参数不支持，如--inspect-brk等。那么对于老项目，咱们怎么调试捏？高潮来了。

## 了解--debug和--debug-brk
这就是调试的关键属性。不同之处是前者直接运行代码，直到遇到debugger语句。后者会停在代码第一句，等待调试器连接后，在调试器上点击继续运行后才正常运行。还有一个不带俩中划线的，光棍debug，它用来在命令行中开起debug环境。在命令行环境中，会出现：

```bash
node-debug-tutorial ✗ node debug helloword-debug.js
< debugger listening on port 5858
connecting... ok
break in helloword-debug.js:1
  1 var hello = 'hello';
  2 var world = 'nodejs';
  3 
debug> help
Commands: run (r), cont (c), next (n), step (s), out (o), backtrace (bt), setBreakpoint (sb), clearBreakpoint (cb),
watch, unwatch, watchers, repl, restart, kill, list, scripts, breakOnException, breakpoints, version
debug> 
debug> n
break in helloword-debug.js:2
  1 var hello = 'hello';
  2 var world = 'nodejs';
  3 
  4 debugger;
debug> repl
Press Ctrl + C to leave debug repl
> hello
'hello'
```
在debug>后面可以输入这些命令：

命令 | 作用
:--- | :---
run | 执行脚本,在第一行暂停
restart |	重新执行脚本
cont, c |	继续执行,直到遇到下一个断点
next, n	| 单步执行
step, s |	单步执行并进入函数
out, o | 从函数中步出
setBreakpoint(), sb() | 当前行设置断点
setBreakpoint(‘f()’), sb(...) | 在函数f的第一行设置断点
setBreakpoint(‘script.js’, 20), sb(...)	| 在 script.js 的第20行设置断点
clearBreakpoint, cb(...) | 清除所有断点
backtrace, bt | 显示当前的调用栈
list(5) | 显示当前执行到的前后5行代码
watch(expr) | 把表达式 expr 加入监视列表
unwatch(expr) | 把表达式 expr 从监视列表移除
watchers | 显示监视列表中所有的表达式和值
repl | 在当前上下文打开即时求值环境
kill | 终止当前执行的脚本
scripts | 显示当前已加载的所有脚本
version	| 显示v8版本

如你所见，命令行的方式确实麻烦。所幸，debug支持图形界面：

## 安装图形界面支持库
这玩意儿叫node-inspect。自行安装全局后，node-inspect & 让他后台运行。会看到：
```bash
Visit http://127.0.0.1:8080/?port=5858 to start debugging.
```
表明让你node-inspect起到了8080端口上（注意是否有端口占用），调试程序的端口在后面port中指定。一般--debug的程序默认端口是5858.

## 开始图形界面的调试
命令行中输入node --debug index.js或者node --debug-brk index.js即可（看你具体的需求，一般来说–debug就可以）。会提示：
```bash
Debugger listening on [::]:5858
```

这样的文字，表明调试端口起在了5858端口（如果有冲突，可以--debug=port指定端口号）。然后访问刚开始的node-inspect起的服务器，在port后输入上面看到的端口号。界面如下：

![debug](/images/debug-1.png)

到这里就说明正确了，可以调试了鸭！



## 高版本Node的调试
高版本的就简单多了，直接用命令：
```bash
node --inspect index.js
node --inspect-brk index.js
```
即可。对于稍低版本的node，会提示：

```bash
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@60cd6e859b9f557d2312f5bf532f6aec5f284980/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:5859/0be383d4-bea2-4ff2-b916-9ba2ed2805e1
```
直接访问这个地址即可。对于高版本的node，会提示：

```bash
Debugger listening on ws://127.0.0.1:9229/b9d17b0a-2a0c-4668-b7da-60f2016725e4
For help see https://nodejs.org/en/docs/inspector
```
这个时候只需要在chrome地址栏输入：chrome://inspect，在configure中添加对应的端口号。就可以在Remote Target下面看到你要调试的程序了。如下图：

![debug](/images/debug-2.png)

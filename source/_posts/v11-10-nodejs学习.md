---
title: v11.10 nodejs学习(一)
date: 2019-02-21 18:30:39
categories:
- nodejs
tags:
- nodejs
- v11
---

__学而时更之，不亦乐乎__

版本：V11.10 LTS

__Note__: 内容主要以个人基础为起点，只记录了个人认为需要的东西。[官网](https://nodejs.org/api/)

## Async Hooks
**v8新增**。用于监测所有异步操作。目前处于实验阶段。

### async_hooks.executionAsyncId()
返回当前环境上下文的ID。

### async_hooks.triggerAsyncId()
返回触发当前代码执行的环境上下文ID。比如，在一个Tick（环境ID假设为1）中执行了异步操作A，那么A的triggerId就是1。

### async_hooks.createHook(callbacks)
- callback: <对象>

创建一个Hook实例hook，callback是个回调对象，可包含init/before/after/destroy/promiseResolve。__NOTE__：由于console.log在Nodejs中也是异步操作，因此不能在各个回调中使用log来打印信息，会无限循环。常见的采用写文件方式。关于console.log是异步的验证，如下代码：
```js
const asyncHooks = require('async_hooks');
const fs = require('fs');
console.log(process.stdout.isTTY);

asyncHooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      const eid = asyncHooks.executionAsyncId();
      debugger;
      fs.writeSync(
        1, `init: ${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
    }
}).enable();

require('net').createServer((conn) => {}).listen(8080);
console.log('log1');
console.log('log2');
```
会输出：
```txt
true
init: TCPSERVERWRAP(5): trigger: 1 execution: 1
init: TickObject(6): trigger: 5 execution: 1
log1
init: TickObject(7): trigger: 1 execution: 1
log2
init: TickObject(8): trigger: 1 execution: 1
```
然后代码中去掉最后两行log，输出：
```txt
true
init: TCPSERVERWRAP(5): trigger: 1 execution: 1
init: TickObject(6): trigger: 5 execution: 1
```
发现，console.log的调用过程存在异步的调用（关于process.stdout是异步还是同步，process一节有说明，但我觉得不能解释这个console.log是异步 TODO）

根据文档及我的理解，executionAsyncId为0，是C/C++环境上的上下文；1，是主程序的环境（及全局）；之后递增的，便是走event loop的异步环境。triggerAsyncId是触发这次异步操作的executionAsyncId。
### hook.enable() / disable()
开启或者关闭（在create后默认是关闭的）。
### 回调配置
#### before(async)
- asyncId: 数字

当异步操作初始化后或者完成时，将调用回调来通知用户。before回调在所述回调执行前执行。before回调可能被执行0次或N次。当异步操作被取消时，before不会被调用；类似TCP服务器会调用before多次；像fs.open只会调用一次。

#### after(asyncId)
- asyncId: 数字

当通知用户的回调执行完成后立即执行。

#### destroy(asyncId)
当与asyncId相关的资源销毁时（依赖于gc）被调用。它也会被内嵌的API __emitDestroy()__调用。

#### promiseResolve(asyncId)
当Promise的resolve调用时被调用。
<!-- more -->
___
## Buffer
Buffer为Nodejs提供了对二进制文件的操作。
### 关于构造函数
由于安全、易用性等，现已废除**new Buffer**构造器。使用Buffer.alloc/from/allocUnsafe等代替。
### `--zero-fill-buffers`
开启每次生成buffer都清空数据。
### 关于Buffer.from是copy还是share
当Buffer.from传入一个TypedArray时，会复制该typedArray的content；当传入typedArray.buffer属性时，会share该buffer。
### 遍历
可以只用for...of，buf.keys(), buf.values(), buf.entries()

### Class: Buffer
#### new Buffer
所有参数形式的构造函数均废弃。采用**Buffer.from**替代。
#### Class Method: Buffer.alloc(size[, fill[, encoding]])
- size: buffer大小
- fill：string|buffer|integer，默认为0
- encoding：默认utf8
如果指定了fill和encoding，会在初始化后调用buf.fill(fill, encoding)来重置内存。
#### Class Method: Buffer.allocUnsafe(size)
基本跟上面那个一样，但是不会用buf.fill(fill, encoding)来重置内存。Buffer内部有个预分配的内部Buffer实例，用于快速分配新的Buffer实例，前提是通过Buffer.allowUnsafe来创建。当大小小于4k时，会使用这个pool。
#### Class Method: Buffer.allocUnsafeSlow(size)
不采用内部的pool，可以长久保存（需要注意内存泄露的问题）。
___

## Child Processes
默认上，stdin/stdout/stderr的管道建立在Nodejs进程和衍生进程间。这些管道都是有限制的（通常还与平台有关），当子进程输出到stdout上超过了被消费的内容，子进程就会阻塞管道缓冲区接收更多数据。这与shell的管道行为一致。如果不消费输入，可以设置 **{stdio: 'ignore'}**。

child_process.spawn()会异步的产生子进程，不会阻塞event loop；child_process.spawnSync()同步的产生子进程，阻塞，直到进程退出或者被干掉。

Nodejs提供了为数不多的同步和异步方法来代替spawn/spawnSync。但是，其他API都是以spawn/spawnSync为基础实现的。
- child_process.exec: 产生一个shell，并在这个shell中运行命令，当结束后将stdout和stderr传给回调函数。
- child_process.execFile: 与上者类似，但它直接执行命令而不是先生成一个shell。
- child_process.fork: 产生一个新的Nodejs进程，调用指定的模块建立IPC通信通道，允许在父和子之间发送消息。
- child_process.execSync: 同步
- child_process.execFileSync: 同步

虽然同步看着很棒，但会极大地影响event loop的速度。

所有异步的API，都会返回一个ChildProcess实例，该类实现了EventEmitter，所以只需对实例监听事件即可。exec和execFile额外支持一个可选的**callback**参数，当子进程终结时会回调。

### windows上衍生.bat .cmd文件
在类Unix平台（Unix、Linux、MacOS等）上，execFile更高效，因为它不会产生一个shell。在windows上，.bat和.cmd文件不能在没有终端的情况下靠它自己运行起来，因此windows上不能调用exeFile。在Windows上需要使用exec或者spawn（例子见官网）。

### exec(command[, options][, callback])
- command: 字符串。参数以空格区分。
- options: 对象
  - cwd: 工作目录。default: null
  - env: 环境键值对。default: null
  - encoding: 默认'utf8'
  - shell: 字符串，执行命令的shell。UNIX上默认'/bin/sh'，windows： process.env.ComSpec
  - timeout: 超时时间，默认0
  - maxBuffer: 在stdout或stderr上最大的数据量（字节），如果超出，子进程会被干掉，输出也会被截断。
  - killSignal: 字符串或者数字。默认'SIGTERM'
  - uid: 数字
  - gid: 数字
  - windowsHide: 布尔。隐藏windows子进程的输出框。默认：false
- callback: 当进城拉闸时调用
  - error
  - stdout
  - stderr
- Returns: ChildProcess实例

在生成的shell中运行 **command** 命令，传递给exec的命令由shell直接处理，以及一些特殊字符需要相应处理。
```js
exec('"/path/to/test file/test.sh" arg1 arg2');
// path中包含空格的，需要包起来
```
如果传递了callback参数，它在子进程结束时会调用被（error, stdout, stderr）。成功时，error为null；有错误时，error为Error实例。error.code为退出状态码，error.signal为被干掉时的信号。stdout/stderr可能为字符串或者buffer，取决于options中encoding的值。

如果运行超过timeout，父进程会发送SIGTERM（默认终结信号，可通过killSignal改变）来终结子进程。

### child_process.execFile(file[, args][, options][, callback])
- file: path to file
- args: <string[]>

execFile和exec很类似，但不会产生一个shell。也因为如此，IO的重定向、文件通配符等不支持。

### child_process.fork(modulePath[, args][, options])
- modulePath: 子进程中需要运行的模块的路径
- args: <string[]>
- options:
  - cwd
  - detached: 布尔。子进程独立于父进程运行。详见下文。
  - env
  - execPath: 用于创建子进程的可执行文件路径
  - execArgv: 字符串数组。default：process.execArgv
  - silent: 布尔。如果true，子进程的stdin、stdout、stderr都会pipe到父进程，否则会继承父进程。
  - stdio: 当传递了该项，会覆盖silent选项。见下文
  - windowsVerbatimArguments
  - uid
  - gid
- Returns: ChildProcess实例

fork的子进程实例有一些父子间进程内建的通信信道。fork默认会使用父进程的process.execPath来产生新的Node.js实例。

### child_process.spawn(command[, args][, options])
- command: 要执行的命令
- args: 字符串数组，
- options:
  - cwd:
  - env
  - argv0: 设置argv[0]。
  - stdio：见下文
  - detached
  - uid
  - gid
  - shell
  - windowsVerbatimArguments
  - windowsHide
- Returns: ChildProcess实例



### options.detached
在windows上，设为true，能够让子进程在父进程拉闸后继续运行。子进程有它自己的console窗口。一旦对一个子进程开启分离选项，就不能再关闭了。

在非Windows平台上，如果设为true，子进程会成为一个新的进程组和会话的先导者。注意，父进程退出后，子进程可能会继续运行，而不管它们是否已分离。

默认情况下，父进程会等待分离的子进程退出。为了避免父进程等待子进程退出这种情况，可以在父进程中使用subProcess.unref() (subProcess是ChildProcess实例)方法。原理是这样会让父进程的event loop排除子进程。能让父进程独立于子进程退出， **前提是父子进程间没有建立的IPC信道**。

当使用这个选项来开启长期运行的进程，当父进程退出后，子进程不会保持在后台继续运行，除非提供了未连接到父进程的stdio配置。如果继承了父进程的stdio，子进程将保持链接到控制终端。

### options.stdio
该选项用于配置建立在父子进程间的管道。默认情况下，子进程的stdin、stdout、stderr都重定向到相应的subprocess.stdin、stdout、stderr流上。这等于设置options.stdio为['pipe', 'pipe', 'pipe']。

stdio可能为以下值：
- 'pipe': 等于['pipe', 'pipe', 'pipe']，为默认值。
- 'ignore': 等于['ignore', 'ignore', 'ignore']
- 'inherit': 等于['inherit', 'inherit', 'inherit']或者[0, 1, 2]

否则options.stdio就是一个数组。在0，1，2位置上可以为以下值：
1. 'pipe' - 在父子进程间建立一个管道。管道的父端作为子进程对象的属性 **subprocess.stdio[fd]** 暴露到父进程。fds0-2 分别代表着subprocess.stdin/stdout/stderr。
2. 'ipc' - 在父子进程间建立传递信息、文件描述符的IPC通道。一个ChildProcess实例最多有一个IPCstdio文件描述符。设置为此项，会开启subprocess.send()方法。如果子进程是Node.js进程，IPC通道的存在将启用process.send()和process.disconnect()方法，在子进程中也有disconnect、message事件产生。
不支持不使用process.send()来获取IPC 通道fd或者对不是Node.js实例的子进程使用IPC通道。
3. 'ignore' - 子进程会忽略fd。由于Node.js会对子进程始终打开fds[0-2]，设为该值会让Node.js打开 /dev/null 并且链接到子进程fd上。
4. 'inherit' - 传递到父进程，类似与父进程共用控制终端的输入、输出。
5. \<Stream\> - 共享一个可读或可写的流，比如一个文本终端、文件、socket或者一个到子进程的管道。
6. 正整数 - 被作为fd解释。
7. null, undefined - 使用默认值。在0-2，使用'pipe'，3及以上，使用'ignore'

需要注意的是，当IPC通道建立在父子进程间，并且子进程是Node.js进程，子进程以未引用的IPC通道启动，直到子进程对'disconnect'或者'message'事件注册了回调。这允许子进程在没有被开放的IPC通道保持开启时正常退出。
___



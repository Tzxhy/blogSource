---
title: v11-10-nodejs学习-三
date: 2019-03-14 14:50:13
tags:
categories:
---
<!-- more -->
# Globals
### queueMicrotask(callback)
v11新增的API。用于将callback加入到当前phase的microtask队列里。需要注意的是：**process.nextTick在Nodejs的每次循环每个phase中总是会比microtask queue优先执行**

### TextDecoder/TextEncoder
文本的编码、解码

### URL/URLSearchParams
WHATWG制定。下文应该会有相关介绍。
___

## Inspector
可通过Inspector与v8的Inspector交互
```js
const inspector = require('inspector');
```
___

## Modules
### 缓存
默认下nodejs会对加载过的module进行缓存。但是，当操作系统为大小写不敏感（比如MacOS）时，require('A.js');require('a.js'); 会导致缓存两次。同时，不同代码处的requre('a')可能返回不一样的模块，具体参考nodejs的模块加载机制。

### require.main === module
可以用这个来判断当前文件是否是nodejs直接调用的文件。

### 循环引用
实际开发中很可能产生循环引用：a.js引用了b.js，b.js也引用了a.js。Nodejs的处理方式是产生循环引用时，先返回一个**未完成的copy**(这里是a.js)给调用者(这里是b.js)，等待调用者加载完毕，再回过来加载调用者。

### __dirname, __filename
分别表示当前文件的目录和当前文件绝对路径

### exports 和 module.exports
exports就是module.exports对象的引用。导出时具体有什么区别就跟js中一样了。可以把exports理解成函数的参数。它能保持对原对象的引用。

### require.cache
返回一个对象，键值对是文件模块引用的其他模块。可以删除某个键值对a，在下次require('a')时会重新加载。

### require.resolve(request[, options])
返回找到的文件模块的path

### require.resolve.paths(request)
返回找到的所有文件模块的path

___
## Net

___

## Path
### Path.resolve
如果首个参数不是绝对路径，那么会使用process.cwd()  （当前工作目录，就是启动node的目录）作为根路径。

### Path.posix
返回一个包含平台相关的path对象。比如想在Linux上拼凑windows平台的路径。

___

## perf_hooks


___

## Process
process 对象，能提供当前Nodejs进程信息以及控制当前进程。
### Process Events
process 对象也是EventEmitter的对象。有：
- beforeExit
- disconnect
- exit
- message
- multipleResolves **V10.12新增** 当一个Promise被多次resolve或者reject或者在resolve后reject或者反过来。该回调为错误捕获。
- rejectionHandled
- uncaughtException
- unhandledRejection
- warning
- Signal Events
#### 正确使用uncaughtException事件
该事件在触发后，进程会退出。应该在该回调中执行一些资源的清理（比如打开的文件）以及记录相关崩溃信息，而不要妄图去修复进城，期待它会再次好起来。详见[官网](https://nodejs.org/api/process.html)关于**Warning: Using `'uncaughtException'` correctly**一节。
### process.exit()
会尽快退出进程，而不管是否还有其他异步回调等待完成。优雅的方式是使用process.exitCode。
### process.abort()
立即结束Node.js进程，生成一个核心文件。不能在Worker threads中调用。
### process.allowedNodeEnvironmentFlags
**V10.10新增**返回一个只读Set，包含允许的NODE_OPTIONS环境变量。
### process.chdir(directory)
更换当前目录
### process.stderr
返回一个链接到stderr（及fd为2）的流。除非fd 2指向一个文件（这时是可写流），否则它都是一个net.Socket（可读可写流）。
### process.stdin
返回一个链接到stdin（及fd为0）的流。除非fd 0指向一个文件（这时是可读流），否则它都是一个net.Socket（可读可写流）。
### process.stdout
返回一个链接到stdin（及fd为1）的流。除非fd 1指向一个文件（这时是可写流），否则它都是一个net.Socket（可读可写流）。
### process.stdout and process.stderr注意点
1. 它们各自被console.log和console.error内部使用；
2. 写操作可能是同步的，取决于流链接到的是什么，以及系统是windows还是POSIX
    - 文件：在windows和POSIX上都是同步的
    - TTYs：windows上异步，POSIX上同步
    - 管道（以及socket）：windwos上同步，POSIX上异步

___

## Stream


___

## Trace Events

___


## TTY
主要跟终端相关的操作。

___

## V8
V8模块包含内嵌在NodejsV8版本的二进制文件中的API。由引用：
```js
const v8 = require('v8');
```
### v8.cachedDataVersionTag()
返回一个由v8版本、命令行标志和CPU特性决定的衍生值，为一个整数。主要用于判断 __vm.Script cachedData buffer__ 是否与当前nodejs实例兼容。

### v8.getHeapSpaceStatistics()
返回一个对象数组。代表了V8的堆空间的统计情况。

### v8.getHeapStatistics()
返回堆统计。

### v8.setFlagsFromString(flags)
编程设置v8的命令行flag。使用起来得当心，VM已经启动后再去修改设置，可能引起不可预估的行为，比如崩溃或者数据丢失，或者该设置无效。

### Serialization API
处于实验阶段。

#### v8.serialize(value)
value可为任意值。将value序列化为一个buffer对象。
#### v8.deserialize(buffer)
将buffer反序列化。buffer可为Buffer/TypedArray/DataView。

### v8.Serializer
#### new Serializer()
实例序列。
#### serializer.writeHeader()
写入头信息，包含格式版本等。
#### serializer.writeValue(value)
写入值。
#### serializer.releaseBuffer()
返回Buffer。返回内部存储的buffer。当buffer被释放时，serializer就不能再使用了。如果先前写入失败，调用该方法结果不可知。
#### serializer.transferArrayBuffer(id, arrayBuffer)
#### serializer.writeUint32 等

### v8.Deserializer 略

___

## VM
vm模块提供API来编译(javascript本身是解释型语言，不需要传统意义的编译，此处的编译应该是转为可执行代码，理论上任何代码都需这一步)代码及运行在V8虚拟机环境中。vm不提供任何安全机制，不要使用它运行不可信的代码。
vm提供了一个类似沙盒的容器，内部的环境与主程序环境隔离。可以传递给vm一个环境对象，这个对象的键值将作为sandbox的global。
```js
const vm = require('vm');
const x = 1;
const sandbox = { x: 2 };
vm.createContext(sandbox); // Contextify the sandbox.

const code = 'x += 40; var y = 17;';
// `x` and `y` are global variables in the sandboxed environment.
// Initially, x has the value 2 because that is the value of sandbox.x.
vm.runInContext(code, sandbox);

console.log(sandbox.x); // 42
console.log(sandbox.y); // 17

console.log(x); // 1; y is not defined.
```
### Class: vm.Script
vm.Script的实例包含了能直接在特定沙盒中运行的预编译代码。
#### Constructor: new vm.Script(code[, options])
- code: 要预编译的代码
- options: 对象或者字符串
    - filename: 用于stack追踪。默认'evalmachine.<anonymous>'
    - lineOffset: 指定行数的偏移。默认0
    - columnOffset
    - cachedData: <Buffer>|<TypedArray>|<DataView> 
    - importModuleDynamically: 当import()被调用时回调。
#### script.createCachedData()
v10.6.0增加
创建代码的缓存，可用于Script的构造器中cachedData选项。

#### script.runInContext(contextifiedSandbox[, options])
- contextifiedSandbox: 一个通过vm.createContext(context)修改过的context对象
- options: 
    - displayErrors: <Boolean>
    - timeout: 超时时间。严格大于0的整数
    - breakOnSigint
- Returns: 返回最后一条语句的结果

#### script.runInNewContext([sandbox[, options]])
- sandbox: 将被contextified的对象。
#### script.runInThisContext([options])
运行在当前环境（主程序中）
#### Timer等相关
由于内部机制，process.nextTick、microtask、Promise等异步实现在v8和nodejs内，可能导致在某个环境中的代码逃离timeout。如下：
```js
const vm = require('vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(loop);',
  { loop, console },
  { timeout: 5 }
);
```
即使设置了timeout，程序也会被无限死循环打印console.log，而不退出。（不存在是否有vm的参与，受timer的具体实现）。

___


## Zlib

___

## Worker Threads
当前为试验阶段。工作线程为Nodejs添加了线程级的API。V10.5以后版本，开启需要加--experimental-worker选项。线程间通过channel通信。
Worker线程类似于HTML规范中的Worker，主要用于处理CPU密集型计算。不适合用作IO工作。
比起子进程、集群，worker线程能共享内存。能通过传递ArrayBuffer实例或者SharedArrayBuffer实例来共享数据。
### Worker.isMainThread
**v10.5.0新增**，表示当前代码是否运行在Worker线程里。
### Worker.parentPort
**v10.5.0新增**，如果当前线程是worker线程，它指向父线程。
### Worker.threadId
当前线程ID。
### 省略
其它操作类似浏览器的worker。比如发送数据、监听事件等。



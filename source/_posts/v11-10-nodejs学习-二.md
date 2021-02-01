---
title: v11.10 nodejs学习(二)
date: 2019-02-24 13:20:31
tags: v11.10, nodejs
---


<!-- more -->
___

# Cluster
Node.js的单个实例运行在单线程中。要利用多核，需要开启node.js进程的集群，来处理负载。使用cluster模块，很容易创建共享server端口的子进程。

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
### 工作原理
worker子进程是使用child_process.fork生成的，所以子进程可以通过IPC通道和父进程往返传递server句柄。

cluster支持两种分发请求方式：
1. 默认的方式（windows除外），循环。主进程监听一个端口，接收新的请求，利用一些内建的方式来负载均衡，循环分发这些请求到workers。
2. 主进程创建侦听套接字并将其发送给感兴趣的worker。然后worker直接接受传入的连接。

第二种方案，讲道理应该是性能最优的，但由于操作系统的调度不可预测，会导致负载极其不均。假设8个进程，会出现2个进程占据了70%的请求的情况。

因为server.listen()把大部分工作都扔给了主进程，普通的Node.js进程和集群的进程有3种case不一样：
1. server.listen({fd: 7}) 因为消息发送给了主进程，父进程的文件描述符7会被监听，句柄被传递给worker进程，而不是监听worker对文件文件描述符7的想法。
2. server.listen(handle) Listening on handles explicitly will cause the worker to use the supplied handle, rather than talk to the master process. 明确监听句柄会导致worker使用提供的句柄，而不会与主进程交流。
3. server.listen(0) 通常这会让服务器监听一个随机的端口。然而在集群模式下，每一个worker会收到相同的“随机”端口。端口一开始是随机的，但那之后便是可预测的。监听一个唯一的端口，基于集群worker ID生成一个端口号。




___

# Console
该模块暴露了2个组件：
- Class Console。具有如log、error、warn等方法可以用于向nodejs streeam输出
- global console instance，已被默认配置输出到process.stdout和process.stderr。

### Class: Console
#### new Console(stdout[,stderr][,ignoreErrors])
#### new Console(options)
- options
    - stdout: <stream.Writable>
    - stdeer: <stream.Writable>
    - ignoreErrors: boolean. Default: true
    - colorMode: boolean | string true, 'auto'(default)
    - inspectOptions
可用自己实例化一个console，然后替换默认的。
```js
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
```
### console常用方法
log/assert/count/countReeset/debug/dir/dirxml/error/group/info/table/time/timeEnd/trace/warn等。

**v9.3.0中**，console.debug is now an alias for console.log.

___

# Crypto(TODO)

___

# ECMAScript Modules
- 开启： --experimental-modules。开启后能够加载.mjs后缀的es模块文件
### 特性：
- 支持：
只有CLI进入的主入口点能成为ESM依赖的入口。在运行时动态引入也能用于建立ESM入口点。

___

# File System
fs模块提供了接近于标准POSIX函数与文件系统交互的API接口。

所有api均提供了同步和异步的方式。

异步的方式，最后一个参数接收一个完成时回调函数，传递给该回调的参数取决于方法，但第一个参数总是一个异常值。如果操作成功执行，第一个值就是null或者undefined。

使用同步方法产生的异常，可以用try/catch捕获，或者让其冒泡。

使用异步方法不能保证谁先完成。如果对时序有要求，需要将其他代码放入回调中。

在复杂的进程中，优先考虑异步方法。同步的会block住主进程，直到它们完成。

## File paths
大多数的fs操作接收这些形式的文件路径：字符串，Buffer，使用file:协议的URL对象。

字符串形式的路径被解释为UTF8字符序列，可标识绝对或者相对路径。相对路径会相对于当前工作目录（proceess.cwd()）。其他两种形式的path不做介绍。

## 文件描述符
在POSIX系统上，对于每一个进程来说，内核维护了一张表示当前打开的文件和资源的数据表。每一个打开的文件被赋予了一个简单的数字标志符，称为文件描述符fd。在系统级别，所有文件系统的操作都使用那些fd来识别、追踪具体文件。Windows操作系统使用了一种不一样，但概念上相似的机制来追踪资源。为了方便使用者，Node.js抽象了在不同平台的差异，都通过分配一个数字fd来标志打开的资源。

fs.open()方法用来分配一个新的文件描述符（后文统称为fd）。一旦分配好了，该fd可能被用于从文件中读取数据、写入输入或者获取关于文件的信息等。

```js
fs.open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  fs.fstat(fd, (err, stat) => {
    if (err) throw err;
    // use stat

    // always close the file descriptor!
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
});
```
大多数的操作系统限制fd的数量，因为它会在任意时间打开，所以当操作完毕的时候，需要及时关闭fd。不这样做的话，会导致内存泄露，最终让应用拉闸。

## 线程池使用
除fs.FSWatcher()之外的所有文件系统API以及明确的同步文件系统API，它们都使用libuv的线程池，这对某些应用程序可能会产生令人惊讶的负面性能影响。有关更多信息，请参阅UV_THREADPOOL_SIZE文档。

## Class定义
### Class: fs.Dirent
**V10.10新增**，当fs.readdir或者同步方法以withFileTypes: true调用时，返回的结果不再是字符串或者Buffers，而是fs.Dirent对象。
#### dirent.isBlockDevice()
是否是块设备。
#### dirent.isCharacterDevice()
#### dirent.isDirectory()
#### dirent.isFIFO()
#### dirent.isFile()
#### dirent.isSocket()
#### dirent.isSymbolicLink()
#### dirent.name
文件名。与encoding有关。

### Class: fs.FSWatcher
成功的fs.watch()调用会返回一个fs.FSWatcher对象。当监控的文件发生变化后，‘change’事件会被触发。
#### Event: 'change'
- eventType: string. 事件的类型。
- filename: string. 发生改变的文件名。

当监控的目录或者文件发生变化时触发该事件。

#### Event: 'close'
**V10.0新增**，当watcher停止监听变化时触发。
___
#### Event: 'error'
当在监听一个文件时出错后出发。
#### watcher.close()
停止监听变化。一旦停止，fs.FSWatcher对象不再可用。（close、error事件同样）

### Class: fs.ReadStream
成功的fs.createReadStream()调用会返回一个fs.ReadStream对象。所有fs.ReadStream对象都是可读流。

#### Event: 'close'
当fs.ReadStream的底层fd被关闭时触发。
#### Event: 'open'
- fd

当fs.ReadStream的fd被打开时触发。

#### Event: 'ready'
当fs.ReadStream可以使用时触发。在'open'触发之后立即触发。
#### readStream.bytesRead
- number

到目前为止读取了的字节数。

#### readStream.path
- string | Buffer

传递给fs.createReadStream()的第一个参数。
#### readStream.pending
**v11.2新增**
- boolean

如果底层fd还没有打开，会返回true。比如，在'ready'事件被触发前。

### Class: fs.Stats
一个fs.Stats的对象提供关于一个文件的信息。

调用fs.stat/lstat/fstat以及同步方法返回的对象是fs.Stats的实例。如果options中的bigint被设为true，那么数字值将会是bigint而不是number。

#### stats.isBlockDevice()
#### stats.isCharacterDevice()
#### stats.isDirectory()
#### stats.isFIFO()
#### stats.isFile()
#### stats.isSocket()
#### stats.isSymbolicLink()
#### stats.dev
- number | bigint

包含文件的设备的数字标志符。
#### stats.ino
- number | bigint

文件系统具体的'Inode'数量。
#### stats.mode
比特位的描述文件类型及权限。

#### stats.nlink
- number | biginit

硬链接到该文件的数量。
#### stats.uid/gid
文件的拥有者id、组id
#### stats.size
文件的总大小（字节）。
#### stats.atimeMs
文件最后一次访问的毫秒时间。
#### stats.mtimeMs#
文件最后一次修改的毫秒时间。
#### stats.ctimeMs
文件状态最后一次被修改的的毫秒时间。
#### stats.birthtimeMs
文件的创建时间。
#### stats.atime/mtime/ctime/birthtime
同上。但是返回一个Date对象。


### Class: fs.WriteStream
可写流。

#### Event: 'close'
#### Event: 'open'
#### Event: 'ready'
#### writeStream.bytesWritten
#### writeStream.path
#### writeStream.pending

### fs.access(path[, mode], callback)
- path: string | Buffer | URL
- mode: integer. 默认：fs.constants.F_OK
- callback: Function
  - err: Error

以指定mode来测试用户对于一个给定path的文件或者目录的权限。mode参数是一个可选的整数，它指定了要检查的具体权限。可以用或运算符来添加多个要检查的权限。比如(fs.constants.W_OK | fs.constants.R_OK)

最后一个参数，callback，以一个err为参数的回调。如果检查中出现任何错误，err就是Error的对象。否则为null或者undefined。
```js
const file = 'package.json';

// Check if the file exists in the current directory.
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// Check if the file is readable.
fs.access(file, fs.constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// Check if the file is writable.
fs.access(file, fs.constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// Check if the file exists in the current directory, and if it is writable.
fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(
      `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
  } else {
    console.log(`${file} exists, and it is writable`);
  }
});
```
在fs.open/readFile/writeFile之前使用fs.access来检查可访问性是不推荐的。这样做会导致竞态出现：两个操作之间可能有其他处理改变了文件的状态。相反，用户应该直接使用open/readFile/writeFile等方法，在回调中去检查文件是否可访问。

通常来说，只有当不直接使用文件时，才会使用fs.access来检查可访问性。比如，一个文件是否存在，作为一个开关控制程序的运行。

Windows上，目录的访问控制政策access-control policies (ACLs)也许限制访问文件或者目录。然而fs.access函数并不检查ACL，因此也许会返回该路径可访问的状态，即使ACL限制了用户读取或者写入。

### fs.accessSync(path[, mode])
无返回值。如果有错，会throw一个错误。需要try、catch捕获。
```js
try {
  fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

### fs.appendFile(path, data[, options], callback)
- path: string | Buffer | URL | number(fd)
- data: string | Buffer
- options: object | string。如果是字符串，则指定编码格式。
  - encoding: string | null. Default: 'utf8'
  - mode: 整数。默认0o666.
  - flag: string。详见文件系统支持的flag。默认: 'a'
- callback: function
  - err: Error

异步地增加数据到一个文件。如果文件不存在则创建。

### fs.appendFileSync(path, data[, options])
同样用try/catch捕获错误。

### fs.chmod(path, mode, callback)
改变一个文件的权限。

### File modes
mode参数被fs.chmod和fs.chmodSync方式使用。
Constant | Octal | Description
 ---- | ---- | ----
 fs.constants.S_IRUSR |	0o400	| read by owner
fs.constants.S_IWUSR	| 0o200 |	write by owner
fs.constants.S_IXUSR	| 0o100 |	execute/search by owner
fs.constants.S_IRGRP	| 0o40 |	read by group
fs.constants.S_IWGRP	| 0o20 |	write by group
fs.constants.S_IXGRP	| 0o10 |	execute/search by group
fs.constants.S_IROTH	| 0o4 |	read by others
fs.constants.S_IWOTH	| 0o2 |	write by others
fs.constants.S_IXOTH	| 0o1 |	execute/search by others

### fs.chmodSync(path, mode)
### fs.chown(path, uid, gid, callback)
- uid: integer
- gid: integer

### fs.chownSync(path, uid, gid)
### fs.close(fd, callback)
- fd: integer
- callback: Function
  - err

关闭fd。
### fs.closeSync(fd)
### fs.constants
- Object

返回一个只包含文件系统操作的常量对象。定义在FS Constants(见官网).
### fs.copyFile(src, dest[, flags], callback)
- src: string | Buffer | URL
- dest: string | Buffer | URL
- flags: number。复制的修改符。默认：0
- callback

默认上，dest如果已经存在，会覆盖。Node.js不保证复制操作的原子性。如果在已打开dest文件准备写入而发生错误，Node.js会尝试清除dest文件。

flags是个可选的整型，它指定了复制操作的行为。可以使用OR来包含更多标志位。(e.g. fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE)
```js
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;
// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
fs.copyFile('source.txt', 'destination.txt', COPYFILE_EXCL, callback);
```

### fs.createReadStream(path[, options])
- options: string | object
  - flags: default: 'r'
  - encoding: string. default: 'null'
  - fd: integer. 默认null
  - mode: integer。 default：0o666
  - autoClose: boolean. default: true
  - start: integer
  - end: integer. default: Inifinity
  - highWaterMark: integer. default: 64 * 1024
- returns: fs.ReadStream

不像readable stream一样默认的16kb highWaterMark值，该返回的stream默认为64kb。

opions中的start和end可以读取某个范围内地数据，而不是整个文件。start和end都是包含临界点地数据，同时以0为开始。如果fd指定了，start忽略了，fs.createReadStream会从文件的当前位置开始读取。如果fd指定了，ReadStream会忽略path参数而使用具体的fd。这意味着将没有 **open** 事件触发。fd应该是阻塞的；非阻塞的fd应该传递给net.Socket.

如果fd指向了只支持阻塞读取的字符设备，比如键盘或者声卡，在数据可用之前，读操作不会完成。这避免了进程退出和流关闭。
```js
const fs = require('fs');
// Create a stream from some character device.
const stream = fs.createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```

### fs.createWriteStream(path[, options])
### fs.fchmod(fd, mode, callback)
和chomd差不多，不过第一个参数不是path了，而是fd。
### fs.fchown(fd, uid, gid, callback)
### fs.fsync(fd, callback)
刷新对该fd的内核数据到外部永久介质上。
### fs.fdatasync(fd, callback)
fdatasync函数类似于fsync函数，但它仅仅影响文件数据部分。
### fs.fstat(fd[, options], callback)
### fs.ftruncate(fd[, len], callback)
缩短文件到指定len长度。
### fs.link(existingPath, newPath, callback)
### fs.lstat(path[, options], callback)
与stat差不多。不过，如果path是一个link的话，它返回该link的信息，而不是该link所指向的文件。

### fs.mkdir(path[, options], callback)
- path
- options: integer | object
  - recursive: boolean. default: false
  - mode: integer. Windows不支持。Default: 0o777
- callback:
  - err

### fs.mkdtemp(prefix[, options], callback)
- prefix: string
- options: string | object
  - encoding: string. Default: 'utf8'
- callback:
  - err
  - folder

创建一个唯一的临时文件夹。

### fs.open(path[, flags[, mode]], callback)
- path
- flags: string | number. Default: 'r'
- mode: integer. Default: 0o666(可读可写)
- callback
  - err
  - fd

返回一个fd。

### fs.read(fd, buffer, offset, length, position, callback)
- buffer: 将读取的数据放入到buffer里
- offset: 写入buffer时的偏移
- length: 读取的字节数。
- position: 读取的开始位置。
- callback
  - err
  - bytesRead: integer
  - buffer

### fs.readdir(path[, options], callback)
- options
  - encoding: string. Default: 'utf8'
  - withFileTypes: boolean. Default: false
- callback
  - err
  - files: string[] | Buffer[] | fs.Dirent[]

读取目录的内容。若encoding为'buffer'，则files为Buffer[];若withFileTypes为true，则files为fs.Dirent[]。

### fs.readFile(path[, options], callback)
- path: string | Buffer | URL | integer. 文件名或者fd

### File Descriptors
1. 所有具体的文件描述符都必须支持读取；
2. 如果一个文件描述符以path创建，它不会自动关闭；
3. 读取会从当前位置开始。比如：如果文件已经有‘Hello World’内容，而且以fd方式已经读取了6个字节，对fs.readFile使用该fd继续读取，数据将是World，而不是Hello World。

### fs.readlink(path[, options], callback)
读取link文件的信息。

### fs.readSync(fd, buffer, offset, length, position)
### fs.realpath(path[, options], callback)




___


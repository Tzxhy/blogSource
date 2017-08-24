---
title: nodejs模块加载系列问题
date: 2017-06-06 09:11:33
tags: nodejs 模块加载
---

# nodejs模块加载机制

## 模块分类

### 原生模块
　　比如， http， util， url， querystring，os，fs，path等等，这些都在源码包的lib下。当运行nodejs时，相当于已经加载了这些库，可通过require()直接获取。

### 自建文件模块
　　这些一般是自己写的js文件，以module.exports = function_name or object 导出，需要的时候，通过require("./file_path/file_name")访问，注意前面的./不能省略
<!-- more -->
### 第三方模块
　　这些一般是通过npm install 安装的第三方库。经常找不到的也是这些个模块了。并且分全局安装和本地安装，获取时也可能出现找不到的问题。

## nodejs中定义模块方式
　　exports.module_name or 　module.exports, 关于这两个的区别也很简单，不过要讲明白很费劲，关键点在于知道有 module 这个全局变量的存在.require返回的是module.exports，在module.exports上可以设置函数、对象实例、基本类型的变量等，因此，一般就是module.exports作为模块的导出就行了。
如果想用exports作为模块的返回，那么就为它设置一个属性，并且不要在module.exports上设置同名的属性。
简单的说实际上require返回的是module.exports，而默认module.exports是个空对象，exports变量指向module.exports。所以如果你想复写exports，直接写exports ＝ xxx; 肯定是不行的，因为这只是改变了变量exports的引用，并没有改变module.exports，所以就只能写成 module.exports = xxx;
## 第三方模块位置
```bash
npm config get/set prefix //查看设置全局安装目录，全局安装的模块就安装该目录下面的node_modules目录下

npm install [-g]  // -g 全局安装，模块将会安装到全局目录下。不带 -g 则直接安装在当前所在目录下，即为本地安装

```

## 引用文件方式
### 文件包含
require("./")
### 文件夹包含
require("dir_name");
#### 加载机制
&emsp;&emsp;首先搜索当前目录下的 package.json 文件，查找里面的main属性，如果存在，则加载该属性所指定的的文件。
如果不存在 package.json 或者该文件里面没有main字段，nodejs将试图加载 index.js 都不存在那么就只有说一声Cannot find module了。

## 模块在哪些地方搜索
### 逐级往上查找
在此介绍一个全局变量  process   里面包含了nodejs进程运行的所有信息，在此打印一下 process.mianModule,很明显，nodejs会从当前目录开始逐级往上搜索node_modules，找得到当然最好，找不到那么就会继续找node_path这个环境变量了
### 环境变量node_path
如果环境变量中有node_path的存在，并且该变量的值为全局安装的目录，那么也不会出现找不到模块的错

# require('这里应该怎么填')
## 相对路径指定模块
```bash
必须用到的符号： 
1. ./ 表示当前目录，相对路径所相对的就是当前的目录
2. ../ 表示上一级模块，可以无限使用直到跳转到根目录

```
这两个符号必须以其中一个开头，比如想加载当前目录下的另一模块，假设文件名为 hello.js 当前所在文件为 hi.js 我们需要在hi.js文件中这样写：
```javascript
var hello = require('./hello')//变量名随意，一般惯用文件名
```
在此基础上，再加入文件夹的名字，我们就可以加载到我们自己所写的任意模块了。
## 绝对路径指定模块地址
```javascript
var ex = require('F:\\nodejs\\node_modules\\ex')
```
## 直接使用 require('xxx')
那么所加载的模块要么是原生模块，要么该模块在某个node_modules目录下面
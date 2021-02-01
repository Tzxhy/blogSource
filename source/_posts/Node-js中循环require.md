---
title: Node.js中循环require
date: 2019-03-05 13:07:55
tags:
categories:
---
# 关于循环require的骚走位
## 前言
以前一直没关心这个问题，按正常的方式来require。但今天遇到了，收获了，疑问了。感触良多，思考不少。

## 起因
作为学习的一种方式，我准备搭建一个在线测试Ng匹配规则的平台，同时肩负静态文件提供（方便写日志的时候贴链接，防止外链失效或者比较慢）。后端Koa，路由用的koa-router。在路由设置这里，我的目录是这样的：

- router
  - index.js
  - ngServer.js

最开始我想着，可以一个route导出一个配置，有多少个router，app.js中就引用多少次，但这样有个问题，太low了，app.js看着也太乱了，还可能把我的路由功能直接暴露出来，而且不利于维护（加一个路由，得好几个地方加代码）。我想写不同的配置文件，然后index中全部引入，再导出给app.js引入来使用，这样的方式，app只用引入一次路由。

## 问题
首先看一下koa-router暴露出来的API：

![ff](/images/require-1.png)

能用的基本都是实例方法，也没有暴露出相应方法可以从其他文件加载方法，类似#addRouter(obj)之类的。虽然可以写兼容函数来实现，但总感觉这么多人用的东西，会没有好的解决办法？

我的错，写到这里时我已经发现了，use这个函数就是我所谓的addRouter。。。自黑尴尬脸。但我今天要说的不是这个，而是require的循环引用。

### 什么是循环引用
简单地说，就是A还没执行完毕时，呼唤（require）了B，B在执行时又呼唤了A，而且可能有调用A某些方法的欲望，这样你侬我侬的情景。我们可能理解起来觉得应该会出错，毕竟别人还没准备好，你就召唤别人了，这么心急。

对人可能是这么评价，但是对Node来说，它有自己的实现方式。下面打个例子：

A 模块中：


```javascript
console.log(' 开始加载 A 模块');
var b = require('./b.js');
console.log('in a, b is ', b);

exports.func = function() {
  console.log('调用 A 模块成功');
};

console.log('A 模块加载完毕');
```


B 模块中：


```javascript
console.log(' 开始加载 B 模块');
var A = require('./a.js');
console.log('in b, a is ', A);

exports.callAmodule = function() {
  A.func();
}
console.log('B 模块加载完毕');
```


运行以下代码：
```javascript
var a = require('./a.js');
var b = require('./b.js');
b.callAmodule();




// 结果：
开始加载 A 模块
开始加载 B 模块
in b, a is  {}
B 模块加载完毕
in a, b is  { callAmodule: [Function] }
A 模块加载完毕
调用 A 模块成功
```
来解释一下：require A的时候，执行console.log(' 开始加载A模块')；然后在A中require B，这时停止A的加载，开始B的加载；然后输出 ““开始加载B模块””。这时遇到去加载引用它的父模块A了。但由于A模块是部分加载，Node会直接跳过再次加载A的过程，运行到 "in b, a is"。这时的A并没有module.exports 或者exports导出属性，所以此时的A是空对象{}。然后B导出一个使用了A方法的方法。执行 “B 模块加载完成”。这时B模块加载完成，继续回到A中，继续加载。

这里有个小问题，为什么B中的callAmodule方法可以成功调用A的func？这里就要搞清楚module.exports 和 exports.method的区别了。因为A中使用的使exports.func来导出属性，相当于module模块exports属性又增添了一个属性，就module.exports来说，它的指向并没有改变。换而言之，如果使用

```js
module.exports = { // 这里相当于将module.exports重新指向一个新对象（不清楚的可以看一下javascript引用类型）
	func: function() {}
}
```
这样的话，在B中的callAmodule中使用的A就是A最开始的module.exports空对象了，就会导致调用出错。



---
title: toString和valueOf
date: 2019-03-07 14:07:02
tags:
categories:
- js
---
# toString and valueOf ???

## toString
今天在看以前写的代码时，遇到某个老师的点评：
```js
var obj = {};
var root = [1, 2, 3];
obj[root.join(',')] = value;
// comment - 直接使用  obj[root] = value;
```
<!-- more -->
一看到这个，我就又犯难了。我对这javascript的类型转换实在记不住！我知道obj[key]，中的key如果不是字符串，会调用key.toString()转换为字符串。但是不知道[1, 2, 3].toString() === "1,2,3"。虽然这些东西都是定死的，记不住也没关系吧，只要记得在类型值判断时尽量用严格判断就好。下面记几个常见的toString：
```js
var obj = {};
obj.toString() === '[object Object]';
[].toString() === '';
[1, 2, 3].toString() === '1,2,3';
['a', 2, function(){}].toString() === 'a,2,function(){}'; // 不不，这个不常见。
```

## valueOf
这个东西返回一个原始值，而且对各个JS固有对象，定义还不同。

对象 | 返回值
:---: | :---
Array | 数组本身。
Boolean | 自身Boolean值。
Date | 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC
Function | 函数本身。
Number | 数字值
Object | 对象本身。这是默认情况(没有重写valueOf)
String | 字符串值。

---
title: js中replace函数用法详解
date: 2017-06-15 11:09:05
tags: js 函数
---


## 用法

### replace最难用法
```javascript
var a = "thsif fsejf dsfse jsfs fesjf sef sjfes fesj fse";
a.replace(/(es)j/g, function(match, $1, $2, $3){console.log(arguments )});

// log
(4) ["esj", "es", 24, "thsif fsejf dsfse jsfs fesjf sef sjfes fesj fse", callee: function, Symbol(Symbol.iterator): function]0: "esj"1: "es"2: 243: "thsif fsejf dsfse jsfs fesjf sef sjfes fesj fse"callee: function (match, $1, $2, $3)length: 4Symbol(Symbol.iterator): function values()__proto__: Object
(4) ["esj", "es", 40, "thsif fsejf dsfse jsfs fesjf sef sjfes fesj fse", callee: function, Symbol(Symbol.iterator): function]
"thsif fsejf dsfse jsfs fundefinedf sef sjfes fundefined fse"

```
由以上可知，当replace第二个参数为函数的时候，接受一系列参数值，第一个参数值是匹配到的值（正则表达式匹配到的全部的值），从第二参数以后分别是$1, $2 .... 分别代表正则表达式中的第一个分组，第二个分组。。。分组完之后，便是匹配到的值的位置索引，下一个参数是调用的回调函数，再下一个是Symbol，具体啥用还不清楚。js中replace的正则形式复杂，但功能强大。

### 普通用法
```javascript
var a = "thsif fsejf dsfse jsfs fesjf sef sjfes fesj fse";
a.replace(/(es)j/g, "$1");
a.replace(/(es)j/g, "$&");//$&是匹配到的子串，相当于没有改变。
// log
"thsif fsejf dsfse jsfs fesf sef sjfes fes fse"
相当于去掉所有esj中的j
```


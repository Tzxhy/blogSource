---
title: input file 注意点
date: 2017-07-11 13:27:05
tags: input[type=file]
---


# 事件
file主要用到click和change事件,click是点击后产生,change是选择文件后属性值改变后产生.一般用到change事件.

# 清空值
IE8+ 不支持改变值为""而清空file选择文件.可以通过如下方法:
```javascript
var isIE = window.navigator.appName == 'Microsoft Internet Explorer'
if (isIE) { 
  var inputClone = this.$input.clone(true);
  this.$input.after(inputClone);
  this.$input.remove();
  this.$input = inputClone;
} 
这种方式是克隆后替换


或者设置file元素
$("#file")[0].outerHTML = $("#file")[0].outerHTML;
也可以达到清空效果

```

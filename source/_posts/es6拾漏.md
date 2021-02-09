---
title: es6拾漏
date: 2019-03-04 19:03:23
tags:
- es6
categories: ES
---
# es6中被我遗忘的点
1. 变量解构可以嵌套很多层，但平时总是习惯解构一层，再手动再解构一层。
2. 模板字符串处理可以使用${}之外，还有一个标签模板的功能，举个比方：
```js
let name = 'NB_tzx';
alert`My name is ${name}`
```
就是说`之间的会先解释，再将这个作为前面标签（函数）的输入。以前没遇到过。。
3. 对超过2字节的字符的支持。fromCodePoint(), codePointAt(), at()
4. 正则中sticky沾粘，还有点的全匹配，及s标志。增加了后行断言（?<=）（?<!），还有具名分组
```javascript
const RE_DATE = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31
```
于是可以用解构赋值来提取匹配的值。

### 关于没传值时直接报错的ES6方式

```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}
foo()
```

### Symbol
Symbol主要作用是防止对象的属性被无意地覆盖。通过保留对let a = Symbol()的引用，可以访问obj[a]。通过使用Symbol.for() 和 Symbol.keyFor()，方便对属性值的存取。有几个小地方需要注意，在使用instanceof 的时候，首先会调用对象的[Symbol.hasInstance]方法，for of 循环调用的是对象的[Symbol.iterator]方法。

### Promise
```js
async function test(){
	if (Math.random !== 0.5) {
		return 1;
	}

	var b = await new Promise((res, rej)=> {
		res(999)
	})
	return b;
}
// 我就想故意返回1，哈哈哈
```
我以为会直接返回1，而实际上返回的也是一个Promise，只不过这个Promise是已经resolve了的。

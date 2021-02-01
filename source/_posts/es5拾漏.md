---
title: es5拾漏
date: 2019-03-04 18:57:53
tags: es5
categories: js
---
# es5中被我遗忘的点
### 属性描述符

```js
// ES5中使用Object.defineProperty/defineProperties定义属性时，可以使用value/writable/configurable/enumerable或者get/set/configurable/enumerable
// 使用ES5的方式来定义属性时，默认writable/enumerable/configurable都是false，分别表明不能被等号=改写值、不能被for in枚举、不能被重新配置(配置和删除)
// ES3的字面量或者obj.property定义的所有描述符默认为true。
```


### Object.freeze方法
冻结一个对象，不能向其添加新的属性，不能修改其已有属性的值，不能删除已有的属性，不能修改已有属性的enumerable/configurable/writable属性；isFrozen返回是否是冻结对象。
### Object.seal方法
密封一个对象，不能添加新属性，已有属性不可配置，但已有属性的值可以修改。isSealed判断是否被密封。
### Object.preventExtensions
使一个对象不能再添加新的属性（仅阻止添加自身的属性。但属性仍然可以添加到对象原型）。

### 关于try/catch/finally

```js
function a(){

	try {
		return 123;
	} finally{
		console.log('finally');
	}
}
console.log(a()); // 打印什么内容？
```
首先看一下es5中对try/finally的定义：


> The production TryStatement : try Block Finally is evaluated as follows:
> 1. Let B be the result of evaluating Block.
> 2. Let F be the result of evaluating Finally.
> 3. If F.type is normal, return B.
> 4. Return F.

由上定义，可知，try和finally中的代码都会执行。只是看返回哪一个的问题了。因此，上面的会打印：finally 123.

---
title: js学习笔记
date: 2016-08-28 19:31:59
tags: 
- js
categories: ES
---
``` bash
	var scope = "global";
	function check1(){
		return function f(){
			alert(scope);
		}
	   var scope = "local";
	};
	check1()();     //输出 undefined
````
上面的代码在运行时, 全局变量scope, check1()运行时, 返回f(),f()中的scope为局部变量 (在check1中var 了 scope , 覆盖了全局变量, 虽然并未运行到赋值语句, 但js中var的变量在这一层作用域中从开始就存在, 因此alert中的scope为undefined)

<!--more-->
``` bash
	var scope = "global";
	function check2(){
	  function f(){
			alert(scope);
	  }
			var scope = "local";
			return f;
  };
  check2()();     //输出 local
```
上面的代码, f()中scope同样为局部变量, 但此时仍然为 undefined , 当运行到赋值时, 变为 local , 再将f函数返回. 当调用f()时, 能正确显示局部变量的值, local .


``` bash
var s = "test";
var S = new String("test");
s.len = 4;
alert(s.len);	//输出  undefined , 因为s.len为临时对象添加属性, 在引用完成后随即销毁. typeof s 为string
S.len = 4;
alert(S.len);	//输出4 ; typeof S 为 object
```



--js总是严格按照从左至右的顺序来计算表达式--
如: 在w = x + y * z 中 , 将首先计算字表达式 w , 然后计算x, y和z, 然后, y的值和z的值相乘, 再加上x的值, 最后将其赋值给表达式 w 所指代的变量的属性. 给表达式添加圆括号将会改变乘法/加法和赋值运算的关系, 但是从左至右的顺序是不会改变的. 
例子: date[++i] *= 2;


``` bash
var point = {
	x:2,
	y:1,
};
var point2 = {
	x:point.x,
	y:point.y + 1,
};
alert(point2.x+" "+point2.y);   // 2 2
point.x = 4;
point.y *= 2;
alert(point2.x+" "+point2.y);   // 2 2
```
每次计算对象直接量的时候, 也都会计算它的每个属性的值. 


``` bash
var point = {
	x:2,
	y:1,
};
var point2 = {
	x:point,
};
alert(point2.x.x+" "+point2.x.y);   // 2 1
point.x = 4;
point.y *= 2;
alert(point2.x.x+" "+point2.x.y);   // 4 2
```
当值为引用时, 情况不一致, 思考为什么?

__js 属性值为原始值或者对象值的区别__

javascript的数据类型可以分为两种：原始类型和引用类型。原始类型也称为基本类型或简单类型，javascript基本数据类型包括Undefined、Null、Boolean、Number和String五种，而引用类型也称为复杂类型，在Javascript中是Object。与此相对应，它们的值也分别被称为原始值和复杂值
__原始值(primitive value)__

简单的说：原始值是固定而简单的值,是存放在栈(stack)中的简单数据段,也就是说,它们的值直接存储在变量访问的位置.

　　原始值是表示Javascript中可用的数据或信息的最底层形式或最简单形式。原始类型的值被称为原始值，是因为它们是不可细化的。也就是说，数字是数字，字符是字符，布尔值则是true或false，null和undefined就是null和undefined。这些值本身很简单，不能表示由其他值组成的值.

_有哪些类型是原始类型呢?_

原始类型(primitive type)有以下五种类型:Undefined,Null,Boolean,Number,String

我们可以使用typeof来判断一个是否在某个类型的范围内.
<span style = "color:red;">typeof运算符</span>
注意:
1.返回值为字符串类型.

2.和原始类型比,还差了个null,这个比较特殊,使用typeof(null),返回的是"object",我们将null理解成是object的占位符.

__复杂值__
　复杂值可以由很多不同类型的javascript对象组成。复杂对象其在内存中的大小是未知的，因为复杂对象可以包含任何值，而不是一个特定的已知值
存储方式
栈存储
　　因为原始值占据空间固定，是简单的数据段，为了便于提升变量查询速度，将其存储在栈(stack)中
堆存储
　　由于复杂值的大小会改变，所以不能将其存放在栈中，否则会降低变量查询速度，因此其存储在堆(heap)中，存储在变量处的值是一个指针，指向存储对象的内存处

访问方式

按值访问

　　原始值是作为不可细化的值进行存储和操作的，引用它们会转移其值
``` bash	
var myString = 'foo';
var myStringCopy = myString;
var myString = null;
console.log(myString,myStringCopy);//null,'foo'
```
引用访问

　　复杂值是通过引用进行存储和操作的，而不是实际的值。创建一个包含复杂对象的变量时，其值是内存中的一个引用地址。引用一个复杂对象时，使用它的名称(即变量或对象属性)通过内存中的引用地址获取该对象值
``` bash
var myObject = {};
var copyOfMyObject = myObject;//没有复制值，而是复制了引用
myObject.foo = 'bar';//操作myObject中的值
//现在如果输出myObject和copyOfMyObject，则都会输出foo属性，因为它们引用的是同一个对象
console.log(myObject,copyOfMyObject);//Object{foo="bar"}
```


比较方式

　　原始值采用值比较，而复杂值采用引用比较。复杂值只有在引用相同的对象(即有相同的地址)时才相等。即使是包含相同对象的两个变量也彼此不相等，因为它们并不指向同一个对象
``` bash
var price1 = 10;
var price2 = 10;
var price3 = new Number('10');
var price4 = price3;
console.log(price1 == price2);//true
console.log(price1 == price3);//true
price4 = 10;
console.log(price4 == price3);//true
console.log(price4 === price3);//false 
var objectFoo = {same:'same'};
var objectBar = {same:'same'};
console.log(objectFoo == objectBar);//false
var objectA = {foo: 'bar'};
var objectB = objectA;
console.log(objectA == objectB);//true
```

动态属性

　　对于复杂值，可以为其添加属性和方法，也可以改变和删除其属性和方法；但简单值不可以添加属性和方法

　　复杂值支持动态对象属性，因为我们可以定义对象，然后创建引用，再更新对象，并且所有指向该对象的变量都会获得更新。一个新变量指向现有的复杂对象，并没有复制该对象。这就是复杂值有时被称为引用值的原因。复杂值可以根据需求有任意多个引用，即使对象改变，它们也总是指向同一个对象
``` bash
var str = 'test';
str.property = true;
console.log(str.property);//undefined　 
var objA = {property: 'value'};
var pointer1 = objA;
var pointer2 = pointer1;
objA.property = null;
console.log(objA.property,pointer1.property,pointer2.property);//null null null
```

包装类型

　　原始值被当作构造函数创建的一个对象来使用时，Javascript会将其转换成一个对象，以便可以使用对象的特性和方法，而后抛弃对象性质，并将它变回到原始值


``` bash
function constfunc(v) {
	return function () {
		return v;
	}
}

var funcs = [];
for( var i = 0 ; i　< 10 ; ++i ){
	funcs[i] = constfunc(i);
}
console.log(funcs[5]());		//输出 5

function constfuncs() {
	var funcs = [];
	for ( var i = 0; i < 10; ++ i){
		funcs[i] = function(){return i;};
	}
	return funcs;
}
var funcs = constfuncs();
console.log(funcs[3]());		// 输出10   闭包中共享变量 i ,i最后为10, 所以funcs[i]() 都为10

```

``` bash
function yi() {
	let a = 1;
	while (true){
		yield a;
		++a;
	}
}
	let f = yi();
	for(let  i = 0; i < 10; ++i)
		console.log(f.next());
	f.close();
```
对于生成器 yield 的用法, 在上面的例子中, 如果不用f = yi() 语句, 而将 console.log(f.next()) 改为 console.log(yi().next()); 的话, 不能正确调用生成器. 这是因为使用yi().next()的话,相当于每次都先调用yi(), (这时就相当于函数调用, 使局部变量全部重新初始化, 当然得不到预期的结果), 使用f = yi(); 时, 相当于得到了yi()中的生成器对象, 这时调用next()方法, 当然就是正确的了. 

**style.height**
我们都知道obj.offsetHeight与obj.style.height都可以获取obj的高度，但是在js使用中，我们通常会使用前者来获取高度，这是为什么，二者有什么样的区别呢。
1、obj.offsetHeight可以获取写在样式文件里的属性值，而obj.style.height只能获取行内属性，在表现与结构分离的今天，这显然是不合适的
2、obj.offsetHeight返回的是一个数值，而obj.style.height返回的是一个字符串，单位是“px”
3、obj.offsetHeight是只读，而obj.style.height是可读写
4、如果没有为元素设置高度，obj.offsetHeight会根据内容获取高度值，而obj.style.height会返回undefind
jQuery里我们使用\$(obj).height()来获取元素的高度，（\$(obj).css('height')返回的是一个带有单位的字符串）。
与其他三个（\$(obj).height()、\$(obj).css('height')、obj.style.height）不同的是，obj.offsetHeight的高度就是height+padding,其他是不把padding计入高度的







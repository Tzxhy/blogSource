---
title: js继承
date: 2019-03-05 10:37:42
tags:
- js
- 继承
categories: ES
---
# 关于继承
看各种资料，介绍继承，从这么几方面来说：

### 1.原型继承
```js
function Father(){
    this.property = true;
}
Father.prototype.getFatherValue = function(){
    return this.property;
}
function Son(){
    this.sonProperty = false;
}
//继承 Father
Son.prototype = new Father(); // Son.prototype被重写，
// 导致Son.prototype.constructor也一同被重写
Son.prototype.getSonVaule = function(){
    return this.sonProperty;
}
var instance = new Son();
alert(instance.getFatherValue()); // true
```
问题：当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享；并且这种继承硬编码的方式导致父类不能接收参数。


### 2.借用构造函数
```js
function Father(){
    this.colors = ["red","blue","green"];
}
function Son(name){
    Father.call(this); // 继承了Father,且能向父类型传递参数
    this.name = name;
}
var instance1 = new Son();
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"

var instance2 = new Son();
console.log(instance2.colors); // "red,blue,green" 可见引用类型值是独立的
```
解决了父类引用类型数据被共享的问题，但是没有继承父类的原型方法。



### 3.组合继承
```js
function Father(name){
    this.name = name;
    this.colors = ["red","blue","green"];
}
Father.prototype.sayName = function(){
    alert(this.name);
};
function Son(name, age){
    Father.call(this, name); // 继承实例属性，第一次调用Father()
    this.age = age;
}
Son.prototype = new Father(); // 继承父类方法,第二次调用Father()
Son.prototype.sayAge = function(){
    alert(this.age);
}
var instance1 = new Son("louis",5);
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // louis
instance1.sayAge(); // 5

var instance1 = new Son("zhai",10);
console.log(instance1.colors); // "red,blue,green"
instance1.sayName(); // zhai
instance1.sayAge(); // 10
```
解决了父类引用类型变量被共享和不能继承原型方法的问题。但是继承父类方法的时候，调用new Father()时，将Father的实例属性添加到Son的原型中，而这些属性在构造借用时已经添加到Son实例上了（相当于Son.prototype上这些Father的属性重复且无用）



### 4.寄生组合式继承
```js
function extend(subClass, superClass){
    var prototype = Object.create(superClass.prototype); // 创建对象
    prototype.constructor = subClass; // 增强对象
    subClass.prototype = prototype; // 指定对象
}

function Father(name){
    this.name = name;
    this.colors = ["red","blue","green"];
}

Father.prototype.sayName = function(){
    alert(this.name);
};
function Son(name, age){
    Father.call(this, name); // 继承实例属性，第一次调用Father()
    this.age = age;
}
extend(Son,Father); // 继承父类方法,此处并不会第二次调用Father()
Son.prototype.sayAge = function(){
    alert(this.age);
}
var instance1 = new Son("louis",5);
instance1.colors.push("black");
console.log(instance1.colors); // "red,blue,green,black"
instance1.sayName(); // louis
instance1.sayAge(); // 5

var instance1 = new Son("zhai", 10);
console.log(instance1.colors); // "red,blue,green"
instance1.sayName(); // zhai
instance1.sayAge(); // 10
```
这样是最优解。

### 疑问
- 为什么原型继承那里不用subClass.prototype = superClass.prototype?
其实因为如果这样做的话，对对象进行instanceOf的时候就会出问题。比如我new了一个superClass对象super1，但中间执行过extend(subClass, superClass)这个方法，那么子类的proto就指向了super的proto。造成的结果是super1 instanceOf superClass === true（没毛病）,super1 instanceOf subClass === true （瓦特？）。所以中间用一个过渡的对象，防止这种情况的发生。

---
title: js 设计模式简介
date: 2019-03-29 21:57:41
tags:
- 设计模式
categories: 设计模式
---
最近在做需求的时候，发现逻辑结构比较乱，整体思路不够清晰。于是便想用一些设计模式来抽象自己的逻辑，美化代码结构。
<!-- more -->

## 创建性设计模式
主要是处理创建对象的设计模式。通过控制对象的创建来避免手动创建对象可能导致的问题及复杂度。

### 简单工厂
场景：组件类太多，记不住名字。可以对外提供一个创建组件类的工厂方法，如：
```js
const componentsMap = {
    alert: Alert,
    prompt: Prompt,
    // ...
};
function createComponent(name, props) {
    return new componentsMap[name](props);
}
```

如果许多类的相似处很多，可以把相似的放入工厂中，同时不同的也在工厂中处理：
```ts
function createBall(name: string, props: object) {
    this.ball = new Ball();
    this.type = name;
    this.show = function() {};
    if (name === 'basketball') {
        // some difference
    } else if (name === 'other') {
        // some difference
    }
    // ...
}
```

### 安全工厂方法模式
上面的代码中可以发现，当有新增的类时，需要修改componentsMap映射关系或者createBall里面的逻辑。有一个更好的模式：
```ts
function ComponentFactory(type, props) {
    if (this instanceof ComponentFactory) {
        return new this[type](props);
    } else {
        return new ComponentFactory(type, props);
    }
}
ComponentFactory.prototype.BasketBall = function(props) {};
ComponentFactory.prototype.FootBall = function(props) {};
```
当有新的构造方式时，直接利用原型链即可。

### 抽象工厂模式
js 是种没有抽象类的，但可以用原型链来模拟实现。比如：
```ts
function Car() {}
Car.prototype.run = function() {
    throw new Error('抽象方法！');
}
const BMW = new Car();
BMW.run(); // throw new Error
```
需要手动实现 run 方法。

### 建造者模式
建造者模式就是将复杂的构建过程分离成多个单独的步骤，如：
```ts
const Human = function(info) {

}
const Name = function(name) {
    this.name = name;
    this.lastName = 'l';
    this.firstName = 'f';
}

const Family = function() {
    // ...
}

const Person = function(name, family) {
    const _person = new Human();
    _person.name = new Name(name);
    _person.family = new Family();
    return _person;
}
```
### 单例模式
可以实现命名空间，可以实现惰性单例。（略）

___
___


## 结构性设计模式
关注如何将对象、类组合成更大、更复杂的结构，以简化设计。
### 外观模式
为复杂的子系统接口提供更高级的统一接口。js 中经常对底层 API 进行封装，以兼容多个浏览器。（略）
### 适配器模式
将一个类的接口（方法或者属性）转化成另一个接口可以使用的方式。（略）
### 装饰者模式
在不改变原对象的基础上，通过对其进行包装拓展（添加属性或方法）使原有对象可以满足用户的更复杂的需求。可以想像@override 这样的 js 修饰器，它的原理就是就是检查原型链上是否有同名的函数，如果没有，就报错，有的话，就执行定义的函数。

### 组合模式
一个数据结构对外提供统一结构，有不同的实现类。这些不同的实现类都能添加到一个池子里处理，因为它们的接口是一致的。（略）

### 享元模式
共享源数据的模式，避免创造大量相同的对象（包括 js 对象和函数等），占用内存。（略）


___
___


## 设计型设计模式

### 模板方法模式
将基础的方法作为扩展方法的原型对象即可。（略）

### 观察者模式
又称为发布-订阅者模式或者消息机制，定义了一种依赖关系，解决了主题对象与观察者之间 **功能** 的解耦。(略)

### 状态模式
当一个对象的内部状态发生改变时，会导致其行为的改变。

举例：超级玛丽，可以跳跃，开枪，蹲下，奔跑，这些都是一个一个状态，这些状态都是可以组合的，因此不能单单使用 if 来判断（组合的情况非常多）。可以将一个时间点的状态都存入一个数组，然后执行对应状态的方法即可。

### 策略模式
预先定义好针对某一执行流程的逻辑，在调用时指定对应的策略名即可。

### 职责链模式
将一个复杂的执行过程分解成许多细小的模块，每个模块完成独立、细小的功能， **这也是代码编写时要极力遵循的** ，也方便单元测试。

### 访问者模式
针对于对象结构中的元素，定义在不改变该对象的前提下访问结构中元素的新方法。和外观模式有很相似处，不同之处是要考虑 this 的指向问题，因此通常要使用 call 和 apply 来更改函数的执行作用域。

### 中介者模式
通过中介者对象封装一系列对象之间的交互，使对象之间不再相互引用，降低耦合。

### 备忘录模式
保存对象的多个状态，可用于恢复对象某一时刻的状态。比如 redux 的 action。

### 迭代器模式
顺序地访问聚合对象的内部元素。

### 解释器模式
对于一种语言，给出其文法表示形式，并定义一种解释器，通过这种介绍起来解释语言中定义的句子。

___
___
## 技巧型设计模式
### 链模式（略）
### 委托模式
比如依靠事件冒泡，把事件绑定在父元素上。
### 节流模式 -- 区别防抖
节流是时间间隔 t 内只以参数 x1 运行 f(x) 1次；防抖是时间间隔 t 内，如果 f(x)没有再次调用，就以 x1 参数执行一次，否则，将参数换为 x2，时间间隔 t 内没有 f(x) 再次调用的话，就以 x2 参数执行一次。（具体场景，具体修改）
### 简单模板模式
在频繁创建 DOM 节点并操作时，可以考虑将 HTML 直接赋予某个元素.innerHTML

### 惰性模式
减少每次代码执行时的重复性分支判断。一般是判断后直接修改原函数即可。

### 等待者模式
通过对多个异步进程监听，来触发未来发生的动作。类似 Promise。

___
___

## 架构型设计模式
### 同步模块模式
模块化：将复杂的系统分解成高内聚、低耦合的模块，使系统开发变得可控、可维护、可拓展，提高模块的复用率。
同步模块模式：当指定了依赖后，直接调用逻辑函数，不等待对应的依赖模块是否获取到。

### 异步模块模式
在同步的基础上，等待所有依赖都可访问时，再执行逻辑。

### Widget 模式
Widget: (Web Widget 指的是一块可以在任意页面中执行的代码块)借用 Web Widget 思想，将页面分解成部件，针对部件开发，最终完成完整页面。也是现在的 Web 组件所提倡的组件化设计（React、Vue 等都是组件化开发）。

### MVC
model-view-controller。
model 提供数据相关接口；view 提供视图相关，比如创建视图；controller 提供逻辑相关。视图层和数据层耦合在一起。
### MVP
model-view-presenter。
model 跟 MVC 中的 model 差不多；view 变化较大：view 中不再直接引用 model 来绘制页面，而是提供一系列方法；presenter 引用 model 和 view 来控制展现和逻辑。

### MVVM
model-view-ViewModel。
ViewModel 和 view 之间实现了数据双向绑定，model 和 ViewModel 之间实现了更新、推送的机制（即数据主动更新后，向VM推送消息；视图改变，引起 VM 更新 model）。



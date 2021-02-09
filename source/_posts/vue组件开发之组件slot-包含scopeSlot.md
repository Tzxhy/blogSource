---
title: vue组件开发之组件slot(包含scopeSlot)
date: 2017-08-24 18:44:01
tags:
- slot
categories: Vue
---


最近使用这个slot, scopeSlot真的是头大, 因为官网本来介绍就少, 只能用到哪不会, 再查, 最后东拼西凑, 好像明白了什么...厉害了, 我是你的哥. 
<!-- more -->
# 介绍
还是先简单说说slot和scopeSlot这两个东西, 理解清楚了好理解后面的东西. 

## slot
slot就是Vue用来分发内容的标签, 可以具名, 也可以匿名. 匿名的slot只能存在一个, 同时也是默认的slot, 如果子组件__没有__定义具名slot, 如  
```javascript
<div slot="name">....</div>
```
这样的, 那么这就是匿名的. 如果一个组件连一个匿名的slot都没有, 那么所有父组件赋予的内容都将丢失.
```javascript
render(r){
	return r('div',[this.$slots.default, this.$slots.f])    
}
//此渲染函数将匿名slot和name="f"的slot的内容添加到div元素中. 
```
```javascript
render(r){
	return r('div',[this.$slots.default, this.$slots.f, this.$scopedSlots.fff(this.info)])
}
//此渲染函数将匿名slot和name="f"的slot的内容添加到div元素中. 并且将<template slot="fff">...</template>元素放入div中
```

## scopedSlots
是Vue2.1.0中新增的, 意为作用域插槽. 
```javascript
<t-t2>
  <p>fesfsfesafesafeasfase</p>
  <p slot="f">ffffffff</p>
  <template scope="prop" slot="fff">{{prop.name}},{{prop.age}}</template>
</t-t2>
```
如在上面的代码中, 带有特殊属性scope的template元素能访问prop(在渲染时传入的值), 在写render函数时, 访问scopedSlots十分方便.

## 本实例中运用方式
本实例中在UlTest中的t-table-item中传入template元素, 里面有个删除按钮, 删除按钮绑定了当前行的所有数据, 这就是通过scopedSlots实现的. 如果不需要绑定数据, 则直接slot就可以实现. 
<br>
本例中实现方式: 在t-table-item中传入template元素, 然后t-table-item元素将scopedSlot.default传到父组件, 父组件再将scopedSlot.default传到t-tbody(原理上t-table-item可以直接传到t-tbody, 即上节说的非父子通信), 应用时传入每行的数据源即可.(所有代码均可在github仓库找到)
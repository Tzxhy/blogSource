---
title: react相关
date: 2019-03-07 14:21:19
tags:
categories:
- react
---

# react相关
1. 使用jsx时，对使用了{}并且返回字符串的值，会被转义一次。
```javascript
<Icon
	iconCode = {item.iconFont} // 这里的iconCode在放入html元素之前会被转义
/>

<Icon
	iconCode = '&#xe42e;' // 这个不会被转义，因为没有使用jsx的模板-- {}
/>
```

2. 在jsx中不要乱用 {} 这个，这个是让react对其内的东西求值，而有些情况下，比如想直接渲染，{_content}，这个_content已经在return之前就求过值了，比如是一个jsx语法的DOM节点（其实在return之前，jsx语法的节点已经被转换为React.createElement了），将求过值的东西再放入{}中就会得到错误：Object 不能被当做子元素来渲染。在对组件传递属性的时候，除了字符串值，其余都需要加{}

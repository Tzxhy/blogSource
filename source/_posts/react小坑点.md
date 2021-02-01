---
title: react小坑点
date: 2018-05-28 12:51:00
tags: react
---

# 说点什么
最近跟着张代应老师完善hiproxy项目。其中遇到一些问题。
主要是关于react的。

## 对表单的受控组件
很多时候会用到checkbox这样的受控组件，一般设置value和onClick这样的属性。其表相看着是checkbox受到我的控制，如果我在代码中不改变其checked属性，其是不会被勾选上的。这里是一个误区。在点击checkbox时，其实它是先快速地被勾选上，然后根据逻辑判断，是否需要勾选上。其原理类似于先经过浏览器的事件处理（非JS层面的，想象一下，一个checkbox在不设置任何事件处理的时候，是不是点击了就切换勾选状态？），再经过react的判断。因此不能在react的逻辑中判断是否存在DOM结构的勾选状态。这也符合react的思想：避免操作DOM。

## 不同平台的换行符
```bash
在windows下换行符是 \r\n
linux和mac是\n
(老的macOs上是\r)
```
当然，为了程序的平台无关性，选择合适的编码是重要的，否则会遇到windows上可以执行，mac上提示你
```bash
env: node\r: No such file or directory
```
为了通用性，选择 unix的换行编码  \n  作为换行符。其优点：
1. 平台无关性。一次代码，多个平台使用，无需使用dos2unix, unix2dos这类工具进行转码；
2. 编辑器可见。虽然 \n 的换行，在windows上使用记事本打开是一行，但目前主流代码编辑器都能认识 \n 为换行符。

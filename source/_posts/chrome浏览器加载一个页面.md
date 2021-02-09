---
title: chrome浏览器加载一个页面
date: 2019-03-07 14:33:23
tags:
- chrome
categories: 浏览器
---

# 从输入一个地址开始说起
此处省略浏览器发起DNS解析请求、发送http请求等（后面可能会补充）。就说开始接收数据后浏览器做了啥。

## 获取到一个html文件
完成Finish Loading（html文件）后，开始进入Parse阶段。在此阶段，会从上到下依次解析，但是，会对html中指定的资源提前发起请求（就是说还没解析到这，但为了网络性能的提升，提前利用某种方式找到需要的资源文件，比如link中的css、script中的js、以及img等等。）。证据如下：
<!-- more -->
这是流程图：

![chrome](/images/chrome-1.png)

这是parse首页html的，表示在解析0-22行（不包含22行）。

![chrome](/images/chrome-2.png)

来看看内容是什么：

![chrome](/images/chrome-3.png)

表示还没执行到下面的script src标签时，就对4d77的js文件发起了请求。

在htm解析阶段的请求收到响应
![chrome](/images/chrome-4.png)

这个就是刚刚说的那个提前加载的js文件。可以看到，这里仅仅是接收完数据，并没有evaluate（执行），因为html解析并没有解析到该script的行数。对吧？没毛病。

## 搞点小破坏
为了一探究竟webkit（或者应该说chrome，可能加载方式是各个浏览器的不同移植的不同实现，也可能加载方式是存在于webkit内核中）的加载顺序，我把0-22行中有一个css文件给pending住了。为什么要这么做？今天涛哥给我一个思考题，如果一个css资源（或者不是css资源，任意资源）被pending住了（不是挂掉了），浏览器会如何加载？会影响哪些？  我知道的是挂掉的情况。一个链接挂掉了，浏览器会继续往后解析。但一个链接pending住了，会怎样？我原以为浏览器会继续解析，仿佛好像可以这样：我继续解析我的DOM，等你css资源回来了，你叫我，我把控制权给你。虽然这样可能会产生这样的情况：页面我全都已经Layout → render了，但你还没回来；等你回来了，构建样式树，然后再来Layout → render一遍。不过 **可能会有性能问题**。

事实确实是这样的：当有css资源pending住了，浏览器停止解析DOM。如下图：

![chrome](/images/chrome-5.png)



在finish loading css文件后，浏览器才继续parse剩下的DOM。什么意思呢？如果head头部中某个css文件被pending住了，那么页面就是白屏！！因为浏览器就要等待css回来了才继续解析。同时在第二个红框下面，也看到了对js文件的执行（也验证了前面说的，对脚本的执行是在解析到这一行时才执行，而资源的加载是parse html一开始的时候就进行的）

如果是其他资源（比如一个图片）pending了呢？
这个还好，不会阻塞DOM的解析，只会导致window.onload延迟触发。

![chrome](/images/chrome-6.png)



## 后话 ---- 异步加载时pending一个css来试试。。。
后面异步加载的资源都属于并行加载了。互不影响。

![chrome](/images/chrome-7.png)

![chrome](/images/chrome-8.png)

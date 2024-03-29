---
title: flutter 介绍
date: 2019-12-11 22:25:48
tags:
- flutter
categories: flutter
---

## 团队介绍
大家好，我们是来自字节跳动的前端工程师。业务线近期引入了 flutter 作为新的探索方向，同事们构思着把开发中遇到的问题、解决方法，以及对技术的思考，整理成文档，输出给大家参考。我们都是前端工程师（web 方向），所以我们的文章都会偏向于从前端工程师角度来思考、解决问题，当然也会有一部分 native 相关的，比如以 module 形式嵌入到已有 app、编写双端 native 插件等。欢迎大家订阅。下面开始文章主体。

<!-- more -->

## flutter简介
flutter 是由 Google 推出并开源的跨端应用开发框架，最早于2018年2月发布了第一个可用的 Beta 版。因为其跨平台、高保真、高性能的特点，一发布后便备受瞩目。要求开发者通过Dart语言开发 app，一套代码能同时运行在移动平台（iOS和Android）、web 浏览器（即将到来）及桌面应用（即将到来）。同时 flutter 提供了丰富的组件、接口，易于开发者迅速上手。下面简介 flutter 的几个特点：

### 跨平台
与常规的移动应用程序不同，flutter 不使用传统的 webview 容器，也不使用操作系统相关的原生控件；相反，flutter 自身实现了一套高性能渲染引擎。这样不仅能保证跨端应用在 UI 上的一致性，还能减少频繁与原生控件交互带来的性能损耗（相对于 React Native 实现方式来说）。
flutter 使用 Skia 作为其渲染引擎。Skia最早由 Skia 公司开发，被 Google 收购后开源，是一个2D图形处理函数库，能在低端设备如手机上呈现高质量的2D图形，同时Skia是跨平台的，并提供了非常友好的API。目前Google Chrome浏览器和 Android 等均采用Skia作为其绘图引擎。
笔者编写本文时，flutter 已支持 iOS、Android，for web 和 for pc 正在筹划中。

### 高性能
flutter 拥有高性能，主要因为两点：
1. flutter 采用 Dart 语言开发。Dart 是同时支持JIT 和 AOT 为数不多的语言之一。由于其良好的内存分配机制、垃圾回收机制、编译优化等设计，使其对 flutter 提供了高性能支持。在频繁计算的场景下，高性能的语言非常重要。
2. 使用自己的渲染引擎来绘制 UI。布局信息通过 Dart 语言直接计算，不需要像 React Native 那样在 JavaScript 和 Native 之间不断通信。

### 使用Dart语言开发
flutter使用 dart 语言进行开发。那么前端的同学可能会疑问：为什么不用 JS 进行开发呢？这是一个有意思的问题。感兴趣的同学可参考：[为什么 flutter 选择了 dart](https://www.infoq.cn/article/why-flutter-uses-dart)。这里引用该文章中的内容：
- Dart 是 AOT（Ahead Of Time）编译的，编译成快速、可预测的本地代码，使 Flutter 几乎都可以使用 Dart 编写。这不仅使 Flutter 变得更快，而且几乎所有的东西（包括所有的小部件）都可以定制。
- Dart 也可以 JIT（Just In Time）编译，开发周期异常快，工作流颠覆常规（包括 Flutter 流行的亚秒级有状态热重载）。
- Dart 可以更轻松地创建以 60fps 运行的流畅动画和转场。Dart 可以在没有锁的情况下进行对象分配和垃圾回收。就像 JavaScript 一样，Dart 避免了抢占式调度和共享内存（因而也不需要锁）。由于 Flutter 应用程序被编译为本地代码，因此它们不需要在领域之间建立缓慢的桥梁（例如，JavaScript 到本地代码）。它的启动速度也快得多。
- Dart 使 Flutter 不需要单独的声明式布局语言，如 JSX 或 XML，或单独的可视化界面构建器，因为 Dart 的声明式编程布局易于阅读和可视化。所有的布局使用一种语言，聚集在一处，Flutter 很容易提供高级工具，使布局更简单。
- 开发人员发现 Dart 特别容易学习，因为它具有静态和动态语言用户都熟悉的特性。
    
### 小结
本节简介了 flutter 的相关特点。下面将对 flutter 的框架结构做简单的了解。


## Flutter框架结构
![image.png](http://sf1-vcloudcdn.pstatp.com/img/tos-cn-i-0000/2b151bfd33214b229e494f7125264713~tplv-noop.image?width=744&height=390)

### Flutter Framework
这一层是纯 Dart 代码实现的 SDK，它实现了一套渲染机制。
- 底下两层：对应于 flutter 中的 `dart:ui`，提供了绘图、手势、动画、服务等基础能力。
- Rendering 层：渲染层。维护了一颗自顶向下的渲染树。当有节点变脏时，计算出需要更新的部分，然后开始新的一轮渲染，最终将 UI 绘制到屏幕上。渲染层可以说是 flutter 框架中 UI 层最核心的部分，每一个组件的位置、大小等都需在渲染层有对应的节点表示。
- Widgets层：这一层是离开发者最近的一层。在此基础之上，flutter还提供了 Material 和 Cupertino 两种视觉风格的组件库。绝大时间我们都是都在与该层打交道。

虽然作为底层框架，新手入门时可能并不会了解到这个深度。但随着业务开发的深入、对 flutter 探索的不断加深，终究会了解到 flutter 的底层框架设计及思想。

### Flutter Engine
这是一个纯 C++ 实现的 SDK，其中包括了 Skia 引擎、Dart运行时、文字排版引擎等。在代码调用`dart:ui`库时，调用最终会走到 Engine 层，实现真正的绘制逻辑。

### 小结
flutter 框架本身有着良好的分层设计，在平常开发中，会经常关注到 Widget 与 Rendering 层；在深入学习时，可针对学习方向选择学习底层引擎或者 Dart 层框架设计（本系列文章主讲 Dart 层）。

## 笔者经验
虽然是本系列第一篇 flutter 文章，但就『学技术不是说技术』的原则，这里基于笔者使用 flutter 开发数月的经验，来说说我关于 flutter 的思考。

### 为什么要用 flutter
首先要问自己，为什么要使用 flutter？是因为它火吗？是因为它高性能吗？还是别的原因？要回答这个问题，可以简单地从这么几个方面来说：
- 公司整体技术氛围。如果你身处一家技术公司，那么你自然会发现，周围的同事、项目组，以及公司的基础技术建设等，都是紧跟时代潮流的。2019年，是flutter大放异彩的一年，它迅速成为炙手可热的焦点话题，同时成为前端界进军 native 的新宠，关注度不断上升。作为紧跟技术潮流的开发者，自然而然要去学习 flutter、使用 flutter。
- 高体验探索。众所周知，单比较性能的话，native 优于 webview；但传统的 native 开发，却以其开发周期长、需要编写双端代码、发版流程周期长等原因，经常让前端开发异常难受。但 flutter 的出现，打破了只能存在 native 或者 webview 二选一的困局：既能获得高性能，又能一套代码跑两端，加上热发布的功能，发版速度堪比 web 项目！
- 公司基础建设推进。我们公司的基础建设部门与 google 建立有良好的沟通机制。在 flutter 上的讨论能够更加及时、响应迅速，为及时解决开发中的问题提供了良好的技术支持。

基于上面几点，我们项目组尝试使用 flutter 进行一些页面的重构，预期增强用户体验，同时定期验证该 flutter 版本的页面是否收益正向。

### 使用flutter需要考虑的
学习新的技术固然是好事，但不能为了学而学，我们要衡量这件事的 ROI（return of input）：如果 ROI 低，那么学习的意义可能不大。首先我们要明白使用 flutter 的场景。
我们更倾向与使用 flutter 的前提是：当前 web 项目的体验稳定，希望在一定程度提升用户体验，预期对指标有正向作用。试问，如果在当前 web 项目还没稳定，就急于尝试 flutter，那么怎么衡量两者的差异，怎么衡量 flutter 带来的是收益还是负向作用？当然，如果是新项目，那就是另一回事了。
同时，使用 flutter 意味着要学习 Dart 语言，虽然 Dart 语言比较易学，但仍然存在学习成本。在遇到一些Dart引擎层的细节问题时，可能还需要再深入研究相关机制，比如异步的实现，跟 JS 有什么差异等。这都是需要考虑的。
下面我以近段时间开发中遇到的问题，做一个简单介绍：
1. 官方 sdk 问题（及时反馈）。在升级到官方191版本后，打 release 包出现异常，但 debug 包正常。
2. 设计方式不一样（必然的）。比如没有 web 中的固定定位，原生不支持瀑布流布局（非要自己实现的话，需要了解相当底层的绘制层代码，并且需要编写的代码量也不小）。
3. 涉及 native 侧问题（前端同学比较关心）。我也是前端工程师，对 native 不熟悉。但一些插件的开发，需要了解 iOS、Android 的基本知识，需要使用 Java（Kotlin），Object-C（Swift）编写基本的双端代码。这也有一定学习成本。

任何技术的发展不可能一帆风顺，这对前端来说更是一个巨大的挑战：前端技术圈日新月异，符合开发者口味的技术、能不断提升用户体验的技术才能越走越远。在不断学习技术的同时，技术本身也会不断改进。摆正心态，拥抱学习。

### flutter 的发展形势
从flutter 发布第一版正式版到现在，快一年的时间了。虽然官方仓库还积压着超过5k 的 issue，但丝毫不影响全球开发者对其的关注。flutter 在各个论坛、社区上被激烈地讨论着，分享着（这不，本篇同样在分享）。作为近几年前端跨端方式中的新星，它一开始便以其高性能、跨端的能力突破重围，到达广大开发者的眼前。这是技术的热度。
flutter 的出现从历史的角度来说是必然的。当然，这里不是特指『flutter』，而是由 flutter 代表的跨端高性能解决方案。从最初的Android、iOS、WinPhone、Web 四分天下的『原始开发』，到掀起h5与系统底层交互的青铜时代（比如PhoneGap，Cordova等），再到高级语言开发、原生绘制的黄金时代（比如 React Native，Weex等），最终到现在一套代码，高性能运行于多端的 flutter 时代！它的出现，是技术不断进步的表现。这是新技术出现的必然性。
对比于高级语言开发原生绘制的方式，flutter 选择的是截然不同的方式：从根本解决了性能低下的问题。自建了一套渲染机制。正是这套渲染机制，把 flutter 与其他方案划分的一清二楚。在 web 中，存在 canvas 的接口；在 native、PC 中，同样存在底层的 canvas 接口，其提供了基础了绘制能力。而 flutter 自身基于 canvas，做了一层绘制引擎，通过 Dart 虚拟机与底层进行交互。正是因为缺少了类似 RN 中桥的损失，让 flutter 得到了高性能。这是 flutter 成功的部分原因。
新技术的兴起，无非是：性能更高，体验更好，跨端能力，良好的生态支持。我相信 flutter 在未来的发展是不错的。它的设计之初，就是为了解决这些硬伤，而它刚好解决了。虽然现在还面临许多困难，比如仓库 issue 还很多，比如对各端开发人员体验不一致（有安卓开发者报告 flutter 中的主题定义与原生的定义不一），在国内的推广度还不高，生态还不完善等问题，但我相信，flutter 在近几年都会是通用的解决方案。即使哪一天出现了其他超越 flutter 的产物，那也是符合时代规律的。趁着 flutter 还年轻，趁早上车，感受它带来的开发快感。


### 小结
本节基于笔者的经验之谈，谈了谈对 flutter 的认识，希望对大家了解 flutter，思考 flutter 有帮助。

## 其他
这里提供一些笔者收藏的站点，用于平时学习 flutter、紧跟flutter发展。
### 资源/方法
- **官网** ：任何技术都离不开[官方站点](https://flutter.dev/)。这是学习 flutter 首要需要学习的东西。
- **源码、注释** ：源码注释应作为学习 flutter 的第一文档，flutter SDK 的源码是开源的，并且注释非常详细，也有很多示例。
- **Github** ：如果遇到的问题在StackOverflow上也没有找到答案，可以去Github flutter 项目下issue 里找找有没有类似的问题，或者[提issue](https://github.com/flutter/flutter)。
- **Gallery源码** ：Gallery是 flutter 官方示例APP，里面有丰富的示例。
- **Medium 社区**：[medium 社区](https://medium.com/flutter-community) 是一个学习 flutter 很好的地方，每天都有各种类别的 flutter 文章产生。
- **关注本专题**：本专题会定期发布新的文章，适合刚入门、想要深入学习研究的各位同学学习交流。

### 小结

有了资料和社区后，对于我们学习者自身来说，最重要的还是要多动手、多实践。后面的文章将由浅入深，帮助大家快速成为 flutter 开发大军中的主力！

## 参考
[flutter](https://flutter.dev/)
[为什么 flutter 选择了 dart](https://www.infoq.cn/article/why-flutter-uses-dart)
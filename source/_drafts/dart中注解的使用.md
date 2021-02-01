---
title: dart中注解的使用
date: 2019-08-23 11:02:07
tags:
categories:
- dart
---

## 注解是什么？
如果进行过java开发，应该对 metadata 中 annotation 的概念比较熟悉：可以增强原本的功能、起到开发时提示的作用等（本人非java开发）。dart 中也提供了 metadata 的 anotation [使用](https://dart.dev/guides/language/language-tour#metadata)，但官文比较粗糙，需要自己多方学习。在 dart 中经常使用到的注解就几个：@deprecated, @required, @override 等。
官文中提到，如果需要自定一个注解，可以实现一个 const 类，比如：
```dart
library todo;

class Todo {
  final String who;
  final String what;

  const Todo(this.who, this.what);
}
const todo = const Todo('tzx', 'fix');
```
在使用的地方：
```dart
import 'todo.dart';

@Todo('seth', 'make this do something')
void doSomething() {
  print('do something');
}

@todo
void feat1() {
  print('do something');
}
```
看着很简单，但除了加了一行所谓的注解，还有什么用？（为啥我不直接写个TODO的「注释」呢？）这样的入门文档确实很迷，需要深入学习。
<!-- more -->
## 稍微深入？
官文最后一句比较有意思：You can retrieve metadata at runtime using reflection. 你可以在运行时通过反射来获取元数据。意思是可以通过 dart 中提供的反射来搞？但一看 dart:mirrors library，标记为 unstable。那么应该是不能用 reflection 的方式了？找一下 dart 官方文档，其他地方都没提这个 metadata， 只在 dart specification 中发现了 metadata 的有用信息：
```
Metadata is associated with the abstract syntax tree of the program construct p that immediately follows the metadata, and which is not itself metadata
or a comment. Metadata can be retrieved at run time via a reflective call, provided the annotated program construct p is accessible via reflection.
Obviously, metadata can also be retrieved statically by parsing the program and
evaluating the constants via a suitable interpreter. In fact, many if not most uses
of metadata are entirely static.
```
简单说，metadata 是附属于它下面抽象语法树的代码结构的，自身并没有什么特殊。metadata 它可以在运行时通过反射调用来获取。同时，很明显的，代码都是文本，可以静态地解析程序，通过合适的解释器来翻译这些 metadata。事实上，大多数 metadata 的使用都是完全静态的。

所以，我们可以静态的使用 metadata。所以我们要自己实现解析器吗？No~
## required怎么实现的？
在开始下面的「长篇大论」之前，谈一个话题：required 这个annotation怎么实现的？我怎么实现类似的静态检查？如果是因为这点而学习 annotation，可以不用往后面看了。这些是dart语言层的工具实现，不属于这里提到的静态文档解析（虽然大致原理一致，但编码在不同层面。本文的是在应用层面，dart提供的required等在语言层面），至少现在不能实现。下面要继续说的是，如何用 annotation 来实现自动生成代码。
## 介绍几个有用的东西？
### source_gen
https://pub.dev/packages/source_gen
dart 团队出品，用于生成代码。
### build_runner
https://pub.dev/packages/build_runner
## 怎么编写自定义注解？
### 添加依赖
在pubspec中添加：
```dart
dependencies:
  source_gen:
```
source_gen 可以放在 dep ，也可以放在 dev 中，看是否有需求发布。
### 定义基础信息类
### 定义Generator
### 定义Builder
### 定义build.yaml
### 生成代码

## 注意？TODO # 占坑

## 完整例子

## 参考
https://juejin.im/post/5d1ac884f265da1bad571f3a
https://pub.dev/packages/source_gen
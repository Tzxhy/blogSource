---
title: eletron 入坑
date: 2019-04-26 12:54:02
tags:
- electron
categories: 桌面端
---
[官网](https://electronjs.org/docs/tutorial/about)

## 关于
Electron通过将Chromium和Node.js合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的。

## 辅助功能
```
npm install --save-dev devtron

require('devtron').install();
```
## Electron 应用结构
### 主进程和渲染器进程
Electron 运行 package.json 的 main 脚本的进程被称为主进程。 在主进程中运行的脚本通过创建web页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

由于 Electron 使用了 Chromium 来展示 web 页面，所以 Chromium 的多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中。
在普通的浏览器中，web页面通常在一个沙盒环境中运行，不被允许去接触原生的资源。 然而 Electron 的用户在 Node.js 的 API 支持下可以在页面中和操作系统进行一些底层交互。
<!-- more -->
### 主进程和渲染进程之间的区别
主进程使用 BrowserWindow 实例创建页面。 每个 BrowserWindow 实例都在自己的渲染进程里运行页面。 当一个 BrowserWindow 实例被销毁后，相应的渲染进程也会被终止。

主进程管理所有的web页面和它们对应的渲染进程。 每个渲染进程都是独立的，它只关心它所运行的 web 页面。

在页面中调用与 GUI 相关的原生 API 是不被允许的，因为在 web 页面里操作原生的 GUI 资源是非常危险的，而且容易造成资源泄露。 如果你想在 web 页面里使用 GUI 操作，其对应的渲染进程必须与主进程进行通讯，请求主进程进行相关的 GUI 操作。

Electron为主进程（ main process）和渲染器进程（renderer processes）通信提供了多种实现方式，如可以使用ipcRenderer 和 ipcMain模块发送消息，使用 remote模块进行RPC方式通信。 这里也有一个常见问题解答：[web页面间如何共享数据](https://electronjs.org/docs/faq#how-to-share-data-between-web-pages)

## 申明外部依赖
这个不是说应用的内部依赖包，比如 npm 包，而是外部像 python 等运行环境。
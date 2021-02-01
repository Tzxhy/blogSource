---
title: flutter源码学习(2)
date: 2020-01-28 19:24:31
tags:
categories:
- flutter
- services
---

本篇深入 lib/services。

## 库定义
暴露给 flutter 程序的平台相关服务。仅依赖核心的 dart 库和 lib/foundation。

## 主
### asset_bundle.dart
native 程序可以携带一些静态资源，比如图片、字体等文件。这需要提前定义。在 flutter 中即是在 pubspec.yaml 中定义。对外暴露一个 `rootBundle`，但最好是通过 `DefaultAssetBundle.of` 获取 bundle。

### binary_messenger.dart
定义了一个flutter 内部使用的消息通道。暴露了一个 `defaultBinaryMessenger` 常量。

### binding.dart
定义了 `ServicesBinding` 。监听平台事件（onPlatformMessage）。主要做了添加凭证（license）的工作。
<!-- more -->
### clipboard.dart
定义了剪切板功能。剪切板只能获取字符型数据。

### font_loader.dart
定义了一个可以在运行时加载字体的类。

### haptic_feedback.dart
触觉反馈模块。根据 iOS、Andr 做了不同适配。

### keyboard_key.dart
定义了两个类。`LogicalKeyboardKey`/ `PhysicalKeyboardKey`，逻辑按键和物理按键。逻辑按键帮助区分了标志符、模式等，而物理按键跟键盘布局有关。

### keyboard_maps.dart
按键 maps

### message_codec.dart message_codecs.dart
定义了 flutter 程序间、plugins 之间通信时的编码、解码。

### platform_messages.dart platform_channel.dart
定义了 flutter plugins 通信的channel。

### platform_views.dart
跟 iOS、Andr 原生View 相关。不太清楚作用。TODO

### raw_keyboard.dart  raw_keyboard_*.dart
按键相关。

### system_channels.dart
定义了 flutter 程序的系统级平台 channel。包括：
1. navigation
2. platform
3. textInput
4. keyEvent
5. lifecycle
6. system
7. accessibility
8. platform_views
9. skia

### system_chrome.dart
定义了 `SystemChrome` 用于控制操作系统图形界面的特定方面以及它与应用程序的交互方式，比如设置屏幕方向、应用程序切换描述、设置可见的系统覆盖层（顶部状态栏、安卓底部导航栏）。

### system_navigator.dart
定义了一个 `SystemNavigator` 类，用于退出当前activity。iOS 上无效（程序不应该自己退出）。`SystemNavigator.pop`方法比`dart:io`'s [exit] 好，因为后者表达了一个异常退出的意图。

### system_sound.dart
定义了 `SystemSound` 类，用于调起声音播放，具体应用场景不清楚。TODO

### text_formatter.dart text_input.dart text_editing.dart
定义了文本的输入。








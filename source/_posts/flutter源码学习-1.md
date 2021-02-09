---
title: flutter源码学习(1)
date: 2020-01-27 19:24:31
tags:
- flutter
- foundation
categories: flutter
---

本篇深入 lib/foundation。后面的文章都基于191版本。

## 库定义
作为 flutter 底层框架原语，提供一些基础实用工具方法、类。

## 前记
暂不关注非以"_"开头的文件。

## 主
### annotations.dart
包含3个注解工具类。暂不清楚有啥用。
<!-- more -->
### assertions.dart
包含用于调试时相关类及方法。主要：
1. debugPrintStack 打印调用栈
2. FlutterError、DiagnosticsStackTrace、ErrorHint 等基础类。

### basic_types.dart
定义了一些函数签名。如：
1. ValueChanged 定义
2. AsyncCallback 定义
3. Factory 类

### binding.dart
定义了`BindingBase`抽象类。该类用于混合单例服务。怎么理解呢？一个 flutter 程序本身依赖的很多其他的『服务』，这里我把『服务』两个字突出了一下。哪些是服务？绘制页面，手势系统，与原生通信等都属于服务。该抽象类定义了如下方法：
```dart
abstract class BindingBase {
  BindingBase() {
    developer.Timeline.startSync('Framework initialization');
    initInstances();
    initServiceExtensions();
    developer.postEvent('Flutter.FrameworkInitialization', <String, String>{});
    developer.Timeline.finishSync();
  }

  static bool _debugInitialized = false;
  static bool _debugServiceExtensionsRegistered = false;

  /// 该 binding 的window 对象
  ui.Window get window => ui.window;

  /// 用于绑定一些平台方法或者配置服务。
  @protected
  @mustCallSuper
  void initInstances() {}

  /// 绑定服务
  @protected
  @mustCallSuper
  void initServiceExtensions() {}

  @protected
  bool get locked => _lockCount > 0;
  int _lockCount = 0;

  @protected
  Future<void> lockEvents(Future<void> callback()) {}

  @protected
  @mustCallSuper
  void unlocked() {}

  /// 开发时热重载
  Future<void> reassembleApplication() {}

  /// 开发时热重载
  @mustCallSuper
  @protected
  Future<void> performReassemble() {}

  /// 注册指定名字的服务
  @protected
  void registerSignalServiceExtension({
    @required String name,
    @required AsyncCallback callback,
  }) {}

  @protected
  void registerBoolServiceExtension({
    @required String name,
    @required AsyncValueGetter<bool> getter,
    @required AsyncValueSetter<bool> setter,
  }) {}

  @protected
  void registerNumericServiceExtension({
    @required String name,
    @required AsyncValueGetter<double> getter,
    @required AsyncValueSetter<double> setter,
  }) {}

  
  void _postExtensionStateChangedEvent(String name, dynamic value) {}

  @protected
  void postEvent(String eventKind, Map<String, dynamic> eventData) {
    developer.postEvent(eventKind, eventData);
  }

  @protected
  void registerStringServiceExtension({
    @required String name,
    @required AsyncValueGetter<String> getter,
    @required AsyncValueSetter<String> setter,
  }) {}

  /// 注册服务
  @protected
  void registerServiceExtension({
    @required String name,
    @required ServiceExtensionCallback callback,
  }) {}

  @override
  String toString() => '<$runtimeType>';
}
```

### bitfield.dart
定义了可索引的位操作域。类似定义了 `Iterable` 这样的抽象类，用于给 flutter 程序使用。

### change_notifier.dart
观察者模式。定义了几个抽象类观察者，用于监听、派发。
1. Listenable
2. ValueListenable
3. ChangeNotifier
4. ValueNotifier  当 value 改变时，触发 notifyListeners

### collections.dart
定义了几个比较集合的方法。

### consolidate_response.dart
定义了与 http 响应相关的 consolidateHttpClientResponseBytes 方法。

### constants.dart
定义了几个常量。kReleaseMode、kProfileMode、kDebugMode、precisionErrorTolerance、kIsWeb。

### debug.dart
调试相关。几个方法。debugFormatDouble、debugInstrumentAction、debugAssertAllFoundationVarsUnset。

### diagnostics.dart
诊断树相关。

### isolates.dart
定义一个 compute 方法，用于单独开启一个 isolate 用于计算。

### key.dart
key 是对 Widget、Element、SemanticsNode 的唯一标志。

### licenses.dart
许可证相关？

### node.dart
定义一个抽象树节点。

### observer_list.dart
定义观察者列表。ObserverList。

### platform.dart
定义当前平台。

### print.dart
debug 时的打印相关。

### serialization.dart
序列化相关。定义了读写 Buffer。

### synchronous_future.dart
定义了可同步执行 then 的 Future。

### unicode.dart
定义了几个Unicode常量。


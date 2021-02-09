---
title: flutter 中路由详解
tags:
  - flutter-route
date: 2019-10-26 22:13:48
categories: flutter
---


## 背景
在 flutter 中，UI开发是非常重要的一块。但作为一个应用，路由管理也是非常重要的。在 flutter 中，路由不仅仅是逻辑上的控制，也在显示上有作用。下面就一起学习一下 flutter 的路由相关（以大量代码为主）。

<!-- more -->

## 了解基础
### Navigator
flutter 中的页面，都是以路由的形式展现的。每一个路由可以理解为一个页面（也可以是覆盖在当前页面上的弹层）。全屏路由，一般继承 PageRoute；弹层路由，一般继承 PopupRoute。flutter 中通过导航器 `Navigator` 控制路由的入栈、出栈等。常规的多页应用，也都是一层覆盖一层路由，最上面的路由就是我们能看到的界面。

#### 使用`Navigator`
最简单的方式是使用 `WidgetsApp`或者`MetarialApp`作为顶层组件，其内会使用到 `Navigator`。比如：
```dart
void main() {
  runApp(MaterialApp(home: MyAppHome()));
}
```
入栈一个新的页面：
```dart
Navigator.push(context, MaterialPageRoute<void>(
  builder: (BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('My Page')),
      body: Center(
        child: FlatButton(
          child: Text('POP'),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
    );
  },
));
```
每一个路由被设计为 WidgetBuilder 形式，是因为它的创建是与环境(context)相关的。

#### 具名路由
与常规路由一样，它也支持具名路由，在创建 `MaterialApp` 时，可以传入`routers`：
```dart
void main() {
  runApp(MaterialApp(
    home: MyAppHome(), // becomes the route named '/'
    routes: <String, WidgetBuilder> {
      '/a': (BuildContext context) => MyPage(title: 'page A'),
      '/b': (BuildContext context) => MyPage(title: 'page B'),
      '/c': (BuildContext context) => MyPage(title: 'page C'),
    },
  ));
}

// 入栈页面
Navigator.pushNamed(context, '/b');
```

#### 入栈可以返回值
入栈，从表面来看，像是一个 void 操作，但实际上，它可以返回一个值。比如：
```dart
bool value = await Navigator.push(context, MaterialPageRoute<bool>(
  builder: (BuildContext context) {
    return Center(
      child: GestureDetector(
        child: Text('OK'),
        onTap: () { Navigator.pop(context, true); }
      ),
    );
  }
));
```
上面的代码完成了入栈一个 `PageRoute`，并等待它弹出。这个返回值有什么用呢？
- 如果用户时点击`Text('ok')`来返回的，`value` 会是 `true`
- 如果用户是点击物理返回键（安卓）或者 `AppBar`上的按钮等方式，`value` 会是 `null`

这可以让我们知道路由是怎么被弹出的。

#### 弹出层路由
之前说了，路由并不一定是全屏覆盖的，这里说的弹出层路由，就属于非全屏路由。弹出层会使用透明色遮罩层来盖住全屏，阻止与前层路由的交互。有许多内置使用弹出层的地方，比如 showDialog，showMenu 等。

#### 自定义路由
你能自定义路由，就像 PopupRoute、ModalRoute、PageRoute 等一样，你能控制过渡效果，遮罩层颜色，或者其他任何方面。比如我就实现了能够与前层路由交互的弹层路由。

#### 嵌套路由
iOS 应用程序采用选项卡式导航。每一个 tab 维护了自己的导航历史。因此，每一个 tab 有自己的`Navigator`，像是一种并行导航。除此之外，还有一种场景：即使是不同的 tab，但如果触发了全局的弹窗，比如一个警告框，它应该是相对于屏幕的，而不是当前 tab 的导航器。所以，除了各个 tab 的导航器，还需要一个根导航器，来包含所有 tab 导航器。这就形成了嵌套的路由。
可参考这个官方用例：
```dart
// Flutter code sample for

// The following example demonstrates how a nested [Navigator] can be used to
// present a standalone user registration journey.
//
// Even though this example uses two [Navigator]s to demonstrate nested
// [Navigator]s, a similar result is possible using only a single [Navigator].
//
// Run this example with `flutter run --route=/signup` to start it with
// the signup flow instead of on the home page.

import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Code Sample for Navigator',
      // MaterialApp contains our top-level Navigator
      initialRoute: '/',
      routes: {
        '/': (BuildContext context) => HomePage(),
        '/signup': (BuildContext context) => SignUpPage(),
      },
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTextStyle(
      style: Theme.of(context).textTheme.display1,
      child: Container(
        color: Colors.white,
        alignment: Alignment.center,
        child: Text('Home Page'),
      ),
    );
  }
}

class CollectPersonalInfoPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTextStyle(
      style: Theme.of(context).textTheme.display1,
      child: GestureDetector(
        onTap: () {
          // This moves from the personal info page to the credentials page,
          // replacing this page with that one.
          Navigator.of(context)
              .pushReplacementNamed('signup/choose_credentials');
        },
        child: Container(
          color: Colors.lightBlue,
          alignment: Alignment.center,
          child: Text('Collect Personal Info Page'),
        ),
      ),
    );
  }
}

class ChooseCredentialsPage extends StatelessWidget {
  const ChooseCredentialsPage({
    this.onSignupComplete,
  });

  final VoidCallback onSignupComplete;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSignupComplete,
      child: DefaultTextStyle(
        style: Theme.of(context).textTheme.display1,
        child: Container(
          color: Colors.pinkAccent,
          alignment: Alignment.center,
          child: Text('Choose Credentials Page'),
        ),
      ),
    );
  }
}

class SignUpPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // SignUpPage builds its own Navigator which ends up being a nested
    // Navigator in our app.
    return Navigator(
      initialRoute: 'signup/personal_info',
      onGenerateRoute: (RouteSettings settings) {
        WidgetBuilder builder;
        switch (settings.name) {
          case 'signup/personal_info':
            // Assume CollectPersonalInfoPage collects personal info and then
            // navigates to 'signup/choose_credentials'.
            builder = (BuildContext _) => CollectPersonalInfoPage();
            break;
          case 'signup/choose_credentials':
            // Assume ChooseCredentialsPage collects new credentials and then
            // invokes 'onSignupComplete()'.
            builder = (BuildContext _) => ChooseCredentialsPage(
                  onSignupComplete: () {
                    // Referencing Navigator.of(context) from here refers to the
                    // top level Navigator because SignUpPage is above the
                    // nested Navigator that it created. Therefore, this pop()
                    // will pop the entire "sign up" journey and return to the
                    // "/" route, AKA HomePage.
                    Navigator.of(context).pop();
                  },
                );
            break;
          default:
            throw Exception('Invalid route: ${settings.name}');
        }
        return MaterialPageRoute(builder: builder, settings: settings);
      },
    );
  }
}
```
#### Navigator 代码
现在来看一下`Navigator`的代码。

```dart
class Navigator extends StatefulWidget {
  const Navigator({
    Key key,
    this.initialRoute,
    @required this.onGenerateRoute,
    this.onUnknownRoute,
    this.observers = const <NavigatorObserver>[],
  });

  // 默认需要显示的路由的路由名称
  final String initialRoute;

  // 当需要创建路由时的回调。签名如下：
  // typedef RouteFactory = Route<dynamic> Function(RouteSettings settings);
  final RouteFactory onGenerateRoute;

  // 当`onGenerateRoute`没有返回 route 时的回调。一般用于错误处理。
  final RouteFactory onUnknownRoute;

  // 导航器的监听对象列表
  final List<NavigatorObserver> observers;

  static const String defaultRouteName = '/';

  // 入栈一个具名路由
  // 新路由和先前的路由会被通知。如果有监听者对象，同样也会触发。
  // 如果新路由入栈，此时在当前路由中持续的手势会被取消（WTF?）
  @optionalTypeArgs
  static Future<T> pushNamed<T extends Object>(
    BuildContext context,
    String routeName, {
    Object arguments,
   }) {
    return Navigator.of(context).pushNamed<T>(routeName, arguments: arguments);
  }

  // 替换当前路由。在新路由完成入栈后，移除原来的路由。
  @optionalTypeArgs
  static Future<T> pushReplacementNamed<T extends Object, TO extends Object>(
    BuildContext context,
    String routeName, {
    TO result,
    Object arguments,
  }) {
    return Navigator.of(context).pushReplacementNamed<T, TO>(routeName, arguments: arguments, result: result);
  }

  // 移除当前路由，再入栈新的路由。
  @optionalTypeArgs
  static Future<T> popAndPushNamed<T extends Object, TO extends Object>(
    BuildContext context,
    String routeName, {
    TO result,
    Object arguments,
   }) {
    return Navigator.of(context).popAndPushNamed<T, TO>(routeName, arguments: arguments, result: result);
  }

  // 先入栈新路由，再一直移除路由。
  @optionalTypeArgs
  static Future<T> pushNamedAndRemoveUntil<T extends Object>(
    BuildContext context,
    String newRouteName,
    RoutePredicate predicate, {
    Object arguments,
  }) {
    return Navigator.of(context).pushNamedAndRemoveUntil<T>(newRouteName, predicate, arguments: arguments);
  }

  // 入栈一个路由
  @optionalTypeArgs
  static Future<T> push<T extends Object>(BuildContext context, Route<T> route) {
    return Navigator.of(context).push(route);
  }

  // 入栈一个路由，结束后移除之前的路由
  @optionalTypeArgs
  static Future<T> pushReplacement<T extends Object, TO extends Object>(BuildContext context, Route<T> newRoute, { TO result }) {
    return Navigator.of(context).pushReplacement<T, TO>(newRoute, result: result);
  }

  // 已有相关解释
  @optionalTypeArgs
  static Future<T> pushAndRemoveUntil<T extends Object>(BuildContext context, Route<T> newRoute, RoutePredicate predicate) {
    return Navigator.of(context).pushAndRemoveUntil<T>(newRoute, predicate);
  }

  // 替换当前路由
  @optionalTypeArgs
  static void replace<T extends Object>(BuildContext context, { @required Route<dynamic> oldRoute, @required Route<T> newRoute }) {
    return Navigator.of(context).replace<T>(oldRoute: oldRoute, newRoute: newRoute);
  }

  // 替换给定锚点路由下的路由
  @optionalTypeArgs
  static void replaceRouteBelow<T extends Object>(BuildContext context, { @required Route<dynamic> anchorRoute, Route<T> newRoute }) {
    return Navigator.of(context).replaceRouteBelow<T>(anchorRoute: anchorRoute, newRoute: newRoute);
  }

  // 能否 pop
  static bool canPop(BuildContext context) {
    final NavigatorState navigator = Navigator.of(context, nullOk: true);
    return navigator != null && navigator.canPop();
  }

  // 调用 Route.willPop 来判断是否弹出。
  @optionalTypeArgs
  static Future<bool> maybePop<T extends Object>(BuildContext context, [ T result ]) {
    return Navigator.of(context).maybePop<T>(result);
  }

  // 弹出
  @optionalTypeArgs
  static bool pop<T extends Object>(BuildContext context, [ T result ]) {
    return Navigator.of(context).pop<T>(result);
  }
  // 弹出直到
  static void popUntil(BuildContext context, RoutePredicate predicate) {
    Navigator.of(context).popUntil(predicate);
  }

  // 移除给定 route
  static void removeRoute(BuildContext context, Route<dynamic> route) {
    return Navigator.of(context).removeRoute(route);
  }

  // 移除锚点后的 route
  static void removeRouteBelow(BuildContext context, Route<dynamic> anchorRoute) {
    return Navigator.of(context).removeRouteBelow(anchorRoute);
  }

  
  static NavigatorState of(
    BuildContext context, {
    bool rootNavigator = false,
    bool nullOk = false,
  }) {
    final NavigatorState navigator = rootNavigator
        ? context.rootAncestorStateOfType(const TypeMatcher<NavigatorState>())
        : context.ancestorStateOfType(const TypeMatcher<NavigatorState>());
    return navigator;
  }
  @override
  NavigatorState createState() => NavigatorState();
}
```
其实看完了，大概就一些常用的路由操作。静态方法 of 中有一个 `rootNavigator` 用于决定是否使用最远端的导航器。再单导航器中 true or false 都无所谓。主要逻辑都在 `NavigatorState`中。来看一下 `NavigatorState`。
```dart
class NavigatorState extends State<Navigator> with TickerProviderStateMixin {

  // overlay key
  final GlobalKey<OverlayState> _overlayKey = GlobalKey<OverlayState>();
  // 当前导航器历史的 list
  final List<Route<dynamic>> _history = <Route<dynamic>>[];
  // 移除了的路由，以 Set 保存。
  final Set<Route<dynamic>> _poppedRoutes = <Route<dynamic>>{};

  /// The [FocusScopeNode] for the [FocusScope] that encloses the routes.
  final FocusScopeNode focusScopeNode = FocusScopeNode(debugLabel: 'Navigator Scope');

  final List<OverlayEntry> _initialOverlayEntries = <OverlayEntry>[];

  // 
  @override
  void initState() {
    super.initState();
    for (NavigatorObserver observer in widget.observers) {
      observer._navigator = this;
    }
    String initialRouteName = widget.initialRoute ?? Navigator.defaultRouteName;
    if (initialRouteName.startsWith('/') && initialRouteName.length > 1) {
      initialRouteName = initialRouteName.substring(1); // strip leading '/'
      assert(Navigator.defaultRouteName == '/');
      final List<String> plannedInitialRouteNames = <String>[
        Navigator.defaultRouteName,
      ];
      final List<Route<dynamic>> plannedInitialRoutes = <Route<dynamic>>[
        _routeNamed<dynamic>(Navigator.defaultRouteName, allowNull: true, arguments: null),
      ];
      final List<String> routeParts = initialRouteName.split('/');
      if (initialRouteName.isNotEmpty) {
        String routeName = '';
        for (String part in routeParts) {
          routeName += '/$part';
          plannedInitialRouteNames.add(routeName);
          plannedInitialRoutes.add(_routeNamed<dynamic>(routeName, allowNull: true, arguments: null));
        }
      }
      if (plannedInitialRoutes.contains(null)) {
        push(_routeNamed<Object>(Navigator.defaultRouteName, arguments: null));
      } else {
        plannedInitialRoutes.forEach(push);
      }
    } else {
      Route<Object> route;
      if (initialRouteName != Navigator.defaultRouteName)
        route = _routeNamed<Object>(initialRouteName, allowNull: true, arguments: null);
      route ??= _routeNamed<Object>(Navigator.defaultRouteName, arguments: null);
      push(route);
    }
    for (Route<dynamic> route in _history)
      _initialOverlayEntries.addAll(route.overlayEntries);
  }

  @override
  void didUpdateWidget(Navigator oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.observers != widget.observers) {
      for (NavigatorObserver observer in oldWidget.observers)
        observer._navigator = null;
      for (NavigatorObserver observer in widget.observers) {
        observer._navigator = this;
      }
    }
    for (Route<dynamic> route in _history)
      route.changedExternalState();
  }

  // 回收：
  //   1. 监听器的_navigator 属性置空
  //   2. 每一个路由调用 dispose，并清空弹出历史、当前历史
  //   3. 失焦
  @override
  void dispose() {
    for (NavigatorObserver observer in widget.observers)
      observer._navigator = null;
    final List<Route<dynamic>> doomed = _poppedRoutes.toList()..addAll(_history);
    for (Route<dynamic> route in doomed)
      route.dispose();
    _poppedRoutes.clear();
    _history.clear();
    focusScopeNode.dispose();
    super.dispose();
  }

  /// 当前导航器用于展示内容的覆盖层
  OverlayState get overlay => _overlayKey.currentState;

  // 返回当前导航器最上层覆盖层的最上层
  OverlayEntry get _currentOverlayEntry {
    for (Route<dynamic> route in _history.reversed) {
      if (route.overlayEntries.isNotEmpty)
        return route.overlayEntries.last;
    }
    return null;
  }

  bool _debugLocked = false; // used to prevent re-entrant calls to push, pop, and friends

  Route<T> _routeNamed<T>(String name, { @required Object arguments, bool allowNull = false }) {
    final RouteSettings settings = RouteSettings(
      name: name,
      isInitialRoute: _history.isEmpty,
      arguments: arguments,
    );
    Route<T> route = widget.onGenerateRoute(settings);
    if (route == null && !allowNull) {
      route = widget.onUnknownRoute(settings);
    }
    return route;
  }

  
  @optionalTypeArgs
  Future<T> pushNamed<T extends Object>(
    String routeName, {
    Object arguments,
  }) {
    return push<T>(_routeNamed<T>(routeName, arguments: arguments));
  }

  
  @optionalTypeArgs
  Future<T> pushReplacementNamed<T extends Object, TO extends Object>(
    String routeName, {
    TO result,
    Object arguments,
  }) {
    return pushReplacement<T, TO>(_routeNamed<T>(routeName, arguments: arguments), result: result);
  }

  @optionalTypeArgs
  Future<T> popAndPushNamed<T extends Object, TO extends Object>(
    String routeName, {
    TO result,
    Object arguments,
  }) {
    pop<TO>(result);
    return pushNamed<T>(routeName, arguments: arguments);
  }

  @optionalTypeArgs
  Future<T> pushNamedAndRemoveUntil<T extends Object>(
    String newRouteName,
    RoutePredicate predicate, {
    Object arguments,
  }) {
    return pushAndRemoveUntil<T>(_routeNamed<T>(newRouteName, arguments: arguments), predicate);
  }

  // 入栈路由关键方法
  @optionalTypeArgs
  Future<T> push<T extends Object>(Route<T> route) {
    final Route<dynamic> oldRoute = _history.isNotEmpty ? _history.last : null;
    // 设置新路由的导航器
    route._navigator = this;
    // 安装路由. 一般是讲 overlay 插入到 overlayEntry
    route.install(_currentOverlayEntry);
    // 当前历史添加该路由
    _history.add(route);
    // 该路由触发 didPush
    route.didPush();
    // 该路由触发 didChangeNext 参数为 null
    route.didChangeNext(null);
    if (oldRoute != null) {
      // 触发上一个路由的 didChangeNext,参数为新路由
      oldRoute.didChangeNext(route);
      // 新路由触发 didChangePrevious 参数为 老路由
      route.didChangePrevious(oldRoute);
    }
    // 触发监听器
    for (NavigatorObserver observer in widget.observers)
      observer.didPush(route, oldRoute);
    // 这个方法当前只针对了 web 有操作
    RouteNotificationMessages.maybeNotifyRouteChange(_routePushedMethod, route, oldRoute);
    // 在导航后的其他操作. 比如取消老路由中的所有手势...
    _afterNavigation(route);
    return route.popped;
  }

  void _afterNavigation<T>(Route<T> route) {
    _cancelActivePointers();
  }

  
  @optionalTypeArgs
  Future<T> pushReplacement<T extends Object, TO extends Object>(Route<T> newRoute, { TO result }) {
    final Route<dynamic> oldRoute = _history.last;
    final int index = _history.length - 1;
    newRoute._navigator = this;
    newRoute.install(_currentOverlayEntry);
    _history[index] = newRoute;
    newRoute.didPush().whenCompleteOrCancel(() {
      if (mounted) {
        oldRoute
          ..didComplete(result ?? oldRoute.currentResult)
          ..dispose();
      }
    });
    newRoute.didChangeNext(null);
    if (index > 0) {
      _history[index - 1].didChangeNext(newRoute);
      newRoute.didChangePrevious(_history[index - 1]);
    }
    for (NavigatorObserver observer in widget.observers)
      observer.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    RouteNotificationMessages.maybeNotifyRouteChange(_routeReplacedMethod, newRoute, oldRoute);
    _afterNavigation(newRoute);
    return newRoute.popped;
  }

  
  @optionalTypeArgs
  Future<T> pushAndRemoveUntil<T extends Object>(Route<T> newRoute, RoutePredicate predicate) {
    
    // The route that is being pushed on top of
    final Route<dynamic> precedingRoute = _history.isNotEmpty ? _history.last : null;
    final OverlayEntry precedingRouteOverlay = _currentOverlayEntry;

    // Routes to remove
    final List<Route<dynamic>> removedRoutes = <Route<dynamic>>[];
    while (_history.isNotEmpty && !predicate(_history.last)) {
      final Route<dynamic> removedRoute = _history.removeLast();
      removedRoutes.add(removedRoute);
    }

    // Push new route
    final Route<dynamic> newPrecedingRoute = _history.isNotEmpty ? _history.last : null;
    newRoute._navigator = this;
    newRoute.install(precedingRouteOverlay);
    _history.add(newRoute);

    newRoute.didPush().whenCompleteOrCancel(() {
      if (mounted) {
        for (Route<dynamic> removedRoute in removedRoutes) {
          for (NavigatorObserver observer in widget.observers)
            observer.didRemove(removedRoute, newPrecedingRoute);
          removedRoute.dispose();
        }

        if (newPrecedingRoute != null)
          newPrecedingRoute.didChangeNext(newRoute);
      }
    });

    // Notify for newRoute
    newRoute.didChangeNext(null);
    for (NavigatorObserver observer in widget.observers)
      observer.didPush(newRoute, precedingRoute);
    _afterNavigation(newRoute);
    return newRoute.popped;
  }

  
  @optionalTypeArgs
  void replace<T extends Object>({ @required Route<dynamic> oldRoute, @required Route<T> newRoute }) {
    if (oldRoute == newRoute)
      return;
    final int index = _history.indexOf(oldRoute);
    newRoute._navigator = this;
    newRoute.install(oldRoute.overlayEntries.last);
    _history[index] = newRoute;
    newRoute.didReplace(oldRoute);
    if (index + 1 < _history.length) {
      newRoute.didChangeNext(_history[index + 1]);
      _history[index + 1].didChangePrevious(newRoute);
    } else {
      newRoute.didChangeNext(null);
    }
    if (index > 0) {
      _history[index - 1].didChangeNext(newRoute);
      newRoute.didChangePrevious(_history[index - 1]);
    }
    for (NavigatorObserver observer in widget.observers)
      observer.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    RouteNotificationMessages.maybeNotifyRouteChange(_routeReplacedMethod, newRoute, oldRoute);
    oldRoute.dispose();
  }

  @optionalTypeArgs
  void replaceRouteBelow<T extends Object>({ @required Route<dynamic> anchorRoute, Route<T> newRoute }) {
    replace<T>(oldRoute: _history[_history.indexOf(anchorRoute) - 1], newRoute: newRoute);
  }

  bool canPop() {
    return _history.length > 1 || _history[0].willHandlePopInternally;
  }

  // 调用 route.willPop 来判断 是否可以弹出
  @optionalTypeArgs
  Future<bool> maybePop<T extends Object>([ T result ]) async {
    final Route<T> route = _history.last;
    final RoutePopDisposition disposition = await route.willPop();
    if (disposition != RoutePopDisposition.bubble && mounted) {
      if (disposition == RoutePopDisposition.pop)
        pop(result);
      return true;
    }
    return false;
  }

  
  @optionalTypeArgs
  bool pop<T extends Object>([ T result ]) {
    final Route<dynamic> route = _history.last;
    bool debugPredictedWouldPop;
    if (route.didPop(result ?? route.currentResult)) {
      if (_history.length > 1) {
        _history.removeLast();
        if (route._navigator != null)
          _poppedRoutes.add(route);
        _history.last.didPopNext(route);
        for (NavigatorObserver observer in widget.observers)
          observer.didPop(route, _history.last);
        RouteNotificationMessages.maybeNotifyRouteChange(_routePoppedMethod, route, _history.last);
      } else {
        return false;
      }
    }
    _afterNavigation<dynamic>(route);
    return true;
  }

  void popUntil(RoutePredicate predicate) {
    while (!predicate(_history.last))
      pop();
  }

  void removeRoute(Route<dynamic> route) {
    final int index = _history.indexOf(route);
    final Route<dynamic> previousRoute = index > 0 ? _history[index - 1] : null;
    final Route<dynamic> nextRoute = (index + 1 < _history.length) ? _history[index + 1] : null;
    _history.removeAt(index);
    previousRoute?.didChangeNext(nextRoute);
    nextRoute?.didChangePrevious(previousRoute);
    for (NavigatorObserver observer in widget.observers)
      observer.didRemove(route, previousRoute);
    route.dispose();
    _afterNavigation<dynamic>(nextRoute);
  }

  void removeRouteBelow(Route<dynamic> anchorRoute) {
    final int index = _history.indexOf(anchorRoute) - 1;
    final Route<dynamic> targetRoute = _history[index];
    _history.removeAt(index);
    final Route<dynamic> nextRoute = index < _history.length ? _history[index] : null;
    final Route<dynamic> previousRoute = index > 0 ? _history[index - 1] : null;
    if (previousRoute != null)
      previousRoute.didChangeNext(nextRoute);
    if (nextRoute != null)
      nextRoute.didChangePrevious(previousRoute);
    targetRoute.dispose();
  }

  void finalizeRoute(Route<dynamic> route) {
    _poppedRoutes.remove(route);
    route.dispose();
  }

  // 当前路由是否用户正在操作
  bool get userGestureInProgress => _userGesturesInProgress > 0;
  int _userGesturesInProgress = 0;

  // 用户开始操作的回调
  void didStartUserGesture() {
    _userGesturesInProgress += 1;
    if (_userGesturesInProgress == 1) {
      final Route<dynamic> route = _history.last;
      final Route<dynamic> previousRoute = !route.willHandlePopInternally && _history.length > 1
          ? _history[_history.length - 2]
          : null;
      for (NavigatorObserver observer in widget.observers)
        observer.didStartUserGesture(route, previousRoute);
    }
  }

  // 用户完成操作的回调
  void didStopUserGesture() {
    _userGesturesInProgress -= 1;
    if (_userGesturesInProgress == 0) {
      for (NavigatorObserver observer in widget.observers)
        observer.didStopUserGesture();
    }
  }
  // 活跃的指针, 指手势?
  final Set<int> _activePointers = <int>{};

  void _handlePointerDown(PointerDownEvent event) {
    _activePointers.add(event.pointer);
  }

  void _handlePointerUpOrCancel(PointerEvent event) {
    _activePointers.remove(event.pointer);
  }

  // 取消所有活跃手势
  void _cancelActivePointers() {
    if (SchedulerBinding.instance.schedulerPhase == SchedulerPhase.idle) {
      final RenderAbsorbPointer absorber = _overlayKey.currentContext?.ancestorRenderObjectOfType(const TypeMatcher<RenderAbsorbPointer>());
      setState(() {
        absorber?.absorbing = true;
      });
    }
    _activePointers.toList().forEach(WidgetsBinding.instance.cancelPointer);
  }

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerDown: _handlePointerDown,
      onPointerUp: _handlePointerUpOrCancel,
      onPointerCancel: _handlePointerUpOrCancel,
      child: AbsorbPointer(
        absorbing: false, // it's mutated directly by _cancelActivePointers above
        child: FocusScope(
          node: focusScopeNode,
          autofocus: true,
          child: Overlay(
            key: _overlayKey,
            initialEntries: _initialOverlayEntries,
          ),
        ),
      ),
    );
  }
}
```
看完了这个 State, 其实也没啥. 主要就是一些常规的路由操作. 比较有意思的事, 在入栈路由时, 会取消前路由的所有事件(有个 issue, 大家有兴趣的可以看看). 前面也提到了 `Overlay` 和 `Focus`, 下面来看看这个.
```dart
// 用于放入 Overlay中的, 可以包含组件.
// 一个OverlayEntry 同时最多只能被一个 Overlay 拥有.
// 因为 Overlay 使用 Stack 布局, 所以 OverlayEntry 可以使用 [Positioned] 和 
// [AnimatedPositioned]来定位.
// 默认情况下, 如果有一个完全不透明的层在这层之上, 那么这一层就不会进行 build. 除非设置 [maintainState]
// 为 true. (这可能会引起性能问题, 慎用)
class OverlayEntry {
  OverlayEntry({
    @required this.builder,
    bool opaque = false,
    bool maintainState = false,
  }) : _opaque = opaque,
       _maintainState = maintainState;

  final WidgetBuilder builder;

  // 如果该层设置为遮挡, 则该层以下的层默认不会被 build, 除非
  // 设置了 [maintainState] 为 true
  bool get opaque => _opaque;
  bool _opaque;
  set opaque(bool value) {
    if (_opaque == value)
      return;
    _opaque = value;
    _overlay._didChangeEntryOpacity();
  }

  bool get maintainState => _maintainState;
  bool _maintainState;
  set maintainState(bool value) {
    if (_maintainState == value)
      return;
    _maintainState = value;
    _overlay._didChangeEntryOpacity();
  }

  // 在 Overlay 中设置
  OverlayState _overlay;
  final GlobalKey<_OverlayEntryState> _key = GlobalKey<_OverlayEntryState>();

  void remove() { 
    final OverlayState overlay = _overlay;
    _overlay = null;
    if (SchedulerBinding.instance.schedulerPhase == SchedulerPhase.persistentCallbacks) {
      SchedulerBinding.instance.addPostFrameCallback((Duration duration) {
        overlay._remove(this);
      });
    } else {
      overlay._remove(this);
    }
  }

  void markNeedsBuild() {
    _key.currentState?._markNeedsBuild();
  }
}

class _OverlayEntry extends StatefulWidget {
  _OverlayEntry(this.entry)
    : super(key: entry._key);

  final OverlayEntry entry;

  @override
  _OverlayEntryState createState() => _OverlayEntryState();
}

class _OverlayEntryState extends State<_OverlayEntry> {
  @override
  Widget build(BuildContext context) {
    return widget.entry.builder(context);
  }

  void _markNeedsBuild() {
    setState(() {});
  }
}

class Overlay extends StatefulWidget {

  const Overlay({
    Key key,
    this.initialEntries = const <OverlayEntry>[],
  }) : super(key: key);

  final List<OverlayEntry> initialEntries;

  static OverlayState of(BuildContext context, { Widget debugRequiredFor }) {
    final OverlayState result = context.ancestorStateOfType(const TypeMatcher<OverlayState>());
    return result;
  }

  @override
  OverlayState createState() => OverlayState();
}

class OverlayState extends State<Overlay> with TickerProviderStateMixin {
  final List<OverlayEntry> _entries = <OverlayEntry>[];

  @override
  void initState() {
    super.initState();
    insertAll(widget.initialEntries);
  }

  int _insertionIndex(OverlayEntry below, OverlayEntry above) {
    if (below != null)
      return _entries.indexOf(below);
    if (above != null)
      return _entries.indexOf(above) + 1;
    return _entries.length;
  }


  void insert(OverlayEntry entry, { OverlayEntry below, OverlayEntry above }) {
    entry._overlay = this;
    setState(() {
      _entries.insert(_insertionIndex(below, above), entry);
    });
  }

  void insertAll(Iterable<OverlayEntry> entries, { OverlayEntry below, OverlayEntry above }) {
    if (entries.isEmpty)
      return;
    for (OverlayEntry entry in entries) {
      entry._overlay = this;
    }
    setState(() {
      _entries.insertAll(_insertionIndex(below, above), entries);
    });
  }

  // 重新排放
  void rearrange(Iterable<OverlayEntry> newEntries, { OverlayEntry below, OverlayEntry above }) {
    final List<OverlayEntry> newEntriesList = newEntries is List<OverlayEntry> ? newEntries : newEntries.toList(growable: false);
    if (newEntriesList.isEmpty)
      return;
    if (listEquals(_entries, newEntriesList))
      return;
    final LinkedHashSet<OverlayEntry> old = LinkedHashSet<OverlayEntry>.from(_entries);
    for (OverlayEntry entry in newEntriesList) {
      entry._overlay ??= this;
    }
    setState(() {
      _entries.clear();
      _entries.addAll(newEntriesList);
      old.removeAll(newEntriesList);
      _entries.insertAll(_insertionIndex(below, above), old);
    });
  }

  void _remove(OverlayEntry entry) {
    if (mounted) {
      setState(() {
        _entries.remove(entry);
      });
    }
  }

  bool debugIsVisible(OverlayEntry entry) {
    bool result = false;
    return result;
  }

  void _didChangeEntryOpacity() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> onstageChildren = <Widget>[];
    final List<Widget> offstageChildren = <Widget>[];
    bool onstage = true;
    // 从最后一个开始遍历
    for (int i = _entries.length - 1; i >= 0; i -= 1) {
      final OverlayEntry entry = _entries[i];
      
      if (onstage) {
        onstageChildren.add(_OverlayEntry(entry));
        // 如果当前层为遮挡, 则其他层默认不加入 tree
        if (entry.opaque)
          onstage = false;
      // 除非 maintainState 为 true
      } else if (entry.maintainState) {
        offstageChildren.add(TickerMode(enabled: false, child: _OverlayEntry(entry)));
      }
    }
    return _Theatre(
      onstage: Stack(
        fit: StackFit.expand,
        children: onstageChildren.reversed.toList(growable: false),
      ),
      offstage: offstageChildren,
    );
  }
}


class _Theatre extends RenderObjectWidget {
  _Theatre({
    this.onstage,
    @required this.offstage,
  });

  final Stack onstage;

  final List<Widget> offstage;

  @override
  _TheatreElement createElement() => _TheatreElement(this);

  @override
  _RenderTheatre createRenderObject(BuildContext context) => _RenderTheatre();
}

class _TheatreElement extends RenderObjectElement {
  _TheatreElement(_Theatre widget)
    : super(widget);

  @override
  _Theatre get widget => super.widget;

  @override
  _RenderTheatre get renderObject => super.renderObject;

  Element _onstage;
  static final Object _onstageSlot = Object();

  List<Element> _offstage;
  final Set<Element> _forgottenOffstageChildren = HashSet<Element>();

  @override
  void insertChildRenderObject(RenderBox child, dynamic slot) {
    if (slot == _onstageSlot) {
      renderObject.child = child;
    } else {
      renderObject.insert(child, after: slot?.renderObject);
    }
  }

  @override
  void moveChildRenderObject(RenderBox child, dynamic slot) {
    if (slot == _onstageSlot) {
      renderObject.remove(child);
      renderObject.child = child;
    } else {
      if (renderObject.child == child) {
        renderObject.child = null;
        renderObject.insert(child, after: slot?.renderObject);
      } else {
        renderObject.move(child, after: slot?.renderObject);
      }
    }
  }

  @override
  void removeChildRenderObject(RenderBox child) {
    if (renderObject.child == child) {
      renderObject.child = null;
    } else {
      renderObject.remove(child);
    }
  }

  @override
  void visitChildren(ElementVisitor visitor) {
    if (_onstage != null)
      visitor(_onstage);
    for (Element child in _offstage) {
      if (!_forgottenOffstageChildren.contains(child))
        visitor(child);
    }
  }

  @override
  void debugVisitOnstageChildren(ElementVisitor visitor) {
    if (_onstage != null)
      visitor(_onstage);
  }

  @override
  bool forgetChild(Element child) {
    if (child == _onstage) {
      _onstage = null;
    } else {
      _forgottenOffstageChildren.add(child);
    }
    return true;
  }

  @override
  void mount(Element parent, dynamic newSlot) {
    super.mount(parent, newSlot);
    _onstage = updateChild(_onstage, widget.onstage, _onstageSlot);
    _offstage = List<Element>(widget.offstage.length);
    Element previousChild;
    for (int i = 0; i < _offstage.length; i += 1) {
      final Element newChild = inflateWidget(widget.offstage[i], previousChild);
      _offstage[i] = newChild;
      previousChild = newChild;
    }
  }

  @override
  void update(_Theatre newWidget) {
    super.update(newWidget);
    _onstage = updateChild(_onstage, widget.onstage, _onstageSlot);
    _offstage = updateChildren(_offstage, widget.offstage, forgottenChildren: _forgottenOffstageChildren);
    _forgottenOffstageChildren.clear();
  }
}

class _RenderTheatre extends RenderBox
  with RenderObjectWithChildMixin<RenderStack>, RenderProxyBoxMixin<RenderStack>,
       ContainerRenderObjectMixin<RenderBox, StackParentData> {

  @override
  void setupParentData(RenderObject child) {
    if (child.parentData is! StackParentData)
      child.parentData = StackParentData();
  }

  @override
  void redepthChildren() {
    if (child != null)
      redepthChild(child);
    super.redepthChildren();
  }

  @override
  void visitChildren(RenderObjectVisitor visitor) {
    if (child != null)
      visitor(child);
    super.visitChildren(visitor);
  }

  @override
  List<DiagnosticsNode> debugDescribeChildren() {
    final List<DiagnosticsNode> children = <DiagnosticsNode>[];

    if (child != null)
      children.add(child.toDiagnosticsNode(name: 'onstage'));

    if (firstChild != null) {
      RenderBox child = firstChild;

      int count = 1;
      while (true) {
        children.add(
          child.toDiagnosticsNode(
            name: 'offstage $count',
            style: DiagnosticsTreeStyle.offstage,
          ),
        );
        if (child == lastChild)
          break;
        final StackParentData childParentData = child.parentData;
        child = childParentData.nextSibling;
        count += 1;
      }
    } else {
      children.add(
        DiagnosticsNode.message(
          'no offstage children',
          style: DiagnosticsTreeStyle.offstage,
        ),
      );
    }
    return children;
  }

  @override
  void visitChildrenForSemantics(RenderObjectVisitor visitor) {
    if (child != null)
      visitor(child);
  }
}
```
Ok, 到此就大致讲完了`Navigator`. 我们讲一下路由相关类.


### 路由相关类
#### Route
```dart
abstract class Route<T> {
  Route({ RouteSettings settings }) : settings = settings ?? const RouteSettings();

  // 归属的导航器. 在 install 中注册.
  NavigatorState get navigator => _navigator;
  NavigatorState _navigator;

  final RouteSettings settings;

  // 该 route 的所有 OverlayEntry
  List<OverlayEntry> get overlayEntries => const <OverlayEntry>[];

  // 当被插入到导航器时被调用.如果当前 route 是第一个加入的 route, 则 参数 
  // insertionPoint 为 null. 
  @protected
  @mustCallSuper
  void install(OverlayEntry insertionPoint) { }

  // 在 install 后被调用.
  // 当过渡完成时, 返回的 Future 会被结束.
  @protected
  TickerFuture didPush() => TickerFuture.complete();

  // 在 install 中替换了其他 route 后被调用
  @protected
  @mustCallSuper
  void didReplace(Route<dynamic> oldRoute) { }

  // Navigator.maybePop 会调用.
  Future<RoutePopDisposition> willPop() async {
    return isFirst ? RoutePopDisposition.bubble : RoutePopDisposition.pop;
  }

  // 调用 didPop 是否返回 false
  bool get willHandlePopInternally => false;

  // Navigator.pop 返回的默认结果
  T get currentResult => null;

  Future<T> get popped => _popCompleter.future;
  final Completer<T> _popCompleter = Completer<T>();

  @protected
  @mustCallSuper
  bool didPop(T result) {
    didComplete(result);
    return true;
  }

  @protected
  @mustCallSuper
  void didComplete(T result) {
    _popCompleter.complete(result);
  }

  @protected
  @mustCallSuper
  void didPopNext(Route<dynamic> nextRoute) { }

  @protected
  @mustCallSuper
  void didChangeNext(Route<dynamic> nextRoute) { }

  @protected
  @mustCallSuper
  void didChangePrevious(Route<dynamic> previousRoute) { }

  // 内部数据改变
  @protected
  @mustCallSuper
  void changedInternalState() { }

  // Navigator.widget 改变了
  @protected
  @mustCallSuper
  void changedExternalState() { }

  // 回收
  @mustCallSuper
  @protected
  void dispose() {
    _navigator = null;
  }

  // 是否是页面栈顶
  bool get isCurrent {
    return _navigator != null && _navigator._history.last == this;
  }

  bool get isFirst {
    return _navigator != null && _navigator._history.first == this;
  }

  bool get isActive {
    return _navigator != null && _navigator._history.contains(this);
  }
}
```
#### OverlayRoute
```dart

abstract class OverlayRoute<T> extends Route<T> {
  OverlayRoute({
    RouteSettings settings,
  }) : super(settings: settings);

  Iterable<OverlayEntry> createOverlayEntries();

  @override
  List<OverlayEntry> get overlayEntries => _overlayEntries;
  final List<OverlayEntry> _overlayEntries = <OverlayEntry>[];

  @override
  void install(OverlayEntry insertionPoint) {
    _overlayEntries.addAll(createOverlayEntries());
    navigator.overlay?.insertAll(_overlayEntries, above: insertionPoint);
    super.install(insertionPoint);
  }

  // 控制 didPop 是否调用 [NavigatorState.finalizeRoute]
  @protected
  bool get finishedWhenPopped => true;

  @override
  bool didPop(T result) {
    final bool returnValue = super.didPop(result);
    if (finishedWhenPopped)
      navigator.finalizeRoute(this);
    return returnValue;
  }

  @override
  void dispose() {
    for (OverlayEntry entry in _overlayEntries)
      entry.remove();
    _overlayEntries.clear();
    super.dispose();
  }
}
```
#### TransitionRoute
```dart
abstract class TransitionRoute<T> extends OverlayRoute<T> {
  TransitionRoute({
    RouteSettings settings,
  }) : super(settings: settings);

  Future<T> get completed => _transitionCompleter.future;
  final Completer<T> _transitionCompleter = Completer<T>();

  // 过渡时间
  Duration get transitionDuration;

  // 是否遮挡
  bool get opaque;

  @override
  bool get finishedWhenPopped => _controller.status == AnimationStatus.dismissed;

  // 驱动当前路由和前一个路由的过渡
  Animation<double> get animation => _animation;
  Animation<double> _animation;

  // 控制器
  @protected
  AnimationController get controller => _controller;
  AnimationController _controller;

  // 对当前路由之上新入栈的路由的动画.
  Animation<double> get secondaryAnimation => _secondaryAnimation;
  final ProxyAnimation _secondaryAnimation = ProxyAnimation(kAlwaysDismissedAnimation);

  // 创建控制器.
  AnimationController createAnimationController() {
    final Duration duration = transitionDuration;
    return AnimationController(
      duration: duration,
      debugLabel: debugLabel,
      vsync: navigator,
    );
  }

  // 返回动画对象
  Animation<double> createAnimation() {
    return _controller.view;
  }

  T _result;

  void _handleStatusChanged(AnimationStatus status) {
    switch (status) {
      case AnimationStatus.completed:
        if (overlayEntries.isNotEmpty)
          overlayEntries.first.opaque = opaque;
        break;
      case AnimationStatus.forward:
      case AnimationStatus.reverse:
        if (overlayEntries.isNotEmpty)
          overlayEntries.first.opaque = false;
        break;
      case AnimationStatus.dismissed:
        if (!isActive) {
          navigator.finalizeRoute(this);
          assert(overlayEntries.isEmpty);
        }
        break;
    }
    changedInternalState();
  }

  @override
  void install(OverlayEntry insertionPoint) {
    _controller = createAnimationController();
    _animation = createAnimation();
    super.install(insertionPoint);
  }

  @override
  TickerFuture didPush() {
    _animation.addStatusListener(_handleStatusChanged);
    return _controller.forward();
  }

  @override
  void didReplace(Route<dynamic> oldRoute) {
    if (oldRoute is TransitionRoute)
      _controller.value = oldRoute._controller.value;
    _animation.addStatusListener(_handleStatusChanged);
    super.didReplace(oldRoute);
  }

  @override
  bool didPop(T result) {
    _result = result;
    _controller.reverse();
    return super.didPop(result);
  }

  @override
  void didPopNext(Route<dynamic> nextRoute) {
    _updateSecondaryAnimation(nextRoute);
    super.didPopNext(nextRoute);
  }

  @override
  void didChangeNext(Route<dynamic> nextRoute) {
    _updateSecondaryAnimation(nextRoute);
    super.didChangeNext(nextRoute);
  }

  void _updateSecondaryAnimation(Route<dynamic> nextRoute) {
    if (nextRoute is TransitionRoute<dynamic> && canTransitionTo(nextRoute) && nextRoute.canTransitionFrom(this)) {
      final Animation<double> current = _secondaryAnimation.parent;
      if (current != null) {
        if (current is TrainHoppingAnimation) {
          TrainHoppingAnimation newAnimation;
          newAnimation = TrainHoppingAnimation(
            current.currentTrain,
            nextRoute._animation,
            onSwitchedTrain: () {
              _secondaryAnimation.parent = newAnimation.currentTrain;
              newAnimation.dispose();
            },
          );
          _secondaryAnimation.parent = newAnimation;
          current.dispose();
        } else {
          _secondaryAnimation.parent = TrainHoppingAnimation(current, nextRoute._animation);
        }
      } else {
        _secondaryAnimation.parent = nextRoute._animation;
      }
    } else {
      _secondaryAnimation.parent = kAlwaysDismissedAnimation;
    }
  }

  bool canTransitionTo(TransitionRoute<dynamic> nextRoute) => true;

  bool canTransitionFrom(TransitionRoute<dynamic> previousRoute) => true;

  @override
  void dispose() {
    _controller?.dispose();
    _transitionCompleter.complete(_result);
    super.dispose();
  }

  String get debugLabel => '$runtimeType';
}

```
#### LocalHostory
```dart
class LocalHistoryEntry {
  LocalHistoryEntry({ this.onRemove });

  final VoidCallback onRemove;

  LocalHistoryRoute<dynamic> _owner;

  void remove() {
    _owner.removeLocalHistoryEntry(this);
  }

  void _notifyRemoved() {
    if (onRemove != null)
      onRemove();
  }
}

mixin LocalHistoryRoute<T> on Route<T> {
  List<LocalHistoryEntry> _localHistory;

  void addLocalHistoryEntry(LocalHistoryEntry entry) {
    entry._owner = this;
    _localHistory ??= <LocalHistoryEntry>[];
    final bool wasEmpty = _localHistory.isEmpty;
    _localHistory.add(entry);
    if (wasEmpty)
      changedInternalState();
  }

  void removeLocalHistoryEntry(LocalHistoryEntry entry) {
    _localHistory.remove(entry);
    entry._owner = null;
    entry._notifyRemoved();
    if (_localHistory.isEmpty)
      changedInternalState();
  }

  @override
  Future<RoutePopDisposition> willPop() async {
    if (willHandlePopInternally)
      return RoutePopDisposition.pop;
    return await super.willPop();
  }

  @override
  bool didPop(T result) {
    if (_localHistory != null && _localHistory.isNotEmpty) {
      final LocalHistoryEntry entry = _localHistory.removeLast();
      entry._owner = null;
      entry._notifyRemoved();
      if (_localHistory.isEmpty)
        changedInternalState();
      return false;
    }
    return super.didPop(result);
  }

  @override
  bool get willHandlePopInternally {
    return _localHistory != null && _localHistory.isNotEmpty;
  }
}

```
#### ModalRoute
```dart
abstract class ModalRoute<T> extends TransitionRoute<T> with LocalHistoryRoute<T> {
  ModalRoute({
    RouteSettings settings,
  }) : super(settings: settings);

  // The API for general users of this class

  @optionalTypeArgs
  static ModalRoute<T> of<T extends Object>(BuildContext context) {
    final _ModalScopeStatus widget = context.inheritFromWidgetOfExactType(_ModalScopeStatus);
    return widget?.route;
  }

  // 安排调用 [buildTransitions]. 
  @protected
  void setState(VoidCallback fn) {
    if (_scopeKey.currentState != null) {
      _scopeKey.currentState._routeSetState(fn);
    } else {
      fn();
    }
  }

  static RoutePredicate withName(String name) {
    return (Route<dynamic> route) {
      return !route.willHandlePopInternally
          && route is ModalRoute
          && route.settings.name == name;
    };
  }

  // The API for subclasses to override - used by _ModalScope

  
  Widget buildPage(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation);

  Widget buildTransitions(
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child;
  }

  @override
  void install(OverlayEntry insertionPoint) {
    super.install(insertionPoint);
    _animationProxy = ProxyAnimation(super.animation);
    _secondaryAnimationProxy = ProxyAnimation(super.secondaryAnimation);
  }

  @override
  TickerFuture didPush() {
    if (_scopeKey.currentState != null) {
      navigator.focusScopeNode.setFirstFocus(_scopeKey.currentState.focusScopeNode);
    }
    return super.didPush();
  }

  // The API for subclasses to override - used by this class

  bool get barrierDismissible;

  bool get semanticsDismissible => true;

  Color get barrierColor;

  String get barrierLabel;

  bool get maintainState;


  // The API for _ModalScope and HeroController

  // 当前路由是否是否离屏.
  bool get offstage => _offstage;
  bool _offstage = false;
  set offstage(bool value) {
    if (_offstage == value)
      return;
    setState(() {
      _offstage = value;
    });
    _animationProxy.parent = _offstage ? kAlwaysCompleteAnimation : super.animation;
    _secondaryAnimationProxy.parent = _offstage ? kAlwaysDismissedAnimation : super.secondaryAnimation;
  }

  /// The build context for the subtree containing the primary content of this route.
  BuildContext get subtreeContext => _subtreeKey.currentContext;

  @override
  Animation<double> get animation => _animationProxy;
  ProxyAnimation _animationProxy;

  @override
  Animation<double> get secondaryAnimation => _secondaryAnimationProxy;
  ProxyAnimation _secondaryAnimationProxy;

  final List<WillPopCallback> _willPopCallbacks = <WillPopCallback>[];

  @override
  Future<RoutePopDisposition> willPop() async {
    final _ModalScopeState<T> scope = _scopeKey.currentState;
    for (WillPopCallback callback in List<WillPopCallback>.from(_willPopCallbacks)) {
      if (!await callback())
        return RoutePopDisposition.doNotPop;
    }
    return await super.willPop();
  }

  void addScopedWillPopCallback(WillPopCallback callback) {
    _willPopCallbacks.add(callback);
  }

  void removeScopedWillPopCallback(WillPopCallback callback) {
    _willPopCallbacks.remove(callback);
  }

  @protected
  bool get hasScopedWillPopCallback {
    return _willPopCallbacks.isNotEmpty;
  }

  @override
  void didChangePrevious(Route<dynamic> previousRoute) {
    super.didChangePrevious(previousRoute);
    changedInternalState();
  }

  @override
  void changedInternalState() {
    super.changedInternalState();
    setState(() {});
    _modalBarrier.markNeedsBuild();
  }

  @override
  void changedExternalState() {
    super.changedExternalState();
    if (_scopeKey.currentState != null)
      _scopeKey.currentState._forceRebuildPage();
  }

  bool get canPop => !isFirst || willHandlePopInternally;

  // Internals

  final GlobalKey<_ModalScopeState<T>> _scopeKey = GlobalKey<_ModalScopeState<T>>();
  final GlobalKey _subtreeKey = GlobalKey();
  final PageStorageBucket _storageBucket = PageStorageBucket();

  static final Animatable<double> _easeCurveTween = CurveTween(curve: Curves.ease);

  OverlayEntry _modalBarrier;
  Widget _buildModalBarrier(BuildContext context) {
    Widget barrier;
    if (barrierColor != null && !offstage) {
      final Animation<Color> color = animation.drive(
        ColorTween(
          begin: _kTransparent,
          end: barrierColor,
        ).chain(_easeCurveTween),
      );
      barrier = AnimatedModalBarrier(
        color: color,
        dismissible: barrierDismissible,
        semanticsLabel: barrierLabel,
        barrierSemanticsDismissible: semanticsDismissible,
      );
    } else {
      barrier = ModalBarrier(
        dismissible: barrierDismissible,
        semanticsLabel: barrierLabel,
        barrierSemanticsDismissible: semanticsDismissible,
      );
    }
    return IgnorePointer(
      ignoring: animation.status == AnimationStatus.reverse || 
                animation.status == AnimationStatus.dismissed,
      child: barrier,
    );
  }

  Widget _modalScopeCache;

  Widget _buildModalScope(BuildContext context) {
    return _modalScopeCache ??= _ModalScope<T>(
      key: _scopeKey,
      route: this,
    );
  }

  @override
  Iterable<OverlayEntry> createOverlayEntries() sync* {
    yield _modalBarrier = OverlayEntry(builder: _buildModalBarrier);
    yield OverlayEntry(builder: _buildModalScope, maintainState: maintainState);
  }
}
```
#### PopupRoute
```dart
abstract class PopupRoute<T> extends ModalRoute<T> {
  PopupRoute({
    RouteSettings settings,
  }) : super(settings: settings);

  @override
  bool get opaque => false;

  @override
  bool get maintainState => true;
}
```


#### PageRoute
```dart
abstract class PageRoute<T> extends ModalRoute<T> {
  PageRoute({
    RouteSettings settings,
    this.fullscreenDialog = false,
  }) : super(settings: settings);

  final bool fullscreenDialog;

  @override
  bool get opaque => true;

  @override
  bool get barrierDismissible => false;

  @override
  bool canTransitionTo(TransitionRoute<dynamic> nextRoute) => nextRoute is PageRoute;

  @override
  bool canTransitionFrom(TransitionRoute<dynamic> previousRoute) => previousRoute is PageRoute;

  @override
  AnimationController createAnimationController() {
    final AnimationController controller = super.createAnimationController();
    if (settings.isInitialRoute)
      controller.value = 1.0;
    return controller;
  }
}
```

#### MaterialPageRoute
```dart
class MaterialPageRoute<T> extends PageRoute<T> {
  MaterialPageRoute({
    @required this.builder,
    RouteSettings settings,
    this.maintainState = true,
    bool fullscreenDialog = false,
  }) : super(settings: settings, fullscreenDialog: fullscreenDialog);

  final WidgetBuilder builder;

  @override
  final bool maintainState;

  @override
  Duration get transitionDuration => const Duration(milliseconds: 300);

  @override
  Color get barrierColor => null;

  @override
  String get barrierLabel => null;

  @override
  bool canTransitionFrom(TransitionRoute<dynamic> previousRoute) {
    return previousRoute is MaterialPageRoute || previousRoute is CupertinoPageRoute;
  }

  @override
  bool canTransitionTo(TransitionRoute<dynamic> nextRoute) {
    return (nextRoute is MaterialPageRoute && !nextRoute.fullscreenDialog)
        || (nextRoute is CupertinoPageRoute && !nextRoute.fullscreenDialog);
  }

  @override
  Widget buildPage(
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
  ) {
    final Widget result = builder(context);
    assert(() {
      if (result == null) {
        throw FlutterError(
          'The builder for route "${settings.name}" returned null.\n'
          'Route builders must never return null.'
        );
      }
      return true;
    }());
    return Semantics(
      scopesRoute: true,
      explicitChildNodes: true,
      child: result,
    );
  }

  @override
  Widget buildTransitions(BuildContext context, Animation<double> animation, Animation<double> secondaryAnimation, Widget child) {
    final PageTransitionsTheme theme = Theme.of(context).pageTransitionsTheme;
    return theme.buildTransitions<T>(this, context, animation, secondaryAnimation, child);
  }
}
```

## 操作路由
从入栈一个路由开始
```dart
Navigator.of(context).push(PageRoute());
```
对，首先来到这：
```dart
  // NavigatorState
  @optionalTypeArgs
  Future<T> push<T extends Object>(Route<T> route) {
    final Route<dynamic> oldRoute = _history.isNotEmpty ? _history.last : null;
    route._navigator = this;
    // 安装 entry
    route.install(_currentOverlayEntry);
    // 添加历史
    _history.add(route);
    // 触发相关回调
    route.didPush();
    route.didChangeNext(null);
    if (oldRoute != null) {
      oldRoute.didChangeNext(route);
      route.didChangePrevious(oldRoute);
    }
    // 触发观察者列表
    for (NavigatorObserver observer in widget.observers)
      observer.didPush(route, oldRoute);
    RouteNotificationMessages.maybeNotifyRouteChange(_routePushedMethod, route, oldRoute);
    assert(() { _debugLocked = false; return true; }());
    _afterNavigation(route);
    return route.popped;
  }
```
当该层路由被弹出时，该方法才会返回。

当出栈时，及调用 Navigator.pop() 或者 maybePop()  （这里不讨论 popUntil 等其他形式）时：
```dart
  bool pop<T extends Object>([ T result ]) {
    // 去除最后一个（即当前）
    final Route<dynamic> route = _history.last;
    bool debugPredictedWouldPop;
    if (route.didPop(result ?? route.currentResult)) {
      if (_history.length > 1) {
        _history.removeLast();
        // If route._navigator is null, the route called finalizeRoute from
        // didPop, which means the route has already been disposed and doesn't
        // need to be added to _poppedRoutes for later disposal.
        if (route._navigator != null)
          _poppedRoutes.add(route);
        _history.last.didPopNext(route);
        for (NavigatorObserver observer in widget.observers)
          observer.didPop(route, _history.last);
        RouteNotificationMessages.maybeNotifyRouteChange(_routePoppedMethod, route, _history.last);
      } else {
        return false;
      }
    }
    _afterNavigation<dynamic>(route);
    return true;
  }
```


## 基于路由相关的设计

### 弹层
当一个弹层被加入到路由栈时，会使原路由顶的所有事件失效。此时，一些不该影响交互的组件，比如回到顶部这种组件，应该是不会中断原来的滚动的。因此对于这种情况，需要采用另一种方案：给当前 OverlayState 添加新的 OverlayEntry 即可。
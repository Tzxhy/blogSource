---
title: flutter状态管理调研
date: 2020-03-02 18:14:11
tags:
categories:
---

今天主要探讨的是 flutter 中常用的状态管理方案：BLoC 和 Provider，Redux。

## BLoC 介绍
关于 bloc，可以详细从[这里](https://bloclibrary.dev/#/zh-cn/architecture)去了解。这里我简单说说。
![bloc](https://bloclibrary.dev/assets/bloc_architecture.png)

从上图中可知，BLoC 有3个核心概念：UI、BLoC、Data。UI 即是页面展现，Bloc 作为业务逻辑单元，Data 作为持久数据层，对比 MVP 其实有挺多相似之处的。MVP中，通过Presenter 来沟通 View 和 Model；BLoC 模式中通过 BloC 模块沟通 UI 和 Data。
<!-- more -->
### 使用方式
组件显示往往与业务逻辑是相关的。通常我们会在一个组件中定义很多方法，比如 clickRecharge、hanglePay 等业务逻辑，但这样的结构，导致很难复用这些通用的业务逻辑。BLoC 的方式即是：UI 组件只绘制 UI，事件处理都交由 BLoC 对象，这样 BLoC 对象能被多个包含相同逻辑功能的组件复用。下面以计数器为例：

#### 定义一个 BLoC 逻辑块
这里忽略数据层的接入，直接将数据存于 BLoC 对象里，更新、读取都在这个对象中。可以看到 BLoC 逻辑块都是逻辑代码，跟 UI 无关。
```dart
enum CounterEvent {increment, decrement};
// 定义将 CounterEvent 事件转换为 int 数据
class CounterBloc extends Bloc<CounterEvent, int> {
  @override
  int get initialState => 0;

  /// 将事件转换为最终的数据
  @override
  Stream<int> mapEventToState(CounterEvent event) async* {
    switch (event) {
      case CounterEvent.decrement:
        yield state - 1;
        break;
      case CounterEvent.increment:
        yield state + 1;
        break;
    }
  }
}
```


#### 定义 UI
```dart
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: BlocProvider<CounterBloc>(
        create: (context) => CounterBloc(),
        child: CounterPage(),
      ),
    );
  }
}

class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // ignore close_sinks
    final CounterBloc counterBloc = BlocProvider.of<CounterBloc>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Counter')),
      // 获取 CounterBloc 类型的 BLoC 数据块，数据格式为 int
      body: BlocBuilder<CounterBloc, int>(
        builder: (context, count) {
          return Center(
            child: Text(
              '$count',
              style: TextStyle(fontSize: 24.0),
            ),
          );
        },
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          Padding(
            padding: EdgeInsets.symmetric(vertical: 5.0),
            child: FloatingActionButton(
              child: Icon(Icons.add),
              onPressed: () {
                counterBloc.add(CounterEvent.increment);
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.symmetric(vertical: 5.0),
            child: FloatingActionButton(
              child: Icon(Icons.remove),
              onPressed: () {
                counterBloc.add(CounterEvent.decrement);
              },
            ),
          ),
        ],
      ),
    );
  }
}
```
当 `CounterBloc` 数据更新后，会触发所有使用过 `CounterBloc` 的组件（在样例中，即是`BlocBuilder` 组件）重新 build。所以要求我们将 BLoC 模块的数据做的尽可能轻小，当然，也可以使用 `BlocBuilder` 提供的 condition 参数来控制是否更新当前组件。

___

## Provider
Provider 同样是依赖注入（注入状态到组件）。但与 bloc 不太一样的是：Provider 本身是作为 flutter 库而创建的；bloc 库是基于 RxDart 开发的纯 dart 库，作为flutter状态管理的话，还需配合 flutter_bloc 开发使用。但不知为何 flutter_bloc 又依赖了 provider 作为底层实现。。。

按照[readme.md](https://pub.dev/packages/provider#-readme-tab-)中所说，使用原生 Stream 也能很好的实现依赖注入的效果，但使用 Widget 的方式来使用依赖，更简单！因为组件很简单，也很容易扩展！

### 特点
1. 单项数据流。（从上往下）
2. 可测试、可组合
3. 可靠，因为很难忘记去处理数据更新（这里没太明白）

### 使用
[readme.md](https://pub.dev/packages/provider#-readme-tab-)文档中说明了一些使用禁忌，比如什么时候应该用.value 构造函数，什么时候不该用。这些其实是对 flutter 的更新机制有了了解后，自然而然能想到的东西。

#### 构造数据类
首先，我们需要构建数据存储对象。在 Provider 中，有着与 BLoC 中类似的对象：通知者。简而言之，Provider 基于 flutter 的`ChangeNotifier` 类做了文章。当然，Provider 也可以使用单纯的 State 对象来存储状态。

```dart
class Counter with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}
```
在 provider 中，通常情况下使用 ChangeNotifier 作为数据载体，同时也起着通知更新的作用。

#### 提供数据
本例中，对所有 child 提供了两种类型的数据：Counter、ColorConfig，在此后任一层级可以获取到这些数据。
```dart
class MyApp extends StatelessWidget {
  const MyApp();
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => Counter()),
        ChangeNotifierProvider(create: (_) => ColorConfig()),
      ],
      child: Consumer<Counter>(
        builder: (context, counter, _) {
          return MaterialApp(
            supportedLocales: const [Locale('en')],
            localizationsDelegates: [
              DefaultMaterialLocalizations.delegate,
              DefaultWidgetsLocalizations.delegate,
              _ExampleLocalizationsDelegate(counter.count),
            ],
            home: const MyHomePage(),
          );
        },
      ),
    );
  }
}
```


#### 获取数据
```dart
class MyHomePage extends StatelessWidget {
  const MyHomePage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Title()),
      body: const Center(child: CounterLabel()),
      floatingActionButton: const IncrementCounterButton(),
    );
  }
}

class IncrementCounterButton extends StatelessWidget {
  const IncrementCounterButton({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('IncrementCounterButton ' + (i++).toString());
    return FloatingActionButton(
      onPressed: () {
        Provider.of<Counter>(context, listen: false).increment();
      },
      tooltip: 'Increment',
      child: const Icon(Icons.add),
    );
  }
}

class CounterLabel extends StatelessWidget {
  const CounterLabel({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    print('CounterLabel ' + (i++).toString());
    final counter = Provider.of<Counter>(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        const Text(
          'You have pushed the button this many times:',
        ),
        Text(
          '${counter.count}',
          // ignore: deprecated_member_use
          style: Theme.of(context).textTheme.display1,
        ),
        const TestText(),
      ],
    );
  }
}
```
获取数据还可以通过 `Consumer` 方式来获取，这里不赘述。

## BLoC 对比 Provider
其实对比它们有点不合适：BLoC 是一种模式，而 Provider 是一种 flutter 的状态管理方案。BLoC 没有单独针对 flutter 设计，而 Provider 是给 flutter 使用的（从 flutter_bloc 依赖于 provider 也能看出来）。

从状态管理的作用来说，它们的使用方式是非常相似的：定义存储单元（同时兼顾更新通知），在顶层注入所需的数据，在需要数据的地方通过一些方式获取。其实从原理来说，也是一样的：将数据传入给一个自定义的 `InheritedWidget`，由其管理数据；UI 中通过 Provider.of<Type>(context) 来注册依赖；当`InheritedWidget`的数据更新时，选择性地通知所有注册过的 UI 组件进行更新。采用这种方式，基于 flutter 自身的设计方式，实现了状态从上往下、局部最小更新。我们后面要探讨的 redux 在 flutter 中的原理，原理也是一致的。不过在这三者中对比，BLoC 和 redux 更像是同一类：自身本就是一种模式，不局限于 flutter 中。

___


## redux
关于 redux 模式，不介绍过多基础内容，可以从[这里](https://redux.js.org/introduction/getting-started)了解。

在 flutter 中，需要引入
```yaml
dependencies:
  flutter_redux: ^0.6.0
  redux: ^4.0.0
```

这里只对 flutter_redux 做介绍。

### flutter_redux
看过这个库的同学可能比较了解，这个库整体比较简单：只通过一个文件，几个类定义即完成了状态管理。

#### StoreProvider\<Store\>
自身是一个`InheritedWidget`，以类型 T 标志该 InheritedWidget。

#### StoreConnector\<Store, Data\>
将 Store 类型的数据转换为 Data 类型。

#### StoreBuilder\<Store\>
获取 Store，自由构建组件。

### 使用 flutter_redux
#### 构建数据对象
```dart
/// 定义事件
enum Actions { Increment }

/// 定义 reducers。讲道理，dart 中 redux 库应该也提供类似 combineReducers 的方法。
int counterReducer(int state, dynamic action) {
  if (action == Actions.Increment) {
    return state + 1;
  }
  return state;
}

/// 生成全局唯一 store。从 redux 的设计角度来说，它希望使用者是全局使用唯一的 store，而不是分为很多个 store。
/// store 下可以自由构建数据分支。
final store = Store<int>(counterReducer, initialState: 0);
```

#### 提供数据 && 获取
```dart
class MyApp extends StatelessWidget {
  const MyApp();

  @override
  Widget build(BuildContext context) {
    return FlutterReduxApp(
      title: 'Flutter Redux Demo',
      store: store,
    );
  }
}

class FlutterReduxApp extends StatelessWidget {
  final Store<int> store;
  final String title;

  FlutterReduxApp({Key key, this.store, this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // StoreProvider 的作用就是包裹一层 InheritedWidget
    return StoreProvider<int>(
      store: store,
      child: MaterialApp(
        theme: ThemeData.dark(),
        title: title,
        home: Scaffold(
          appBar: AppBar(
            title: Text(title),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'You have pushed the button this many times:',
                ),
                // 根据当前 context，获取到 int 类型的最近 store，所需的数据类型为 String。
                // 每当 store 由 reducers 更新后，会自动触发更新。
                StoreConnector<int, String>(
                  // 将 Store 转为这里需要的 String
                  converter: (store) => store.state.toString(),
                  builder: (context, count) {
                    return Text(
                      count,
                      style: Theme.of(context).textTheme.display1,
                    );
                  },
                )
              ],
            ),
          ),
          floatingActionButton: StoreConnector<int, VoidCallback>(
            // 返回一个函数，用于触发事件派发。
            converter: (store) {
              return () => store.dispatch(Actions.Increment);
            },
            // 使用这个，可以防止 store 更新时，rebuild 该处。原理是对 store 的更新数据流做过滤，
            // 当满足被过滤的条件时，相当于对于该组件来说，没有新的数据，StreamBuilder 就不会自动更新。
            ignoreChange: (int _) => true,
            builder: (context, callback) {
              return FloatingActionButton(
                onPressed: callback,
                tooltip: 'asdasdasd',
                child: Icon(Icons.add),
              );
            },
          ),
        ),
      ),
    );
  }
}
```

## 多方对比
### 使用方式
BLoC 与 Redux 是类似的，但由于 flutter_bloc 依赖了 provider，同时 flutter_bloc 与 provider 的使用姿势基本一致，所以笔者认为：如果要在 bloc 和 provider 中选一个，provider 是优选。

### 测试
不管是 provider 还是 redux，对测试都是友好的。可以随意选择。

### 更新UI
这几者都是基于 InheritedWidget + 监听实现的。都能做到最小化更新。

### 学习成本
Redux 本身是针对 js 而设计的一种状态容器，后被迁移到 dart 上。redux 需要单独去了解它的概念，以及一些通用的方法，比如中间件的概念、组合 reducers 等。provider 主要就是几种 Provider 和几种 Consumer，学习成本稍低。

## 总结
对比了这几个状态管理方案，对于开发者来说，在使用方式上都大同小异：将数据封装为组件，最小化更新；外层提供数据，里层使用数据。在学习成本上，redux 比 bloc 复杂一些，provider 最简单。可以根据以往的开发经验来选择是使用 redux 还是 provider。

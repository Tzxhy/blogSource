---
layout: d
title: flutter中widget/element/renderObject关系
date: 2019-10-04 12:33:42
tags:
---


这一篇我们讲解 flutter 中三大类：**Widget**、**Element**、**RenderObject** 的关系，及在整个应用中的处理时机。

## 基础讲解
这里先讲解基本的概念，再结合代码运行时来说明**创建流程**及**相互关系**。

<!-- more -->
### Widget
Widget相关的**继承关系**图：
![继承关系](http://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/6e47b330c76a9.png)
由上图可知，Widget 类是其他类的基类。其下主要有4类：
- StatelessWidget: 无状态组件。需要实现 build 方法。不多介绍。
- StatefulWidget: 有状态组件。需要实现 createState 方法。不多介绍。
- ProxyWidget: 代理组件。其下主要是：
    - InheritWidget: 继承组件。主要用于在组件树上寻找对应的基类组件，通常用于共享数据。比如 Theme、DefaultTextStyle 等 Widget，可以在任意层组件**向上寻找**最近的`InheritWidget`基类。
    - ParentDataWidget: 用于自定义关于父组件存储数据到子组件里的逻辑。比如：`Stack` 组件的 children 中可以使用 `Positioned` 组件。其中 `Positioned` 组件就是 `ParentDataWidget` 组件，它实现了 `applyParentData` 方法，用于将该 Widget 的left、right、top、bottom 值写入该 Widget 的 child 对应的 RenderObject 的 parentData 属性中（这句话有点长，你品，你细品）
- RenderObjectWidget: 渲染对象组件。虽然该 RenderObjectWidget 按照继承关系来说，是和上面三类 Widget 同一层级，但用途却不一样。上面三类，前两种都可以理解为很多 Widget 的组合，它不能创建新的原生组件，只能使用现有的组件；ProxyWidget 自身没有类似 build 的方法，只保存了一个 child 属性，当然你还能定义各种数据，这才是它的主要作用：作为代理，可以存储数据给所有后代用。**并且当数据改变时，可以通过某种方式通知所有使用过它数据的后台去更新视图**(针对`InheritWidget`说的)。 该`RenderObjectWidget`组件的作用不一样：它自己创建对应的 `RenderObject` 用于控制渲染！大家可能觉得这个会用的很少，比如大部分的 UI 组件官方都提供了，我们用它干啥呢？是不是对我们没用了？**大错特错啦**，所有的 UI 组件的基类都是 `RenderObjectWidget`！通过该类，我们才能自定义新的 UI 组件（比如官方组件不能满足你的需求，是不是只能自己写一个组件了？虽然通常能使用 StatelessWidget 完成对应的需求，但设计到布局、绘制的，就需要继承该类来自己撸了）。根据子组件的个数，其下分为这么三类：
    - SingleChildRenderObjectWidget: 单儿砸组件。比如：Padding、DecoratedBox、ConstrainedBox等（ __有同学也许会说：Container？__ 不对，Container 的基类是 StatelessWidget，它只是组合了很多其他的组件，比如刚刚才说的几个）。
    - MultiChildRenderObjectWidget: 多 child 组件。比如：`Stack`、`Flex`等。通常关注的是布局。
    - LeafRenderObjectWidget: 没儿砸组件，作为叶节点。无布局方法。比如：_SliderRenderObjectWidget（是`Slider`组件的底层 RenderObjectWidget，该 Widget 对应的 RenderObject `_RenderSlider` 主要关注绘制，即`paint`方法，对 layout 相关不感冒）

下面是`Widget`基类的抽象定义：

![widget](http://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/f08d238b67c21.png)
其实关注点主要就一个，需要实现一个 createElement 方法。同时也保存了一个 `key` 属性，用于替换、复用对应的 `Element`。对于四个子类的细节这里就不细说了（大致可参考上面说的）。关于这四类 `Widget`，后面单独整理几篇文章来说明（**TODO**） 。下面看一下跟这个`Widget`相关的`Element`是什么。

### Element
同样，首先看一下 `Element`的继承关系：
![Element 继承关系](http://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/f26970eda73b9.png)

Element 下就只有两类：
- ComponentElement: 组件元素。这一类`Element`主要是组合其他 Element，或者是提供代理功能，分别与 StatelessWidget/StatefulWidget、ProxyWidget 对应。
- RenderObjectElement: 渲染对象元素。这与`RenderObjectWidget`对应。其下的四个子类，除了`RootRenderObjectElement`外，其余三个，分别与 `LeafRenderObjectWidget`、`SingleChildRenderObjectWidget`、`MultiChildRenderObjectWidget` 对应。

现在我们需要先理清 `Widget` 与 `Element` 的关系，可以通过查看 `Widget` 和 `Element`的相关注释发现：
> /// Describes the configuration for an [Element].
///
/// Widgets are the central class hierarchy in the Flutter framework. A widget
/// is an immutable description of part of a user interface. Widgets can be
/// inflated into elements, which manage the underlying render tree.

大致意思是：`Widget` 是 `Element` 的配置。`Widget` 在flutter 中处于中心位置，一个 Widget 是 UI 的不可变描述（如果可变，则使用 StatefulWidget） ，会被碾平为 `Element`。同时，`Element` 也管理着底层的渲染树（由 RenderObject 构成的渲染树）。

很好理解了，`Widget` 只是配置，它只是用来形成 `Element` 的配置。

根据定义，我们首先简单看一下 ` BuildContext` 定义了什么：
```dart
abstract class BuildContext {
    /// 该 Element 的 Widget 配置
    Widget get widget;
    /// 该 Element 的 BuildOwner（控制元素的渲染）
    BuildOwner get owner;
    /// 该 Element 持有的 RenderObject
    RenderObject findRenderObject();
    /// 该 Element 持有的 RenderObject 的 size
    Size get size;
    /// 注册该 Element 到 ancestor。当 ancestor 改变时，该 Element 也会重建。
    InheritedWidget inheritFromElement(InheritedElement ancestor, { Object aspect });
    /// 获取最近的继承组件
    InheritedWidget inheritFromWidgetOfExactType(Type targetType, { Object aspect });
    /// 获取最近的继承组件对应的 Element
    InheritedElement ancestorInheritedElementForWidgetOfExactType(Type targetType);
    /// 获取最近的指定类型的组件
    Widget ancestorWidgetOfExactType(Type targetType);
    /// 获取最近的指定类型的 State 对象
    State ancestorStateOfType(TypeMatcher matcher);
    /// 获取最远的指定类型的 State 对象
    State rootAncestorStateOfType(TypeMatcher matcher);
    /// 获取最近的指定类型的 RenderObject 对象
    RenderObject ancestorRenderObjectOfType(TypeMatcher matcher);
    /// 向上遍历所有父 element。当到 root 或者 visitor 返回 false 时，停止遍历
    void visitAncestorElements(bool visitor(Element element));
    /// 遍历 children
    void visitChildElements(ElementVisitor visitor);

    DiagnosticsNode describeElement(String name, {DiagnosticsTreeStyle style = DiagnosticsTreeStyle.errorProperty});

    DiagnosticsNode describeWidget(String name, {DiagnosticsTreeStyle style = DiagnosticsTreeStyle.errorProperty});

    List<DiagnosticsNode> describeMissingAncestor({ @required Type expectedAncestorType });

    DiagnosticsNode describeOwnershipChain(String name);
}
```
限于篇幅，去掉了原注释，添加了简短的中文注释。是不是有些方法看着很眼熟？`ancestorWidgetOfExactType`、`inheritFromWidgetOfExactType`等方法，我们都经常在`build`方法中使用吧？是的，因为`Widget.build(BuildContext context)` 中的`context`，指的就是这个 `Widget` 对应的 `Element`，而 `Element` 又实现了 `BuildContext`，那这一切就理所当然了。对于`Widget`的上层组件，由于都比较简单，这里就不细说了，大家可以看看源码。

看一下 `Element` ？
```dart
abstract class Element extends DiagnosticableTree implements BuildContext {
    /// 使用 widget 创建一个 element
    /// 通常由[Widget.createElement]调用
    Element(Widget widget)
    : assert(widget != null),
      _widget = widget;
    /// 父元素
    Element _parent;

    @override
    bool operator ==(Object other) => identical(this, other);

    /// 父元素设置 child 如何在 child list 中适应
    dynamic get slot => _slot;
    dynamic _slot;

    /// 元素的深度
    int get depth => _depth;
    int _depth;

    /// 按深度和赃值排序
    static int _sort(Element a, Element b) {}

    /// 该 element 的 widget
    @override
    Widget get widget => _widget;
    Widget _widget;

    /// BuildOwner
    @override
    BuildOwner get owner => _owner;
    BuildOwner _owner;

    /// 该元素状态。当 mount/activate 时为true，当deactive 时为 false
    bool _active = false;

    /// 开发时热重载。release 下不可用。
    void reassemble() {}

    /// 返回 element 的 renderObject
    RenderObject get renderObject {}

    void visitChildren(ElementVisitor visitor) { }

    /// 通过新的 widget 来更新指定的 chld element.
    /// 这是非常重要的一个方法。
    Element updateChild(Element child, Widget newWidget, dynamic newSlot) {}

    /// 挂载元素。设置 _parent _slot _depth _active等属性
    /// 同时设置 继承组件
    void mount(Element parent, dynamic newSlot) {}

    /// 更新 widget
    void update(covariant Widget newWidget) {}

    /// 改变 children 中各个 child 的 slot。通常是 child 在 children 列表中改变顺序后调用。
    void updateSlotForChild(Element child, dynamic newSlot) {}

    /// 分离 RenderObject （这里是置 _slot 为 null）
    void detachRenderObject() {}

    /// 添加到 RenderObject 树（这里是置_slot 为 newSlot）
    void attachRenderObject(dynamic newSlot) {}

    /// 将 newWidget 碾平为一个 Element
    Element inflateWidget(Widget newWidget, dynamic newSlot) {}

    /// 将指定的 child 移入非活跃 对象列表，并且分离它的 renderObject
    void deactivateChild(Element child) {}

    /// 移除 child
    void forgetChild(Element child);

    /// 从 非活跃 到 活跃
    void activate() {}

    /// 与上相反
    void deactivate() {}

    /// 从 非活跃 到 失效 状态
    void unmount() {}

    RenderObject findRenderObject() => renderObject;

    Size get size {};

    Map<Type, InheritedElement> _inheritedWidgets;
    Set<InheritedElement> _dependencies;
    bool _hadUnsatisfiedDependencies = false;

    InheritedWidget inheritFromElement(InheritedElement ancestor, { Object aspect }) {}

    InheritedWidget inheritFromWidgetOfExactType(Type targetType, { Object aspect }) {}

    InheritedElement ancestorInheritedElementForWidgetOfExactType(Type targetType) {}

    void _updateInheritance() {
        _inheritedWidgets = _parent?._inheritedWidgets;
    }

    Widget ancestorWidgetOfExactType(Type targetType) {}

    State ancestorStateOfType(TypeMatcher matcher) {}

    State rootAncestorStateOfType(TypeMatcher matcher) {}

    RenderObject ancestorRenderObjectOfType(TypeMatcher matcher) {}

    void visitAncestorElements(bool visitor(Element element)) {}

    /// 当该 element 的依赖改变时会调用。
    void didChangeDependencies() {}

    bool get dirty => _dirty;
    bool _dirty = true;

    bool _inDirtyList = false;
    
    /// 设置 _dirty，安排上 build
    void markNeedsBuild() {
        _dirty = true;
        owner.scheduleBuildFor(this);
    }

    /// 重建。就只是调用 performRebuild()
    void rebuild() {}

    void performRebuild();

}
```
很长的 API，但主要是处理_slot/_active/_dirty/_parent等。现在还比较乱，等结合上层 api 时再细看。

看一下常用到的`StatelessElement`:
```dart
class StatelessElement extends ComponentElement {

    StatelessElement(StatelessWidget widget) : super(widget);
    
    @override
    StatelessWidget get widget => super.widget;

    @override
    Widget build() => widget.build(this);
    
    @override
    void update(StatelessWidget newWidget) {}
}
```
简单地重写了几个方法。`StatefulWidget`呢：
```dart
class StatefulElement extends ComponentElement {

    StatefulElement(StatefulWidget widget)
      : _state = widget.createState(),
        super(widget) {
            _state._element = this;
            _state._widget = widget;
        }
    
    @override
    Widget build() => state.build(this);

    State<StatefulWidget> get state => _state;
    State<StatefulWidget> _state;

    void reassemble() {}

    void update(StatefulWidget newWidget) {}

    void activate() {}

    void deactivate() {}

    void unmount() {}

    InheritedWidget inheritFromElement(Element ancestor, { Object aspect }) {}

    void didChangeDependencies() {}
}
```

其他`Element`先不看了，继续看`RenderObject`。

`RenderObject`是何时创建的呢？首先我们需要知道的是，虽然对于用户来说，编写的基本都是`Widget`，但对于框架来说，三者建立连接的地方是`Element`。何以见得呢？因为细看上面的 `Element`简版，发现它持有了 `_widget` 和 `_renderObject`。在`Element.update`方法中，更新了`_widget`；在 `RenderObjectElement.mount`方法中，更新 `_renderObject`。好，接下来简单看一下 `RenderObject` 是做什么的。
```dart
/// 渲染树中的一个对象。

abstract class RenderObject extends AbstractNode with DiagnosticableTreeMixin implements HitTestTarget {

    /// 开发时用。重建当前 renderObject
    void reassemble() {}

    // LAYOUT相关
    /// 父 renderObject 需要使用的数据。比如 Flex 下的 child
    ParentData parentData;

    /// 设置 parentData
    void setupParentData(covariant RenderObject child) {}

    /// 当 child list 改变时调用
    void adoptChild(RenderObject child) {}

    /// 丢弃一个 child
    void dropChild(RenderObject child) {}

    /// 遍历
    void visitChildren(RenderObjectVisitor visitor) { }

    /// owner
    PipelineOwner get owner => super.owner;

    /// 设置 _owner 调用 need* 方法
    void attach(PipelineOwner owner) {}

    bool _needsLayout = true;

    /// 重排边界对象
    RenderObject _relayoutBoundary;
    bool _doingThisLayoutWithCallback = false;

    /// 父 renderObject 传入的限制
    Constraints get constraints => _constraints;
    Constraints _constraints;

    /// 标记为脏。owner._nodesNeedingLayout.add(this);
    /// owner.requestVisualUpdate();
    void markNeedsLayout() {}
    void markParentNeedsLayout() {}

    /// 同时调用上面两个
    void markNeedsLayoutForSizedByParentChange() {}

    /// 安排首次布局
    /// owner._nodesNeedingLayout.add(this);
    void scheduleInitialLayout() {}

    /// 为当前 renderObject 布局。
    void layout(Constraints constraints, { bool parentUsesSize = false }) {}

    /// 约束条件是否是大小调整算法的唯一输入
    bool get sizedByParent => false;

    /// 使用限制来计算 size。
    /// 不需要直接调用。调用 layout。
    void performResize();

    /// 布局。不直接调用。调用 layout。
    void performLayout();

    // PAINTING
    /// 是否是绘制边界
    bool get isRepaintBoundary => false;

    bool get alwaysNeedsCompositing => false;

    ContainerLayer get layer {}

    set layer(ContainerLayer newLayer) {}
    ContainerLayer _layer;

    bool _needsCompositingBitsUpdate = false;

    void markNeedsCompositingBitsUpdate() {}

    bool _needsCompositing;
    bool get needsCompositing {}
    
    bool _needsPaint = true;
    
    void markNeedsPaint() {}
    
    void scheduleInitialPaint(ContainerLayer rootLayer) {}

    void replaceRootLayer(OffsetLayer rootLayer) {}

    Rect get paintBounds;

    void paint(PaintingContext context, Offset offset) {}

    void applyPaintTransform(covariant RenderObject child, Matrix4 transform) {}

    Matrix4 getTransformTo(RenderObject ancestor) {}

    // EVENTS
    void handleEvent(PointerEvent event, covariant HitTestEntry entry) {}

    // HIT TESTING
    bool hitTest(HitTestResult result, { Offset position }) {}
}
```
来看一下`RenderObject`的继承关系：
![RenderObject 继承关系](https://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/7ae36de4a872c.png)

由此我们知道所有的实体 `RenderObject`都是`RenderBox`类型。来看一下 `RenderBox` 是做了什么：
```dart
abstract class RenderBox extends RenderObject {

    void setupParentData(covariant RenderObject child) {}

    double getMinIntrinsicWidth(double height) {}

    double computeMinIntrinsicWidth(double height) {}

    bool get hasSize => _size != null;

    Size get size {}
    Size _size;

    set size(Size value) {}

    double getDistanceToActualBaseline(TextBaseline baseline) {}

    double getDistanceToBaseline(TextBaseline baseline, { bool onlyReal = false }) {}

    double computeDistanceToActualBaseline(TextBaseline baseline) {}

    BoxConstraints get constraints => super.constraints;

    void markNeedsLayout() {}
    
    void performResize() {}

    void performLayout() {}

    bool hitTest(BoxHitTestResult result, { @required Offset position }) {}

    bool hitTestSelf(Offset position) => false;

    bool hitTestChildren(BoxHitTestResult result, { Offset position }) => false;

    void applyPaintTransform(RenderObject child, Matrix4 transform) {}

    Offset globalToLocal(Offset point, { RenderObject ancestor }) {}

    Offset localToGlobal(Offset point, { RenderObject ancestor }) {}

    Rect get paintBounds => Offset.zero & size;

    void handleEvent(PointerEvent event, BoxHitTestEntry entry) {}
}
```

看完这三大基础后，可能仍然一头雾水？我们直接看看构建流程，这样最清晰了。

在上篇中，说到：
```dart
void attachRootWidget(Widget rootWidget) {
    _renderViewElement = RenderObjectToWidgetAdapter<RenderBox>(
      container: renderView,
      debugShortDescription: '[root]',
      child: rootWidget,
    ).attachToRenderTree(buildOwner, renderViewElement);
}
```
这里调用了`attachToRenderTree`这个方法：
```dart
RenderObjectToWidgetElement<T> attachToRenderTree(
    BuildOwner owner,
    [ RenderObjectToWidgetElement<T> element ]
) {
    if (element == null) {
        owner.lockState(() {
            element = createElement();
            assert(element != null);
            element.assignOwner(owner);
        });
        owner.buildScope(element, () {
            element.mount(null, null);
        });
    } else {
        element._newWidget = this;
        element.markNeedsBuild();
    }
    return element;
}
```
当首次mount时（即 element 为 null）， 这时先通过 `createElement` 创建一个 element，该 element 作为顶层 element。然后通过 buildScope 方法（构建一个壳，防止潜在的无限循环），传入一个 `element.mount(null, null);` 作为 callback。然后对所有 dirtyElement 进行 `rebuild` 操作。直接看代码：
```dart
  /// RenderObjectToWidgetElement
  @override
  void mount(Element parent, dynamic newSlot) {
    super.mount(parent, newSlot);
    _rebuild();
  }
```
根据继承关系，向上调用了一连串的 `mount` 方法。主要操作有，在 `RenderObjectElement`层：
```dart
  /// RenderObjectElement
  void mount(Element parent, dynamic newSlot) {
    super.mount(parent, newSlot);
    _renderObject = widget.createRenderObject(this);
    attachRenderObject(newSlot);
    _dirty = false;
  }
```
这里会创建对应的`RenderObject`，并且 attach 对应的 slot（attachRenderObject里会有代理组件处理 RenderObject 的逻辑，这个后面单独说）。上面说`Widget`分类时，说到了 `RenderObjectWidget`(就是其下有单儿子、多儿子、叶节点的那个)。这里的 `widget` 就是 `RenderObjectWidget`类型。
在根`Element`层，到达了 `mount`方法的终点，这里上面说过了，就是设置一些内部值，比如_parent/_slot 等，以及标志依赖组件。到此结束了 `mount`。回到 `RenderObjectToWidgetElement._rebuild`方法。

在 `_rebuild`中，只是调用了：
```dart
_child = updateChild(_child, widget.child, _rootChildSlot);
```
到了 `Element.updateChild`方法了：
```dart
  Element updateChild(Element child, Widget newWidget, dynamic newSlot) {
    if (newWidget == null) {
      if (child != null)
        deactivateChild(child);
      return null;
    }
    if (child != null) {
      if (child.widget == newWidget) {
        if (child.slot != newSlot)
          updateSlotForChild(child, newSlot);
        return child;
      }
      if (Widget.canUpdate(child.widget, newWidget)) {
        if (child.slot != newSlot)
          updateSlotForChild(child, newSlot);
        child.update(newWidget);
        return child;
      }
      deactivateChild(child);
    }
    return inflateWidget(newWidget, newSlot);
  }
```
其实先说一下官方注释，便于理解：
> 该方法是组件系统的核心。它会在我们要去增加、更新、删除一个widget时调用。
如果 `child` 为空，`newWidget` 不为空，就创建一个以 `newWidget` 作为配置的新的 `Element`；
如果 `newWidget` 为空，`child` 不为空，就移除 `child`；
如果都不为空，如果通过了 `Widget.canUpdate`，则用 `newWidget` 去更新 `child`，否则移除`child`，并创建一个新的 `Element`；
都为空，则什么都不做。

先简单看一下，移除、更新、创建的逻辑：
```dart
  /// 移除
  @protected
  void deactivateChild(Element child) {
    child._parent = null;
    child.detachRenderObject();
    owner._inactiveElements.add(child); // 关键点
  }

  /// 更新
  @protected
  void updateSlotForChild(Element child, dynamic newSlot) {
    void visit(Element element) {
      element._updateSlot(newSlot);
      if (element is! RenderObjectElement)
        element.visitChildren(visit);
    }
    visit(child);
  }
  @mustCallSuper
  void update(covariant Widget newWidget) {
    _widget = newWidget;
  }

  /// 创建
  @protected
  Element inflateWidget(Widget newWidget, dynamic newSlot) {
    final Key key = newWidget.key;
    // 如果是使用的 GlobalKey
    if (key is GlobalKey) {
      final Element newChild = _retakeInactiveElement(key, newWidget);
      if (newChild != null) {
        newChild._activateWithParent(this, newSlot);
        final Element updatedChild = updateChild(newChild, newWidget, newSlot);
        return updatedChild;
      }
    }
    // 如果是新的 GLobalKey 或者没使用 GlobalKey，调用 `Widget.createElement`
    final Element newChild = newWidget.createElement();
    // 递归地 `mount`
    newChild.mount(this, newSlot);
    return newChild;
  }
```
精妙之处就在 `inflateWidget`中的这个 `mount`，它递归调用了所有 widget 对应的 element 的 `mount`，由此生成一颗 `Element`树。最终返回了顶层元素，赋给 `_renderViewElement`。至此，`attachRootWidget` 方法就返回了。下一步是安排渲染，即：`scheduleWarmUpFrame`。这一块是某一篇文章说过的。

```dart
  void scheduleWarmUpFrame() {
    if (_warmUpFrame || schedulerPhase != SchedulerPhase.idle)
      return;

    _warmUpFrame = true;
    final bool hadScheduledFrame = _hasScheduledFrame;
    Timer.run(() {
      // 执行绘制前的准备工作。同时执行所有临时回调(由[scheduleFrameCallback]注册)
      handleBeginFrame(null);
    });
    Timer.run(() {
      // 在调用 [handleBeginFrame] 后立即调用。执行所有由 [addPersistentFrameCallback]
      // 添加的回调，比如布局、绘制、合成等持久回调，之后调用所有由[addPostFrameCallback]添加
      // 的回调。
      handleDrawFrame();
      resetEpoch();
      _warmUpFrame = false;
      if (hadScheduledFrame)
        scheduleFrame();
    });
  }
```
通过全局查找 [addPersistentFrameCallback]，定位到它的回调为：
```dart
  void drawFrame() {
    pipelineOwner.flushLayout();
    pipelineOwner.flushCompositingBits();
    pipelineOwner.flushPaint();
    renderView.compositeFrame(); // this sends the bits to the GPU
    pipelineOwner.flushSemantics(); // this also sends the semantics to the OS.
  }
```
即一次屏幕刷新的全流程：
1. 布局
2. 更新合成位
3. 绘制
4. 合成帧
5. 语意化

简单先看一下布局的：
```dart
/// Update the layout information for all dirty render objects.
  ///
  /// This function is one of the core stages of the rendering pipeline. Layout
  /// information is cleaned prior to painting so that render objects will
  /// appear on screen in their up-to-date locations.
  ///
  /// See [RendererBinding] for an example of how this function is used.
  void flushLayout() {
    if (!kReleaseMode) {
      Timeline.startSync('Layout', arguments: timelineWhitelistArguments);
    }
    try {
      while (_nodesNeedingLayout.isNotEmpty) {
        final List<RenderObject> dirtyNodes = _nodesNeedingLayout;
        _nodesNeedingLayout = <RenderObject>[];
        for (RenderObject node in dirtyNodes..sort((RenderObject a, RenderObject b) => a.depth - b.depth)) {
          if (node._needsLayout && node.owner == this)
            node._layoutWithoutResize();
        }
      }
    } finally {
      if (!kReleaseMode) {
        Timeline.finishSync();
      }
    }
  }
```
就是遍历 `_nodesNeedingLayout`。那么这些脏节点什么时候加上的呢？我翻看了之前 `RenderObjectToWidgetElement.mount` 方法，也只是构建 `Element`树，并没有任何设置脏节点的逻辑。那么这个逻辑是在哪加的呢？答案是在`RendererBinding` 的 `initInstances` 方法里，调用了 `initRenderView`。
```dart
  // RendererBinding
  void initRenderView() {
    // 生成
    renderView = RenderView(configuration: createViewConfiguration(), window: window);
    renderView.scheduleInitialFrame();
  }

  // RenderView
  void scheduleInitialFrame() {
    scheduleInitialLayout(); // 这里添加了根 RenderObject 节点哦
    // 添加需要绘制的根节点
    scheduleInitialPaint(_updateMatricesAndCreateNewRootLayer()); 
    owner.requestVisualUpdate(); // 请求刷新页面
  }

  // RenderObject
  void scheduleInitialLayout() {
    _relayoutBoundary = this;
    owner._nodesNeedingLayout.add(this); // 这里添加了根 RenderObject 节点哦
  }

  // RenderObject
  void scheduleInitialPaint(ContainerLayer rootLayer) {
    _layer = rootLayer;
    owner._nodesNeedingPaint.add(this); // 添加需要绘制的根节点
  }
```
可以看到在初始化 FlutterBinding 的时候，就将根 RenderObject 放入脏节点了，所以后面第一次更新肯定是包含该脏节点的。

但有一个问题（尚未验证）：这里 `initInstances` 方法中就请求了更新视图，为什么还需要调用 `scheduleWarmUpFrame` 来触发更新呢？是不是首次渲染多了一次？？这里记个 TODO

继续看布局：
```dart
  // RenderObject
  void _layoutWithoutResize() {
    RenderObject debugPreviousActiveLayout;
    try {
      performLayout();
      markNeedsSemanticsUpdate();
    } catch (e, stack) {
      _debugReportException('performLayout', e, stack);
    }
    _needsLayout = false;
    markNeedsPaint();
  }
```
关键点是 `performLayout` 和 `markNeedsPaint`。下层 RenderBox 也没有实现 `performLayout`，我们随便找一个单儿子的RenderObject 来看一下。
```dart
/// RenderLimitedBox
  @override
  void performLayout() {
    if (child != null) {
      // 布局儿子
      child.layout(_limitConstraints(constraints), parentUsesSize: true);
      size = constraints.constrain(child.size);
    } else {
      size = _limitConstraints(constraints).constrain(Size.zero);
    }
  }
```
是不是有点奇怪，为什么要给儿子布局，而不是给自己布局？这就需要了解 flutter 布局这一层的东西了。flutter 中布局相关的东西，主要是 parentData.offset，size。每个 RenderObject 有自己的 `parentData`。看名字也好理解：爸爸的数据。所以它是父 RenderObject 给儿子设置的数据。那么通常需要设置哪些数据呢？`offset`就是其中之一，它代表儿子在爸爸这里的偏移（水平和垂直方向）。每一个 RenderObject 还有一个 size 属性，表示自己这个渲染对象占据的屏幕尺寸。由上面的代码，可得：先把儿子布好局，安排好（儿子又会递归地给儿子的儿子布局..）后，就知道儿子的大小了。一般场景下，爸爸会和儿子的大小相关，比如上面的把爸爸的大小设置为与儿子大小成限制关系。我理解的布局就是递归地设置`offset`和`size`，这也正好符合 `RenderBox` 的名称：所有渲染对象都是盒子，盒子不就是一层嵌套一层，A 盒子大小多少，B 盒子大小多少，B 盒子的儿子 B1盒子大小、相对于 B 盒子的偏移...渲染对象仅包含布局相关相关（当然，也能绘制，比如背景色、自定义图形等），更多的数据还是保存在 `Element`中。毕竟 `Element`是沟通 `Widget` 和 `RenderObject`的桥梁。
```dart
  // RenderObject
  void markNeedsPaint() {
    if (_needsPaint)
      return;
    _needsPaint = true;
    // 重绘边界的话，不用更新 parent
    if (isRepaintBoundary) {
      // If we always have our own layer, then we can just repaint
      // ourselves without involving any other nodes.
      if (owner != null) {
        owner._nodesNeedingPaint.add(this);
        owner.requestVisualUpdate();
      }
    } else if (parent is RenderObject) { // 非重绘边界，更新爸爸
      final RenderObject parent = this.parent;
      parent.markNeedsPaint();
    } else {
      // If we're the root of the render tree (probably a RenderView),
      // then we have to paint ourselves, since nobody else can paint
      // us. We don't add ourselves to _nodesNeedingPaint in this
      // case, because the root is always told to paint regardless.
      if (owner != null)
        owner.requestVisualUpdate();
    }
  }
```
很明显，不管是 markNeedsLayout 还是 paint，都需要给 owner 对应的队列添加当前元素。还有一个主要的操作是生成合成层：
```dart
void compositeFrame() {
    try {
      final ui.SceneBuilder builder = ui.SceneBuilder();
      final ui.Scene scene = layer.buildScene(builder);
      if (automaticSystemUiAdjustment)
        _updateSystemChrome();
      _window.render(scene);
      scene.dispose();
    } finally {
      Timeline.finishSync();
    }
  }
```
至此，数据就呈现到屏幕上了。

## 结束
大致讲解了`Widget`/`Element`/`RenderObject`的关系和作用。
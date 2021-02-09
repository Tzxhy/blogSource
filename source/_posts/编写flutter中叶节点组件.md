---
title: 编写flutter中叶节点组件
tags:
- flutter
- 叶节点
categories: flutter
date: 2019-09-18 20:30:11
---


# 第n篇
这里假设读者已经看完了前面几篇，或者本身对 flutter 的设计、框架等比较熟悉。如果不熟悉，可以先看看前几篇文章。

进入正题……

本篇主要讲解 flutter 中，如何实现一个叶节点（没有任何子节点的节点）。flutter 代码结构本篇先不讲，下一篇会从顶层讲解到底层，方便大家学习（后续会调整文章顺序）。

# 节点分类
虽然不说 flutter 中的各种继承关系（这真的是 OOP 编程，通框架各种继承~），但这里会简单提一下 flutter 中组件的基本分类：
- 单 child 组件。及该组件有且只有一个 child。以 **SingleChildRenderObjectWidget** 为底层抽象类。需要子类实现：
    - createRenderObject(BuildContext context) 创建一个 RenderObject
    - updateRenderObject(BuildContext context, RenderObject renderObject) 更新旧的 RenderObject
    - didUnmountRenderObject 可选，当与该 Widget 关联的 RenderObject 从树中移除时的回调
- 多 child 组件。以 **MultiChildRenderObjectWidget** 为底层抽象类。同样需要子类实现上述函数。
- 无 child 组件。以 **LeafRenderObjectWidget** 为底层抽象类。同样需要子类实现上述函数。

其实从上面来看，都需要实现 createRenderObject 方法。换而言之，即是要实现对应的 RenderObject 类。今天我们就以叶节点组件来实现一个自定义渲染组件。
<!-- more -->
# 前置概念
既然是叶节点（无子组件），那么理所应当的不需要 layout 的相关操作（整体流程介绍放在下一篇文章）。我们只需要操作相关 paint 的方法，即绘制。

# 进入场景
这里假设我们要实现一个类似 flutter 原生 RangeSlider 组件（当时我们公司用的 flutter 分支是1.5.4的，还没有这个 RangeSlider 组件，直接拷贝不太好，索性学习着手写一个）TODO(补充图片)。开始动手吧。
# Main
## 外层
这里省去了外层的 StatefulWidget -> State 的包裹，直接开始最关键的内容。
```dart
class _SliderRenderObjectWidget extends LeafRenderObjectWidget {
  @override
  _RenderSlider createRenderObject(BuildContext context) {
    // 返回一个 RenderObject
    return _RenderSlider(
      divisions: divisions,
      rangeValue: startRange,
    );
  }

  @override
  void updateRenderObject(BuildContext context, _RenderSlider renderObject) {
    // 更新一个 RenderObject
    renderObject
      ..rangeValue = startRange
      ..divisions = divisions;
  }
}
```
createRenderObject 调用实际（TODO）

## RenderObject 类实现
```dart
class _RenderSlider extends RenderBox {
  _RenderSlider({
    @required BdRangeSliderValue rangeValue,
    
  }) {
    final GestureArenaTeam team = GestureArenaTeam();
    // 定义一个 darg 手势识别器
    _drag = HorizontalDragGestureRecognizer()
      ..team = team
      ..onStart = _handleDragStart
      ..onUpdate = _handleDragUpdate
      ..onEnd = _handleDragEnd
      ..onCancel = _endInteraction;
  }

  // 在 attach 的时候，增加动画的回调  
  @override
  void attach(PipelineOwner owner) {
    super.attach(owner);
    _overlayAnimation.addListener(markNeedsPaint);
  }
  // 在 detach 的时候，去掉动画的回调
  @override
  void detach() {
    _overlayAnimation.removeListener(markNeedsPaint);
    super.detach();
  }

  @override
  bool hitTestSelf(Offset position) => true;

  // 处理事件。叶节点组件中，如果是交互型的，一般会重写该方法。否则不能识别任何操作。
  @override
  void handleEvent(PointerEvent event, BoxHitTestEntry entry) {
    assert(debugHandleEvent(event, entry));
    if (event is PointerDownEvent && isInteractive) {
      // We need to add the drag first so that it has priority.
      _drag.addPointer(event);
      _tap.addPointer(event);
    }
  }

  @override
  double computeMinIntrinsicWidth(double height) => _minPreferredTrackWidth + _maxSliderPartWidth;

  @override
  double computeMaxIntrinsicWidth(double height) => _minPreferredTrackWidth + _maxSliderPartWidth;

  @override
  double computeMinIntrinsicHeight(double width) => max(_minPreferredTrackHeight, _maxSliderPartHeight);

  @override
  double computeMaxIntrinsicHeight(double width) => max(_minPreferredTrackHeight, _maxSliderPartHeight);
  
  @override
  bool get sizedByParent => true;
  // 当 sizedByParent 为 true 时，必须重写 performResize 方法，返回该组件占据的大小
  @override
  void performResize() {
    size = Size(
      constraints.hasBoundedWidth ? constraints.maxWidth : _minPreferredTrackWidth + _maxSliderPartWidth,
      constraints.hasBoundedHeight ? constraints.maxHeight : max(_minPreferredTrackHeight, _maxSliderPartHeight),
    );
  }
  // 关键方法。在此使用 canvas 绘制图形。
  @override
  void paint(PaintingContext context, Offset offset) {
    // ……
  }
}
```

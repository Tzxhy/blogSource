---
title: ios踩坑笔记
date: 2019-06-03 13:27:05
tags: ios
---

# 滚动嵌套
```css
-webkit-overflow-scrolling: touch;
```
这个属性专用于ios开启滚动回弹及持续滚动效果（安卓自带）。
当存在嵌套的滚动时，需要给每个 div 都加上这个属性，否则内部的滚动结束后无法传递到外部滚动容器。

# 在滚动的时候动态设置滚动容器的 overflow
注意，如果在滚动的时候去动态设置滚动容器的 overflow，会导致强烈的抖动。因此，应该在滚动结束后再动态设置 overflow 属性。

# 对 img 设置 filter: blur
ios 上时常出现渲染失败，表现为图片呲了。解决方法：添加 transform: translateZ(0); 强行交由 GPU 处理。

# 路由过渡时动画与 ios 边缘操作装车
IOS 边缘操作，了解一下，比如：屏幕左侧右滑，返回上一页；右侧左滑，前进一页。
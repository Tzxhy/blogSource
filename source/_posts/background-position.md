---
title: background-position
date: 2019-03-04 18:43:43
tags:
- css
- background
categories: CSS
---

# 关于background-position
以前吧，一直觉得这个具体值和百分比值的作用是一样的。其实是不一样的。画几个图来说明。
[关于background-position](/images/p1-position.png)
意思即是：具体值（如10px 0）是指背景到容器左边缘（没考虑其他文档流的影响）的距离。为正是在左边缘的右边，反之。

百分比是指背景的百分比值处与容器的百分比值处对齐（正值的时候）。负值的时候，使用下面的公式计算（正值也可以计算）：
```txt
(容器宽度 - 背景宽度) * 百分比X = 像素值X
(容器高度 - 背景高度) * 百分比Y = 像素值Y
这里得到的X 和 Y就是背景的起始位置。正代表在容器左边缘的右边，反之。
```
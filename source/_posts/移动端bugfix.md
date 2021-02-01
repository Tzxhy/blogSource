---
title: 移动端bugfix
date: 2019-03-04 18:56:22
tags:
categories:
---
# 移动端bugfix
1. 子元素滚动到顶、底后，父元素继续滚。这通常不是我们期望的结果。怎么让子元素滚到顶/底了后，父元素不参乎呢？overscroll-behavior  这个c3属性是个好东西。https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior  这里我只简单说说属性值contain和none的区别（默认值是auto，相信你要用这个属性，你就不会用这个属性值）：contain保留了默认的scroll overflow效果，比如chrome浏览器中在页面顶部继续下拉（貌似只有body元素上）会出现bounce效果（同样，对于body元素上，下拉刷新功能也被禁止），同时取消了默认的滚动链（就是儿子滚完了，爸爸继续滚）；none的话，就是取消bounce效果和下拉刷新，并且禁止滚动链。讲道理，我认为他们的差别只会体现在对body元素应用该值。其他情况下contain=none. （我理解的前提下是body元素是页面下拉刷新的触发元素，至少chrome是的）。

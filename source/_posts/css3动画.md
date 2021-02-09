---
title: css3动画
date: 2019-03-04 15:57:24
tags:
- css3
- animation
categories: CSS
---

# css3动画
首先要说的是animation-timing-function。这个东西经常被放在定义animation的类中，如：

```css
.bar {
    width: 0;
    height: 256px;
    margin: 0 auto;
    background-color: red;
    position: relative;
    animation: bar 5s infinite steps(1, end);
}
```
根据MDN:
> Timing functions may be specified on individual keyframes in a @keyframes rule. If no animation-timing-function is specified on a keyframe, the corresponding value of animation-timing-function from the element to which the animation is applied is used for that keyframe.  https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function

就是说这个东西本来应该是定义在单独的帧中的，表示这个帧开始到下一个帧开始这段时间的时间函数。如果帧中没定义这个timing-function，那么就会用类中定义animation时候的函数，如上面就是steps(1, end)。只能说，咱们中国人翻译外文时，都不仔细啊，搞得自己在中文各大网站上都没看到过在帧中使用时间函数的例子。直到看到了Animate.css(https://github.com/daneden/animate.css/blob/master/animate.css)。 今天说一下css3的animate吧。这两天的学习还是小有所得。将根据几个例子来讲解。准备把animation的东西都讲一遍哈。
<!-- more -->

 属性 | 作用 
 :----: | ---- 
 animation-name | 指定一个@keyframes name作为动画的全部帧。 
 animation-duration | 动画周期。单位可以指定为s或者ms。 
 animation-delay | 动画开始之前的延时。单位同上。 
 animation-iteration-count | 动画的播放次数。可以是具体数值或者infinite（表示无限循环）
 animation-direction | 播放顺序。默认normal，就是正向播放。其他值为：reverse（倒序播放），alternate（先正向播放，再倒着播放），alternate-reverse（先倒序播放，再正向播放）
 animation-fill-mode | 这个是用在设置了animation-delay的动画上，因为有延时，所以延时这段时间元素的样式是啥样呢？默认none（啥都没有）。其他值：forwards（元素保留最后一帧的样式），backwards（元素保留第一帧的样式），both（都保留。）
 animation-play-state | 这个留给JS来控制动画的暂停、播放。 
 animation-timing-function | 这个牛逼了，最后讲。用于设置每一帧之间的时间函数。

## 画重点
在每一帧中，可能没有上一帧用到的属性。这个时候会怎么运行动画呢？
```css
@keyframes identifier {
  0% { top: 0; left: 0; }
  30% { top: 50px; }
  68%, 72% { left: 50px; }
  100% { top: 200px; left: 100%; }
}
```
如上面代码，在30%的时候，没有用到left。是不是会猜想30%时间点用的是left：0呀？不对！left属性在30%中没有，但是在68%有left: 50px，于是乎在动画的0%到68%，left值会根据timing-function从0变化到50px（根据时间函数来指定动画的"节奏"）。同理，68%到100%时，top会从一个大于50px小于200px的值开始，变化到200px，left从50px变化到100%。

### animation-fill-mode示例
这个如同定义上说的一样。backwards表示在延时这段时间内使用第一帧的样式。forwards是使用最后一帧的样式（比如这个元素的位置改变了，使用了这个forwards属性值，并且动画不是无限次，那么动画结束后，元素会留在动画结束的地方。神奇吧。）。

注意直接写animation: attr1 attr2...的时候，第一个时间是duration，第二个时间是delay，默认的时间函数是ease，就是先慢后快最后慢。

### 时间函数
这很NB。贴个地址，可以自己把玩各种时间函数。http://cubic-bezier.com/ 。cubic-bezier只是animation-timing-function的一个值。表示每一帧开始到下一帧开始这段时间内的时间函数。

### steps
这个是时间函数的一个其他值。表示一步一步来。跟cubic-bezier的时间函数不一样，它是不连续的、片段的。现在讲一下这个steps函数。也比较难懂，我当时也看了好一阵子才领悟。

steps函数是将两个帧之间的画面按段数分割开，比如steps(2, start)，表示将每两个帧之间的时间段分为2个，并且动画的切换点在第一段的结束。具体可看下图：
[css3](/images/css3-1.png)
start和end都是反的，使用起来一定要注意。正因为如此，看似导致少了一帧。我的做法是将0%和100%的样式设成相同的，这样不管是start还是end，都不会丢帧。

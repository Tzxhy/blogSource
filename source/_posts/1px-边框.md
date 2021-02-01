---
title: 1px 边框
date: 2019-12-11 22:25:48
tags:
categories:
---

本文整理了常用的1物理像素边框的实现方法及原理。

### border-image
关于 border-image 的介绍不多说，可自行参考相关文档。
原理是：将 border-width 设为1px，在2倍屏上使用一个上面透明、下面一个黑色的像素格图片（整体是宽1x高2），相当于垂直方向是2个物理像素。用2物理像素去填满1px的独立像素，自然而然黑色的像素格就占一个物理像素了。3倍屏同理。
```css
.one-pix-border {
    border-width: 1px;
    border-image: url("https://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/border.png") 50% 10% 0 10% stretch;
}
```
缺点：**需要制作图片**，类似于安卓中的九点图。颜色不能在代码中自定义。
优点：可实现圆角，border-image 的兼容性还不错。
<!-- more -->
### background-image
背景这个，同样可以使用图片来做，但用渐变来做，更简单。如二倍屏下：
```css
    .border {
        background-image: linear-gradient(180deg, red, red 50%, transparent 50%),
        linear-gradient(270deg, red, red 50%, transparent 50%),
        linear-gradient(0deg, red, red 50%, transparent 50%),
        linear-gradient(90deg, red, red 50%, transparent 50%);
        background-size: 100% 1px,1px 100% ,100% 1px, 1px 100%;
        background-repeat: no-repeat;
        background-position: top, right top,  bottom, left top;
        padding: 10px;
    }
```

### viewport+rem实现
用页面的 devicePixelRadio 设置meta 中的 viewport：
```html
<html>
    <head>
        <title>1px question</title>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <meta name="viewport" id="WebViewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
        <style>
            html {
                font-size: 1px;
            }           
            * {
                padding: 0;
                margin: 0;
            }
            .bds_b {
                border-bottom: 1px solid #ccc;
            }
            .a,
            .b {
                margin-top: 1rem;
                padding: 1rem;
                font-size: 1.4rem;
            }
            .a {
                width: 30rem;
            }
            .b {
                background: #f5f5f5;
                width: 20rem;
            }
        </style>
        <script>
            var viewport = document.querySelector("meta[name=viewport]");
            //下面是根据设备像素设置viewport
            var scale = 1 / window.devicePixelRadio;
            viewport.setAttribute('content', `width=device-width,initial-scale==${scale},maximum-scale=${scale},minimum-scale=${scale}, user-scalable=no`);
            var docEl = document.documentElement;
            var fontsize = 10 * (docEl.clientWidth / 320) + 'px';
            docEl.style.fontSize = fontsize;
        </script>
    </head>
    <body>
        <div class="bds_b a">下面的底边宽度是虚拟1像素的</div>
        <div class="b">上面的边框宽度是虚拟1像素的</div>
    </body>

</html>
```

### box-shadow
```css
.border {
    box-shadow:0 1px 1px -1px rgba(0, 0, 0, 0.5);
}
```

### transform: scale
这个是我认为最优的方案了。
```css
.border {
    position: relative;
    border: none;
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
    .border::after{
        position: absolute;
        left: 0; right: 0;
        content: '';
        width: 200%;
        height: 200%;
        border-bottom: 1px solid #000;
        transform: scaleY(0.5);
    }
}
@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 3dppx) {
    .border::after{
        position: absolute;
        content: '';
        left: 0; right: 0;
        width: 300%;
        height: 300%;
        border-bottom: 1px solid #000;
        transform: scaleY(0.333333);
    }
}
```

---
title: 浏览器API
date: 2019-03-07 15:48:31
published: false
---
# 复制文字滴功能
## 前言
之前看到的复制文字是通过flash来实现的。但现在flash渐渐淡出web舞台。取代之的是h5的video。不对，说文字的复制怎么说到video了。

## 浏览器API的实现方式
首先安利一个js库https://clipboardjs.com/ 。看名字就知道是用于复制的。浏览器API复制的原理，究其本身，其原理为使用Selection和execCommand这两个浏览器API。使用Selection是为了js层面直接获取响应的文本，使用execCommand是使用系统层面的复制、剪切等操作。
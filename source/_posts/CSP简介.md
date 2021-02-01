---
title: CSP简介
date: 2019-03-07 14:43:07
tags:
categories:
---
# 关于网络请求的CSP相关
啥是CSP？https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP。简而言之，就是另一个能保证内容安全的浏览器方式实现安全的方式。

其实不光是页面的form跳转，连ajax访问都不行。

![csp](/images/csp-1.png)
![csp](/images/csp-2.png)

由上图可见，github.com首页设置了Content-Security-Policy字段，该字段在支持CSP的浏览器里，会限制所有内容访问，包括正常的img加载，ajax的get、post，表单提交等网络访问。不过，只要在CSP的允许之内，就能正常访问（并不是说ajax就没有跨域的问题了）。CSP还不支持内联的js代码。真是忧愁。

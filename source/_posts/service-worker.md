---
title: service worker
date: 2019-03-07 15:49:43
published: false
---

# serviceWorker
这个东西是在H5的worker API 之后出来的。主要作用是请求代理、消息推送、预请求等。

对于常用的对请求的代理，其姿势如下：

1. 首先是检测浏览器是否支持（手机上很多浏览器都支持，不支持的也会慢慢支持）
2. 安装服务(监听self.oninstall事件)。将需要缓存的文件路径写出来。
3. 监听请求onfetch事件。将匹配到的响应直接返回，而不用请求网络。具体可以查看这个：https://developers.google.cn/web/fundamentals/primers/service-workers/


---
title: ng-nodejs偶发502
date: 2019-03-07 15:32:32
tags:
categories:
---
# ng + node服务，导致ng报错：upstream提前关闭连接？
大前提是ng作为反向代理，upstream为node集群。

出错的触发条件是：某处发给ng一个带乱码的url请求，被ng转向node集群。

## 背景介绍
&emsp;&emsp;随着部门的web接口不断增多，java后端逐步向node迁移。在我大住宿，这个web接口有一个好听的名字：热狗。不，不对，它叫hotdog。即从这个状态：
<br />
![ng](/images/ng-1.png)
&emsp;&emsp;变为了这个状态：
![ng](/images/ng-2.png)
&emsp;&emsp;我们需要做的，就是搭建node服务，作为客户端和WEB_HOTDOG的通讯桥梁。

&emsp;&emsp;考虑到负载均衡，一般会采用类似nginx的软件作为反向代理。同时源服务器一般会有多台，所以经常看到这样的配置：
```bash
upstream node_server {
    server 111.111.111.10:6666;
    server 111.111.111.11:6666;
    server 111.111.111.12:6666;
    server 111.111.111.13:6666;
}
server {
    ...
    location /interface/to/location {
        proxy_pass http://node_server;
    }
}
```
&emsp;&emsp;即对/interface/to/location的请求会被转发到upstream  node_server上，当然详细的配置还有很多。
<!-- more -->

## 故障重现
&emsp;&emsp;配置好ng，部署好工程，万事俱备，只差验收了。然而，当访问新增的Node接口时，总是__时不时__的返回502！
![ng](/images/ng-3.png)
&emsp;&emsp;还有一个现象：当一个接口502后，其它接口基本上也跟着502（首屏会发3个请求）。但是直接node服务器的IP+PORT访问，一切都是那么的完美！既然有问题了，开始查问题！

## fix problem
&emsp;&emsp;接下来将以多个步骤，讲解fix的过程。

### Step.1 ops查ng日志
&emsp;&emsp;首先ops贴了一份ng日志：
![ng](/images/ng-4.png)
&emsp;&emsp;ops支持人员说：google了下   意思大概是说这部分访问进来走的是ng上处于半连接的tcp连接，__导致服务没处理就关闭连接了__。所以我们看到是502。我们可以先尝试__增加连接的超时时间__。
### Step.1_result
&emsp;&emsp;增加了超时连接后，依然出现502。继续。

### Step.2 Nodejs服务端查日志
&emsp;&emsp;作为大前端，查node日志肯定是我们基本功。守护程序使用的是pm2。但是我们却意外地发现，并没有__看到任何502的请求进来__！并且查看到当时的系统负载很低，不会因为负载大而断链。也就说是，ng返回给前端的502请求，__并没有进入到node服务器中__！这时候我们认为是ng转发有问题！联系ops继续看ng。
### Step.2_result
&emsp;&emsp;失败，继续找ops定位问题。

### Step.3 ops修改到upstream为长连接
&emsp;&emsp;ops说，考虑到多种因素，一般连接到upstream都采用的是短链接，对于频繁访问的接口，可以尝试使用长连接。经过我们大前端的确认，node服务器支持HTTP1.1的长连接，开始实验。
### Step.3_result
&emsp;&emsp;更为长连接后，502情况依然存在。失败。

### Step.4 查看node服务的超时处理
&emsp;&emsp;ops认为node服务在处理请求时，会有默认的超时处理。经过我们的确认，nodejs的http服务器默认超时时间是2min（我们并未手动更改超时时间），而出现502的情况是在请求发出后1秒内返回的。node服务器代码内，我们并未手动返回502状态（如果能手动返回502，那么说明请求已经到了node服务中间件，不可能出现没有请求日志的情况）。
![ng](/images/ng-5.png)
### Step.4_result
&emsp;&emsp;node服务器并没手动返回502状态码，准确地说应该是没走到业务逻辑中就已经挂了。

### Step.5 网络层面---抓包
&emsp;&emsp;现在的问题是，ops认为是node服务器有问题，我们认为是ng服务器有问题（确实各有各的道理），所以得找出是不是自身的问题。ops决定采用抓包的方式，看请求转发过程中请求、响应情况。下图是ops提供的ng服务器抓包图：
![ng](/images/ng-6.png)
&emsp;&emsp;由上图可以看出，ng发出请求到upstream的服务端口（这里将简称D端口）后（就是当前hover的条目），D端口监听的程序（node服务器）没有给出相应，而是先回了个Ack，然后直接发起Fin，结束连接。ng也回复Fin，确定结束连接。对于Ng来说，upstream没有返回任何东西，连响应头也没有，就给前端返回502了。找到了问题，下面就看这种情况产生的原因及处理方案了。

### Step.6 两端各自的尝试
#### 前端方案--node
&emsp;&emsp;查日志过程中发现了大量的乱码，如下图：

![ng](/images/ng-7.png)
&emsp;&emsp;发现前端并未对非英文字符或其他特殊字符做encode。在encode之后，抓包后未发现乱码，同时也并未再产生502的情况。（此时我已经觉得是node的问题了）。我的猜想是：含有特殊字符（或者叫非法字符）的url请求，当到达node的http服务时，在最底层net层就挂了，以至于传不到业务层（表现上就是肉眼不可见的请求日志）。
&emsp;&emsp;为了验证猜想，我查了一下Node-http文档：http.Server有一个clientError事件回调（只看到这么一个跟Error有关的server级回调）。于是我写了一个基本的http服务，并发送了一个如下的请求：
```js
const http = require('http');
const server = http.createServer(function (req, res) {
    res.end('你好\n');
});
server.on('clientError', (err, socket) => {
    console.log('clientError 事件回调');
    console.log(err);
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8888);
```
```bash
 curl 'localhost:8888/api/hotel/detailrecommend?hotelName=7)�R�(fI7��) ┳ ┓┏ ┯ ┓┌ ┬ ┐╔ ╦ ╗╓ ╥ ╖╒ ╤'
```
&emsp;&emsp;这里只是模拟乱码的出现，不一定非是这些字符。然后node服务打出的日志：

![ng](/images/ng-8.png)
&emsp;&emsp;确实是server层面的出错了。我们看看这个rawPacket是什么：
```bash
GET /api/hotel/detailrecommend?hotelName=7)�R�(fI7��) ┳ ┓┏ ┯ ┓┌ ┬ ┐╔ ╦ ╗╓ ╥ ╖╒ ╤ HTTP/1.1
Host: localhost:8888
User-Agent: curl/7.47.0
Accept: */*
```
&emsp;&emsp;这就是出错的请求头。
&emsp;&emsp;找到了问题所在，我们可以处理这个问题了：__对server添加clientError事件，打点记录错误请求信息，并将该socket以状态码400返回（给ng服务器）__，不处理这个事件的话，socket会hang住，然后由tcp层面自动关闭（这纯属我瞎逼逼的）。问了一下java的同学，说java中是会处理非法字符的，但node确实是没有处理，还是说留了个__clientError__让我们自己处理？黑人问号脸。。

#### ops方案--ng
&emsp;&emsp;至于为什么node服务器未响应，导致用户请求的其它请求也502了？ops同学给了如下解释：nginx被动检查导致，过多的错误会让ng认为server下线了，于是在一个fail_timeout周期内的请求都被ng直接返回502码，不管该请求是不是非法请求。ops同学继续补充：让touch域名的配置尽快迁移到OpenResty。OpenResty没有这个问题，它针对每个请求都是独立的，只依赖healthcheck状态，而不会依赖上一次请求的成功与否。

## 总结 
&emsp;&emsp;这一次的故障，让我和多个部门的同学一起定位问题。从前端到ng，从ng到node，从业务层面到网络底层，都有了更深的理解。错误不可怕，可怕的是找不到哪里错了。顺便记一下__ng+node__模式下的坑点：
+ node处理中要对所有异常进行处理，不管是业务层的，还是底层的。如果一开始就监听了clientError事件，那么解决这个问题就更加显而易见。
+ ng处理请求失败要结合具体场景，而不是所有upstream都是一个通用的模板。

&emsp;&emsp;同时也get到了新技能：
+ 服务器抓包中使用，tcpdump命令进行抓包，常用的：
```bash
tcpdump -vv -nn host <ng server ip> -w ng-request.pcap
```
&emsp;&emsp;即可捕获所有ng 打过来的请求，并保存在ng-request.pcap文件中，拉到本地用wiresharp瞅一眼，就知道tcp层面上的网络交互情况。

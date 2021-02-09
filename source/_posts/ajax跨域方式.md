---
title: ajax跨域方式
date: 2017-06-04 09:18:34
tags: ajax
categories: 网络请求
---

# 跨域方式

## jsonp
### 原理
jsonP 是采用script 的src访问无限制（事实上很多元素的src都无访问限制）。比如，当script访问的url地址为：
&lt;script type="text/javascript" src="http://localhost:9999?callback=ttt"&gt; 当服务器接收到请求时，对query语句进行解析（上述query语句为callback=ttt），然后将ttt作为回调函数名称，以拼接字符串的形式，返回给浏览器，如返回："" + "ttt(" + data + ");" 即可。这里给出nodejs服务器简单设置：
<!--more-->
```javascript
var http = require("http");
var fs = require("fs");
var url = require("url")

var str='';


function onRequest(request, response){
  // 请求时会默认请求 /favicon.ico ，这里简单处理，不返回任何东西;
  if (request.url == '/favicon.ico' ||request.url == '/' )
  	return;
  console.log("href:  ",url.parse(request.url).href); // 打印出请求完整地址
  var pathquery = url.parse(request.url).query;
  console.log("pathquery: ",pathquery) // 打印出查询语句
  var keys = pathquery.split("&");
  for (var i = 0, len=keys.length; i < len; ++i) {
  	var temp = keys[i].split("=", 2);
  	if (temp[0] == "callback") {
  		var value = temp[1];
			break;
  	}
  }
  response.writeHead(200,{"Content-Type":'text/plain;charset:utf-8;'});
  str = "" + value + "({price: 10,tickets: 20})"; // 拼接结果字符串
	console.log("str", str);
  response.end(str); // 返回字符串
}
http.createServer(onRequest).listen(9999);	// 监听9999端口的请求
console.log("Server has started.port on 9999\n");

```

前端页面请求：
```javascript
方式一，原生js：
<script>
	function ttt(data){console.log(data.id, data.name)}
</script>
<script type="text/javascript" src="http://localhost:9999?callback=ttt">
方式二，jQuery.ajax
$.ajax({
	type: "get",
	// async: false,
	url: "http://localhost:9999",
	dataType: "jsonp",  // 设置为jsonp后，不管type是否为post，一律被替换为get，即是jsonp只能为get
	jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)，这个例子中为?后面的参数名
	jsonpCallback:"success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据，，这个例子中为?后面的参数值。注意，用jQuery.ajax访问jsonp时，参数列表最后有一个&_=随机数，筛选参数时注意。
	success: function(json){
		alert('您查询到航班信息：票价： ' + json.price + ' 元，余票： ' + json.tickets + ' 张。');
	}, // 自动当作callback函数。
	error: function(){
		alert('fail');
	}
	});
方式三，jQuery.getJSON
$.getJSON("http://localhost:9999?callback=?",function(json){ 
//要求远程请求页面的数据格式为： ?(json_data) //例如： 
}); 
```


## 改写可跨域响应头
可以通过配置响应头实现跨域访问。
nodejs服务器设置：
```javascript
var http = require("http");
var fs = require("fs");
var url = require("url")

var str='';


function onRequest(request, response){
  // 请求时会默认请求 /favicon.ico ，这里简单处理，不返回任何东西;
  if (request.url == '/favicon.ico' ||request.url == '/' )
  	return;
  console.log("href:  ",url.parse(request.url).href); // 打印出请求完整地址
  var pathquery = url.parse(request.url).query;
  console.log("pathquery: ",pathquery) // 打印出查询语句
  var keys = pathquery.split("&");
  for (var i = 0, len=keys.length; i < len; ++i) {
  	var temp = keys[i].split("=", 2);
  	if (temp[0] == "callback") {
  		var value = temp[1];
			break;
  	}
  }
  // 'Access-Control-Allow-Origin' 设置可访问服务器的源地址，如果设置为 * 表示所有服务器均可访问
  // 'Access-Control-Allow-Methods' 设置可访问的方式
  response.writeHead(200,{"Content-Type":'text/plain;charset:utf-8','Access-Control-Allow-Origin':'http://localhost:8888','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});//可以解决跨域的请求
  //response.writeHead(200,{"Content-Type":'application/json',            'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
  //response.write("Hello World 8888\n");
  
  // str=fs.readFileSync('data.txt');
  str = "" + value + "({price: 10,tickets: 20})";
	console.log("str", str);
  response.write(str+";");
  response.end(str);
}

http.createServer(onRequest).listen(9999);
console.log("Server has started.port on 9999\n");
```

前端页面请求：
```javascript
方式一，原生js：
$.ajax({
		type: "get",
		url: "http://localhost:9999/",
		dataType: "text",// 注意这里最好是text，其它的好像有问题。
		data: "callback=?",
		success: function (data,stats) {
			eval("var obj =" + data.replace(/\(|\)/g,""))
			console.log(obj ,stats);
			// data;
		},
		error: function (error) {
			console.log(error)
		}
	})

```

## 代理
这种方式是通过后台(ASP、PHP、JAVA、ASP.NET)获取其他域名下的内容，然后再把获得内容返回到前端，这样因为在同一个域名下，所以就不会出现跨域的问题。

比如在A（www.a.com/sever.php）和B（www.b.com/sever.php）各有一个服务器，A的后端（www.a.com/sever.php）直接访问B的服务，然后把获取的响应值返回给前端。也就是A的服务在后台做了一个代理，前端只需要访问A的服务器也就相当与访问了B的服务器。这种代理属于后台的技术。
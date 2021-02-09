---
title: js小工具
date: 2016-09-06 16:03:42
tags: 
- js
categories: ES
---

小工具一:先收藏以下代码为书签. 在网页中选取了文本后, 若需要查询, 则可直接点击该书签
``` bash
javascript: 
var q;
if(window.getSelection) q = window.getSelection().toString();
else if(document.selection) q = document.selection.createRange().text;
void window.open('http://baidu.com/s?wd='+q);

```

<!--more-->

小工具二：
``` bash
javascript:(function(){isScrolling=false;var%20num;var%20clickTimer=null;while(isNaN(num))num=prompt("\u4f60\u60f3\u4e00\u79d2\u6eda\u591a\u8fdc\uff1f\uff08\u9ed8\u8ba4100\uff0c\u5355\u4f4d\u50cf\u7d20,\u8f93\u5165\u503c\u4e0d\u542b\u5355\u4f4d,\u53cc\u51fb\u6539\u53d8\u6eda\u52a8\u901f\u5ea6\uff09","10");var%20isScrolling=true;var%20b=setInterval(function(){window.scrollBy(0,num/10)},100);var%20btn=document.createElement("button");btn.type="button";btn.innerHTML="stop%20scroll";btn.style.textAlign="center";btn.style.position="fixed";btn.style.right="20px";btn.style.bottom="200px";document.getElementsByTagName("body")[0].appendChild(btn);btn.onclick=function(){if(clickTimer){window.clearTimeout(clickTimer);clickTimer=null}clickTimer=window.setTimeout(function(){if(isScrolling){clearInterval(b);btn.innerHTML="start_scroll";isScrolling=false}else{b=setInterval(function(){window.scrollBy(0,num/10)},100);isScrolling=true;btn.innerHTML="stop_scroll"}},200)};btn.ondblclick=function(){if(clickTimer){window.clearTimeout(clickTimer);clickTimer=null}clearInterval(b);num=undefined;while(isNaN(num))num=prompt("\u91cd\u8bbe\u6eda\u52a8\u901f\u5ea6","10");b=setInterval(function(){window.scrollBy(0,num/10);isScrolling=true;btn.innerHTML="stop_scroll"},100)}})();
```
将上面代码存为书签，即可实现自动滚屏功能。可上滚（负值），下滚。


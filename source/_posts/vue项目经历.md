---
title: vue项目经历
date: 2017-08-01 10:02:17
tags: vue
---


1,踩坑记录

a,进入页面, 如果未对应到route的所有路径, 可设置跳转404路由, 如果这时未设置404路由, 则会嵌套溢出.因为你可以想象, 当找不到任何匹配路径时, 跳404页面,(这是我设置的), 而404路由又没找到, 则又跳404, 所以说, 你懂了吧?  多说一句, vue-route的路由是从上到下依次匹配的. 
b,当项目配合tomcat使用时, 务必设置路由的主路由, 如tomcat下起了一个YDManager的web项目,则vue-route路由中需要设置  /YDManager/.....形式的路由.否则查不到相关资源, 直接404.
c,vue单页应用, 路由若采用hash来模拟route的话, 刷新是不会存在问题的(可能的问题是与后台的交互 暂时未接触这个问题). 若采用HTML5 的history API的话, 刷新就相当于重新在服务器中查找资源, 由于vue-route的路由是使用URL模拟, 并不代表真正的资源路径, 未找到资源当然404. 解决方式: [原文地址](http://blog.csdn.net/hayre/article/details/70145513),让后台设置访问其他资源时都跳转到index.html, 此时服务器不能返回404请求, 需要前台设计404页面. 也因为为单页应用, 所以只用返回index.html即可(及相关静态资源).
d,解决vue中引用图片失效的问题.首先，如果使用的是img标签那么可以这样
```bash
data () {
    return {
        img: require('path/to/your/source')
    }
}

然后在template中
<img :src="img" />
```
如果使用的是背景图的方式，那么可以这样
```bash
data () {
    return {
        img: require('path/to/your/source')
    }
}
<div :style="{backgroundImage: 'url(' + img + ')'}"></div>
或者直接在css中定义
background-image: url('path/to/your/source');
```
e, axios的使用, get方式时, 必须以{params:params}的方式传参, 如{params: {user:'tzx'}}, 而不能直接{user:'tzx'},post方式


f,mockjs使用.




g, 使用render渲染时, 不能在Vue组件中加template标签, 即使是空标签也不行. 
---
title: 制作hexo静态网页详细步骤
date: 2016-08-26 11:45:11
tags: 教程 Hexo next git
---
## 简介
本人于2016-8-26 成功创建第一个使用hexo框架的静态网站. 写下这篇博客, 期望将来自己有问题时或者其他有兴趣的人方便编写自己的博客. 

## 所需工具
以下均为百度云链接, Node.js为64位.
	[Node.js](http://pan.baidu.com/s/1mi1zjeC/),密码：kszc , [官方地址](https://nodejs.org/en/)
	[Git](http://pan.baidu.com/s/1kVGurND/), 密码：2266 
	Nodepad++ , 这个自己找一下.
	github帐号.
	<!--more-->
## 教程开始

### 链接github
设置Git的user name和email：(假设用户名设为aa, 邮箱为xxx@yy.zz)
``` bash
$ git config --global user.name "aa"
$ git config --global user.email "xxx@yy.zz"
```
检查是否有ssh密钥
``` bash
$ cd ~/.ssh  #有的话, 则能进入该目录, 否则错误提示
```
生成密钥：
``` bash
$ ssh-keygen -t rsa -C "xxx@yy.zz"
```
后面会让你输入密码. 可以输入, 也可以不输入. (不输入的话, 以后deploy的时候就不用输入密码. 意味着别人用你电脑也能修改远程文件. )

github上添加ssh密钥，这要添加的是“id_rsa.pub”里面的公钥

测试: $ ssh git@github.com  (设置过密码的话, 会让你输入密码)

### 安装Hexo
Node 和 Git 都安装好后，可执行如下命令安装hexo：
``` bash
$ npm install -g hexo-cli
```
初始化文件夹(生成很多文件和文件夹,假设初始化C:/abc) :
``` bash
$ hexo init c:/abc   #也可以cd到目标目录，执行 hexo init
```
生成静态页面
``` bash
$ hexo generate  #可以简写为   hexo g
```
本地启动
``` bash
$ hexo server  #可以简写为   hexo s
```

### 发布到github上
在站点配置文件底部加入 (repository为你的repository所在地址):
``` bash
deploy: 
  type: git
  repository: git@github.com:Tzxhy/Tzxhy.github.io.git
  branch: master
```

在git bash中:
``` bash
$ hexo deploy  #有密码的话,会让你输入密码
```

安装 git
``` bash
$ git init
```

## 后期事宜

### 更换主题
hexo更换主题十分简单. 在themes文件夹中放置主题文件即可. 在站点配置文件中修改 theme 属性为对应文件夹名称. 这里提供NexT主题下载. 也是我现在用的.
[Next](http://pan.baidu.com/s/1kUXEXN5), 密码：1zzg

## 联系作者
有啥问题联系QQ: 1139723651

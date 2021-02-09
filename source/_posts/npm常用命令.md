---
title: npm常用命令
date: 2016-10-31 10:20:01
tags:
- npm
categories: Nodejs
---

npm (node package manager)是node模块管理工具，类似与Linux下的yum和apt。

常用npm命令（参考：<https://npmjs.org/doc/>）
安装模块
npm install
安装当前目录package.json文件中配置的dependencies模块
安装本地的模块文件
npm install <tarball file>
Example:
npm install ./package.tgz
安装指定URL的模块
npm install <tarball url>
<!-- more -->
Example:
npm install https://github.com/indexzero/forever/tarball/v0.5.6
安装本地文件系统中指定的目录包含的模块
npm install <folder>
安装并更新package.json中的版本配置
npm install <name> [–save|–save-dev|–save-optional]
其中：
添加–save 参数安装的模块的名字及其版本信息会出现在package.json的dependencies选项中
添加–save-dev 参数安装的模块的名字及其版本信息会出现在package.json的devDependencies选项中
添加–save-optional 参数安装的模块的名字及其版本信息会出现在package.json的optionalDependencies选项中
安装模块的config的tag配置中含有指定tag的版本
npm install <name>@&lt;tag&gt;
Example:
npm install sax@latest
安装模块的指定版本
npm install <name>@&lt;version&gt;
Example:
npm install underscore@1.5.2
安装模块指定版本号范围内的某一个版本
npm install <name>@&lt;version range&gt;
Example:
npm install async@”&lt;=0.2.0 &gt;0.2.9″
–force强制拉取远程资源，即使本地已经安装这个模块
Example:
npm install underscore –force
-g或–global全局安装模块，如果没有这个参数，会安装在当前目录的node_modules子目录下
Example:
npm install -g express
显示npm的bin目录
npm bin
设置npm配置
npm config set <key> <value> [–global]
使用–global参数，设置全局配置
Example:
设置代理
npm config set proxy=http://proxy.tencent.com:8080
设置npm的镜像地址
npm config set registry http://npm.oa.com
获取npm配置
npm config get <key>
Example:
获取npm当前镜像地址
npm config get registory
删除npm配置
npm config delete <key>
Example:
删除代理设置
npm config delete proxy
在编辑器中打开npm配置文件
npm config edit
交互式的创建package.json文件
npm init
创建模块的压缩包
npm pack [<pkg> [<pkg> … ]]
如果没有参数，则npm会打包当前模块目录
发布模块，发布后可通过名称来安装该模块
npm publish <tarball>
npm publish <folder>
其中：
<folder>：包含package.json文件的目录
<tarball>：经过gzip压缩并归档的一个URL或文件路径，该压缩包包含单个目录，且该目录内有package.json文件
删除模块
npm rm <name>
npm r <name>
npm uninstall <name>
npm un <name>
注意：不会删除package.json文件dependencies选项中对应的依赖配置
查找模块
npm search [search terms ..]
npm s [search terms ..]
npm se [search terms ..]
查找匹配查找字符串的模块
更新模块
npm update [-g] [<name> [<name> … ]]
更新指定name列表中的模块。-g参数更新全局安装的模块。
如果没有指定name，且不是在某个模块内，会更新当前目录依赖的所有包都会被更新（包括全局和模块内）；如果当前目录在某个模块目录内，会更新该模块依赖的模块，所以不指定name直接运行npm update时，最好在某个模块内运行，以免更新到其他不想更新的模块。
执行脚本
npm start [<name>]
npm stop [<name>]
npm test [<name>] 等
运行package的start脚本，该脚本写在package.json文件scripts的start字段中。
该字段的值可以是当前系统控制台可执行的脚本，也可以是当前系统可执行文件的路径。
如果不传name参数，则执行当前目录下package.json文件中定义的脚本。
详见https://npmjs.org/doc/misc/npm-scripts.html
package.json文件
模块的配置文件，详见<https://npmjs.org/doc/files/package.json.html>


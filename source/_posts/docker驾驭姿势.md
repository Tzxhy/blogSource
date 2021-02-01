---
title: docker驾驭姿势
date: 2019-06-06 13:30:48
tags: docker
---

## base
1. 拉取镜像
docker pull ubuntu
2. 运行容器
docker create
docker run -it ubuntu:latest sh -c '/bin/bash' 
-i表示交互式，-t 表示分配一个终端
3. 显示所有容器
docker ps -a 
4. 启动容器
docker start -i trusting_morse 
<!-- more -->
## 存储
在 docker 容器运行期间，对文件系统的修改不会持久存在。需要持久存在的，采用数据卷。
docker run -it -v /home/www ubuntu:latest sh -c '/bin/bash' 
这把/home/www 作为容器的外部数据（可持久）

## 网络
1. 暴露出指定端口
docker run -it -p 22 ubuntu sh -c '/bin/bash'
将容器的 22 端口开放在了主机上，注意主机上对应端口是自动分配的。如果想要指定某个端口，可以通过 -p [主机端口]:[容器端口]  参数指定。
2. 容器和容器之间
docker run --name some-wordpress --link some-mysql:mysql -p 8080:80 -d wordpress

## 环境变量
1. 环境变量通过 -e 参数向容器传递
docker run --name some-wordpress -e WORDPRESS_DB_HOST=10.1.2.3:3306 \
    -e WORDPRESS_DB_USER=... -e WORDPRESS_DB_PASSWORD=... -d wordpress 

## 创建镜像
### 将容器创建为镜像
创建容器后，执行一些操作后，生成一个新的镜像：
docker commit 8d93082a9ce1 ubuntu:myubuntu 

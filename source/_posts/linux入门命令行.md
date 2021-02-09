---
title: linux入门命令行
date: 2019-03-07 15:23:35
tags:
- 命令行入门
categories: linux
---

# linux入门走一波


* [前沿-为啥要入门](#1)
* [常用指令](#2)

<h2 id="1">前沿-为啥要入门</h2>
虽然咱们是大前端，虽然咱们用的是JS，但是，咱的服务可都是放在linux服务上的啊。看个日志啥的，基本骚操作都不会，怎么调试bug呀？（这里多指node后端哈）。服务器上启动程序失败了，看错误好像是端口的问题，这个怎么操作啊？明明我的一个shell文件，为啥不能执行啊？等等。这样看似很基础的问题。其实我们不用掌握很多很多，掌握得多了，知识面广了，都有能力做运维了（当然得先做好本职工作，有时间有能力就可以去多学习）。下面我就分这么几方面来讲讲我眼中的入门。申明：本人linux渣渣一个，只是看linux从入门到精通后，把自己觉得有必要学习的东西分享一下，大神勿喷，有好的建议尽管来。哈哈。
<!-- more -->
<h2 id="2">要讲滴内容</h2>

### 历史、安装、基本配置
**略**。

### 基础工具
```bash
man xxx # 查看xxx程序的帮助文档
whatis xxx # 查看xxx程序的大致作用
apropos function # 通过在帮助手册中查询function单词，反查帮助文档中包含function单词的xxx程序
```

### 文件相关
```bash
mkdir dir # 在当前目录下新建目录dir（自行查询参数）
touch file.ext # 在当前目录下创建一个叫做file.ext的文件
pwd # 显示当前的工作目录
mv file1 file2 # 将file1重命名为file2
mv file1 ./dir/file2 # 将file1移动到dir目录中并命名为file2
rm file # 删除文件file（自行查询参数）
rm -f dir # 递归删除dir目录
cp file1 file2 # 拷贝file1为file2
cd dir # 进入目录dir
cd - # 返回上一次cd前的目录
ls # 列出目录、文件信息（参数很多，自行查询参数）
cat file.ext # 查看file.ext的内容（参数很多，自行查询参数）
head file.ext # 查看文件file.ext的开头（自行查询参数）
tail file.ext # 查看文件file.ext的结尾（自行查询参数）
less file.ext # 使用less工具查看file.ext（自行查询操作方式）
find dir # 在dir下查找文件（自行查询参数）
grep # 过滤输入流的内容（自行查询参数）
locate file.ext # 定位file.ext的位置
ls -l # 最左侧第一位：- 普通文件；d 目录；c 字符设备；b 块设备；s 本地套接口； p 管道；l 符号链接
ln -s source_file target_file # 建立从target_file指向source_file的链接（target_file是生成的链接符号）
```

### 管道操作
所谓管道就像小学数学的一根水管进，一根水管出，问你多久装满水池的问题。呸，不是！！！管道就是一个水管出，可以让其流入其它管道。数据在其中转换、流动。但是需要记住的一点，不是所有命令都支持管道操作。for example，
```bash
cat access.log | grep 127.0.0.1 | tee filter.log
# 上面就是先读取access.log这个文件（可以看作新建一个链接到这个文件的输入流R1），生成一个输出流O1；将这个输出流O1作为grep的输入流R2，经过grep操作后，生成输出流O2；O2作为tee的输入流，最终生成一个filter.log文件。
```

#### 输出重定向
```bash
ls > file.txt # 将ls的执行结果输出重定向到file.txt文件中
```

#### 输入重定向
通常来说，标准输入总是指向键盘。比如使用不带任何参数的cat命令。

```bash
cat #
> # 这两种都会进入不断的打字界面
cat <<EOF  # 这叫做立即文档（here document）
> sfes
> fsefsefs
> EOF

ls | grep hehe # 管道操作，将ls的输出作为grep的输入
```

### 网络相关

#### 服务器相关
一般服务器会预装ftp文件服务器和ssh远程连接服务。两个命令分别是sftp和ssh。

##### http服务器
咱们前端部署的一般是node服务。

### 进程相关
#### 终止程序
前台的程序一般可以通过Ctrl + C来终结（可能会被程序拦截），后台的程序只能手动使用kill去杀死。
#### 知识点介绍
1. PID：进程的ID号。每一个进程都有自己的唯一ID。
2. PPID：父进程的PID。
3. UID和EUID：真实和有效的用户ID。只有进程的创建者和root用户有才权利对该进程进行操作。EUID会在存在setuid程序的时候被用到。
4. GID和EGID：同上，只是对象变成了创建者所属的组ID号。
5. 谦让度和优先级：对进程操作工具可见的是谦让度。谦让度越低，优先级越高，这个进程就更早地被处理。

#### 进程工具
```bash
ps aux # 列出所有用户所有终端的进程
top # 动态显示占用cpu最多的进程
losf file # 查看占用文件的进程
kill pid # 向进程号为pid的进程发送SIGTERM软件终止信号，试图终止进程
Ctrl + C # 向当前前台程序发送SIGINT中断信号，试图终止进程
sudo kill -9 pig # 在内核级别杀死一个进程（如果这个命令都杀不死，就只能重启系统了。只能重启）
nice -n 2 bc # 设置bc以谦让度增量2启动
renice +12 -p pid # 对pid增加12点谦让度
```
#### 守护进程
守护进程专用于管理其下的子进程，当子进程出现意外时，按照守护进程的逻辑进行相应的处理。比如为http服务器设置的守护进程，一般当http服务器宕机或者cpu占用异常时，可以重启服务。对于ssh连接，也有专门的sshd守护进程保护。当有ssh连接请求时，sshd新建一个ssh连接用于通信。当结束ssh连接后，sshd善后。

### 权限相关
```bash
ls -l # 最左侧的rwx分别表示读写执行，分别表示拥有者（u）、拥有组（g）、其它人的权限（o）
chown owner:group file # 将file的拥有者改为owner，拥有组改为group
chown owner file # 将file的拥有者改为owner，拥有组不变
chown :group file # 将file的拥有者不变，拥有组改为group（注意group前不可省略冒号）
chown owner -R dir # 递归地将dir目录下的所有文件拥有者改为owner，拥有组不变
chmod u+x file # 对file的属主权限添加执行权限（u/g/o）
chmod u-x file # 对file的属主权限减少执行权限（u/g/o）
chmod +x file # 对file添加执行权限（u/g/o均添加）
who # 查看当前系统有哪些人登录
whoami # 查看自己登陆终端的用户名
uname -a # 查看当前系统的版本信息

sudo useradd -m tzx # 建立tzx帐号，并自动创建主目录（在服务器上不一定可以sudo，因为useradd正常情况下不能被所有用户sudo）
sudo passwd tzx # 为tzx修改登陆密码
groupadd groupname # 新增groupName属组
id user # 查看用户user的权限
groups user # 查看user的属组
gpasswd # 进行组相关的操作
```
### 系统维护
```bash
tar -cvf file.tar dir # 将dir下的目录打包为file.tar
tar -xvf file.tar # 将file.tar解开


df # 查看磁盘使用情况
```
配置/etc/crontab 文件，可以定时执行任务。
```bash
at 16:00 # 使用at命令简单定时一次性的任务
atq # 查看at任务
atrm 8 # 删除编号为8的任务
```
## 实用命令
```bash
pushd dir # 将dir压入目录堆栈
popd # 从目录堆栈中弹出目录
```

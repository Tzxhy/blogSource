---
title: unix 文件锁
date: 2019-04-23 14:03:08
tags:
categories:
published: false
---
最近遇到一个 case：nodejs 还没写完文件时（标志位为'w'，会重写文件），去读取文件时，可能读到的是空文件。unix 系统允许多进程同时读写文件，不提供原生的文件锁机制。查询了下，有 flock 命令用于文件劝告锁。涨一波知识。
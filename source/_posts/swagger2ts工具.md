---
title: swagger2ts工具
date: 2023-04-18 15:51:24
tags:
---
在与后端对接接口过程中我们发现，`swagger` 作为一种接口文档描述方案，对于前后端接口逻辑对齐是很有帮助的。因此，基于 `swagger` 生成对应的 ts 代码，能极大提高开发效率，降低出错可能性。

<!-- more -->

@tzxhy/sw2ts-generate
------

![1](/images/sw2ts-1.png)


## 说明
通过swagger.json文件，得到对应的类型定义文件和 api 调用文件。

目前版本支持 `swagger v2.0 JSON` 格式文件的解析。

## 安装

```sh
# 作为全局依赖
$ npm install -g @tzxhy/sw2ts-generate
# 作为项目dev依赖
$ npm install @tzxhy/sw2ts-generate -D
```

## 使用说明
```txt
Usage: sw2ts [options] [--] [input_filename]

Options:
    --url <url>                     在线swagger.json地址（不使用 input_filename）
    -o, --out <file>                使用 url 单文件时，可指定输出文件名
    -d, --dir <path>                输出目录。默认src
    -r, --required                  是否默认所有属性均为必选属性
```

## 用例

``` sh
# 单文件，使用url作为输入
$ sw2ts --url https://petstore.swagger.io/v2/swagger.json -o output -r
tree ./src
.
├── service
│   ├── api
│   │   └── output.ts
│   └── request.ts
└── typings
    └── swagger
        └── output.ts

# 单文件，使用本地json文件
$ sw2ts -d src swagger.json
tree ./src
.
├── service
│   ├── api
│   │   └── swagger.ts
│   └── request.ts
└── typings
    └── swagger
        └── swagger.ts

# 指定输入目录
$ sw2ts -d src -r swaggers/
tree ./swaggers
.
├── api1.swagger.json
└── api2.swagger.json

tree ./src
.
├── service
│   ├── api
│   │   ├── api1.swagger.ts
│   │   └── api2.swagger.ts
│   └── request.ts
└── typings
    └── swagger
        ├── api1.swagger.ts
        └── api2.swagger.ts
```
用例可以放入 `package.json` 的 `scripts` 中执行。


其中，request.ts 文件为样板代码：
```ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosRequestConfig } from "axios";

export interface APIGenerate {
    head<T>(url: string, params: any, config?: AxiosRequestConfig): T;
    get<T>(url: string, params: any, config?: AxiosRequestConfig): T;
    patch<T>(url: string, params: any, config?: AxiosRequestConfig): T;
    post<T>(url: string, params: any, config?: AxiosRequestConfig): T;
    put<T>(url: string, params: any, config?: AxiosRequestConfig): T;
    delete<T>(url: string, params: any, config?: AxiosRequestConfig): T;
}

export class API implements APIGenerate {
    head<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
    get<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
    patch<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
    post<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
    put<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
    delete<T>(url: string, params: any, config?: AxiosRequestConfig): T {
        throw new Error("Method not implemented.");
    }
}

export default new API();

```

自行实现相关方法即可。当存在该文件时，不会覆盖该文件。

## bugs or features

请邮件反馈：tanzhixuan@senseauto.com


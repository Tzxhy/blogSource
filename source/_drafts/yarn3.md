---
title: yarn3
date: 2022-07-06 10:35:54
tags:
categories:
---

在使用了 yarn3 一段时间后，感觉 yarn 非常好用：并行下载，默认pnp，workspace 原生支持等，这些特性极大方便了项目的开发。利用空闲时间，对 yarn 的源码设计做一个学习。

# 概览
yarn3 的仓库本身也是一个多项目仓库，也就是 monorepo 。packages 目录下的包可以大致分为几类：

- 通用核心包，比如：yarnpkg-core, yarnpkg-cli 等以 yarnpkg- 开头的包；
- 插件包，比如：plugin-npm, plugin-git 等以 plugin- 开头的包；
- 第三方适配包，比如：vscode-zipfs，用于解压 pnp 的 zip 包

下面，我们将从核心包开始，从这么几个问题入手：
1. 执行 `yarn` 时，默认执行的 `yarn install`，具体流程是什么？
1. 执行 `yarn <scriptName>` 流程是什么？
1. 执行 `yarn workspaces foreach install` 插件的执行，流程是什么？
1. npm 包多版本问题怎么解决？

# yarnpkg-cli
`cli.ts` 是入口文件。在 `main.ts` 中，执行了 cli 的命令注册：
```js
for (const command of plugin.commands || []) {
	cli.register(command);
}
```
最终调用到 `cli.runExit`。

由于默认注册了很多 module 和 plugin ，最终会进入到：`packages/plugin-essentials/sources/commands/install.ts`。

从代码中的 `usage` 中可以看到，install 被分为了4步：解析，拉取，链接，构建。

- 解析：首先包管理工具会解析依赖。某个依赖的包，其版本优于另一个版本的确切决定方式在常规 semver 保证之外没有标准，也就是说，semver 只决定了需要的版本范围，却不能决定多个包依赖相同包的不同版本时，应该如何决定使用哪个版本。如果一个包没有解决你所期望的，请检查所有依赖项是否正确声明（也请访问我们的网站以获取更多信息：）。
- 拉取：然后拉取所有我们需要的依赖，确保他们被存放在缓存目录下（可以检查 `yarn config` 出来的 `cacheFolder` 值）
- 链接：接着把依赖树信息发送到内部插件，这些插件负责将它们以某种方式写入到磁盘（比如生成一个 `.pnp.cjs` 文件）
- 构建：当依赖树被写入到磁盘后，包管理工具就有空去为所有需要的包执行构建命令，以它们的依赖拓扑顺序。见：[链接](https://yarnpkg.com/advanced/lifecycle-scripts )

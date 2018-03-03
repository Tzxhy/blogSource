---
title: webpack-CommonsChunkPlugin实战操作
date: 2017-10-27 19:02:46
tags: webpack CommonsChunkPlugin
---

近来学习webpack了，有了解到CommonsChunkPlugin插件用来解决长效缓存的问题。那么问题来了，怎么用？怎么用好？
<!-- more -->
# 官网学习
webpack1的[官网地址](http://webpack.github.io/docs/using-plugins.html)，没事看看。
其中关于插件CommonsChunkPlugin，[这](http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin)有详细介绍。具体api我不介绍，个人自己看。我就按它的几个例子来说。
## 1. Commons chunk for entries
```javascript
new CommonsChunkPlugin({
  name: "commons", //此为非入口块的名称
  // (the commons chunk name)
  filename: "commons.js",//可以重新指定
  // (the filename of the commons chunk)
  // minChunks: 3,//默认是块的数量（不含本commons块）
  // (Modules must be shared between 3 entries)

  // chunks: ["pageA", "pageB"],//可以自定义块的范围，默认所有块
  // (Only use these entries)
})
```
这样会将所有入口块的公共部分打到commons.js中，包含runtime部分和公共部分（多为第三方库，如jquery、react等）。同时需要先加载commons.js，然后才是应用代码。

## 2.Explicit vendor chunks
假设我们有如下代码：
```javascript
entry: {
  vendor: ["jquery", "other-lib"], // 多为第三方库
  app: "./entry" // 应用入口代码
}
new CommonsChunkPlugin({
  name: "vendor", // 将入口块设为操作块

  // filename: "vendor.js" // 可以另外设置，如果不设置，文件名则为[name].js，同时会覆盖原vendor块
  // (Give the chunk a different name)

  minChunks: Infinity, //当当前操作块为入口块时，Infinity会提取出runtime代码和公共代码（三方库）
  // (with more entries, this ensures that no other module
  //  goes into the vendor chunk)
})
```
效果和1.基本一致，只是在入口块添加了一个三方库的入口，提取公共块时指定三方块为操作块即可。
## 3.Extract out common modules and runtime module
这个是自己多次实验发现的。
```javascript
entry: {
  	main1: './main1.js',//引用了vendor中两个库
  	main2: './main2.js',//引用了vendor中两个库
    vendor: ['jquery','underscore']//一般如果入口写了vendor，则提取
    //公共块时name需要设置为vendor
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
  	// new webpack.BannerPlugin(`built on ${new Date().toLocaleString()}`),
    new webpack.optimize.CommonsChunkPlugin({
      //指定块的名称。可以是自己写的，
      //也可以是入口块的名称（entry里面的）
      // 如果是自己写的，则会新建一个块，以filename为文件名
      // 如果是现有块，则以现有块重写现有块内容（无filename选项时，有filename时，新建文件，并删除原来的块文件）
      // 现有块， 多指定第三方库，可以直接覆盖原现有块
      name: 'init',
      minChunks: Infinity, // init为非入口块，则只移动所有模块的runtime代码到init块中
      filename: 'init.[chunkhash].js' //文件名称
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',//如果name指定的块不是入口块，则会自动添加runtime头，如果是，则不会添加了。棒棒哒！！这里是入口块，而且
      // main1,main2块此时以已经无runtime代码
      chunks: ['main1', 'main2']
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'test',//如果name指定的块不是入口块，则会自动添加runtime头，并且可能导致代码重复；如果是，则不会添加runtime了。
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',//如果name指定的块不是入口块，则会自动添加runtime头，如果是，则不会添加了。棒棒哒！！
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      title: 'test',
    })
    // new ChunkManifestPlugin({
    //   filename: 'manifest.json',
    //   manifestVariable: 'webpackManifest',
    //   inlineManifest: false
    // })
  ]
```
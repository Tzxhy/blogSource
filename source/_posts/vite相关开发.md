---
title: vite相关开发
date: 2023-04-19 10:28:30
tags:
---
在使用 `vite` 开发过程中，我们遇到了一些问题，也提出了一些基于 `vite` 的解决方案。该文章围绕 `vite` 相关，介绍了相关的一些方案。


<!-- more -->

## @tzxhy/vite-plugin-case-sensitive
---

vite 大小写敏感插件。`Mac/Windows` 下，文件路径是`大小写不敏感的`，可能导致相同的代码，在 `linux` 平台上构建失败。引入该插件后，当引用的 `path` 不存在时，提示报错，如下：

![](/images/case-1.png)

### 安装
```sh
yarn add @tzxhy/vite-plugin-case-sensitive
```

### 使用
```ts

import {
    defineConfig,
} from 'vite';

import caseSensitivePlugin from '@tzxhy/vite-plugin-case-sensitive';

const ProjectPathDir = 'Your Project Path Dir';
const ProjectRootDir = 'Your Project Root Path Dir';

export default defineConfig((env) => {
    const plugins = [];
    if (env.mode !== 'production') {
        plugins.push(caseSensitivePlugin({
            // 监听相关文件夹下的修改。比如：重命名等
            watch: [
                path.join(ProjectPathDir, 'src'), // 项目 src 目录
                path.join(ProjectRootDir, 'src'), // 监听公共 src 目录
            ],
        }));
    }
    return {
        plugins,
        // ... other configs
    }
})

```


## @tzxhy/vite-generate-mock
根据 `swagger.json` 文档，创建 `vite-plugin-mock` 所用的 ts 文件。


### 安装
```sh
yarn add @tzxhy/vite-generate-mock -D
```

### 使用
创建自定义文件，如：
```js
// scripts/generate-mock.js

// 用于生成mock结构
/* eslint-disable */
const path = require('path');
const fs = require('fs');
const generate = require('@tzxhy/vite-generate-mock').default;
let customJsonConf = {};
try {
    customJsonConf = require('../mock/custom-mock-conf');
} catch(e) {
    console.log('如果需要自定义代理，创建 mock/custom-mock-conf.js 文件内容如：' + `
module.exports = {
    '/v1/mec/device/create_sensor': {
        url: '/api/mec/device/create_sensor_new',
        method: 'post',
        response: () => ({
            errCode: 0,
            errMsg: 'success',
            errDetail: Random.string(),
            data: {
                rsuSerial: Random.string(),
            },
        }),
    },
};`);
}

const customInterfaceKeys = Object.keys(customJsonConf);

const mockCodes = generate({
    fileHeader: '',
    // 指定 swagger.json 文件地址
    apiPath: path.join(__dirname, '..', 'swagger', 'api.swagger.json'),
    apiPathRewrite(apiPath) {
        return apiPath.replace('/v1', '/api');
    },
    // api 替换，使用自定义的内容
    apiReplace(apiPath) {
        if (customInterfaceKeys.includes(apiPath)) {
            return this.returnObj(customJsonConf[apiPath]);
        }
    },
    // this 绑定了辅助函数；apiPath为接口地址；curveKeyName为key名称；curveLevel为嵌套级别。从1开始。
    // apiPath 为转换前的path
    responseAdapter(apiPath, curveKeyName, curveLevel) {
        if (curveKeyName === 'totalPages') {
            return this.createNumberLiteral(100);
        }
        if (curveKeyName === 'count') {
            return this.createNumberLiteral(10000);
        }
        if (curveKeyName === 'id') {
            return this.createRandomNumber(1, 1000);
        }
        if (curveKeyName === 'alertingNum'
        || curveKeyName === 'totalAlerting'
        || curveKeyName === 'totalErrors'
        || curveKeyName === 'totalHistoryErrors'
        || curveKeyName === 'totalHistoryAlerting'
        
        ) {
            return this.createRandomNumber(1, 200);
        }
        if (curveKeyName === 'keepingTime') {
            return this.createRandomNumber(1000 * Math.floor(Math.random() * 1e3), 1e8);
        }
        if (curveKeyName === 'timestamp') {
            return this.createStringLiteral(new Date().valueOf() + '')
        }
        if (curveKeyName === 'errCode') {
            return this.createNumberLiteral(0);
        }
        if (curveKeyName === 'errMsg') {
            return this.createStringLiteral('success');
        }
    }
});

// 产物地址
const mockDest = path.join(__dirname, '..', 'mock', 'api.ts');
fs.writeFileSync(mockDest, mockCodes);
console.log('mock源文件已生成至: ' + mockDest);

```

配置 `package.json`：
```json
{
    "scripts": {
        "start-with-mock": "yarn typings && yarn generate-mock && vite --open --mode mock",
        "generate-mock": "node scripts/generate-mock",
        "typings": "other things"
    }
}
```

配置 `vite.config.js`，如下：
```ts

import {
    defineConfig,
} from 'vite';

import {
    viteMockServe,
} from 'vite-plugin-mock';

export default defineConfig((env) => {
    const plugins = [];
    if (env.mode === 'mock') {
        console.log('use mock server...');
        // mock plugin
        plugins.push(
            viteMockServe({
                mockPath: 'mock',
                localEnabled: true,
            }),
        );
        // scripts/generate-mock.js 文件地址
        const mockGenerate = path.join(__dirname, 'scripts', 'generate-mock.js');

        // 文件更新，那么重新生成mock数据
        fs.watch(mockGenerate, () => {
            childProcess.exec('node ' + mockGenerate, (err, std) => {
                console.log(std);
            });
        });

        // 自定义文件更新，同样触发更新
        try {
            const customMock = path.join(__dirname, 'mock', 'custom-mock-conf.js');
            fs.watch(customMock, () => {
                childProcess.exec('node ' + mockGenerate, (err, std) => {
                    console.log(std);
                });
            });
        } catch (error) {
            console.log('watch custom mock error', '\n', error);
        }
    return {
        plugins,
        // ... other configs
    }
})

```

然后开启 `mock 开发` 即可： `yarn start-with-mock`。


## @tzxhy/vite-plugin-shaking-css-module
---
`vite 插件`。用于去除 vue3 css module 中未引用的样式 （**css module tree shaking**）。

例如：
style.less 文件（独立 SFC 样式文件）：
```less
.test() {
    background-color: white;
}
// 被 template 引用
.app3 {
    .test;
    color: yellow;
}
```

.vue 文件（SFC 单组件，包含内嵌 style 标签）:
```vue
<template>
    <img :class="css.app" alt="Vue logo" src="./assets/logo.png" />
    <span :class="css.app3">{{ count }}</span>
</template>
<script>
// 略

import {
    ref, useCssModule,
} from 'vue';
const css = useCssModule('css');
// 引用 app2
console.log('css: ', css.app2);
</script>
<style lang="less" module="css">
@import "./style.less"; // 引用上面的样式文件
// 被 template 引用
.app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
// 被 script 引用
.app2 {
    margin-top: 60px;
}
</style>

```

main.ts 中可引用公共样式（不会被 tree shaking）：
```ts
import './public.less';
```

public.less文件：
```less
// 即使没有显式引用，也不会被剔除，因为没有作为 vue SFC 的样式
#root {
    background-color: blue;
}
body {
    color: #666
}
```

则打包后，css文件只会包含：.app， .app3，.app2 和非 SFC 样式。其余违背依赖的样式将被剔除，如：
```css
#root{background-color:#00f}body{color:#666}._app3_368a9{background-color:#fff;color:#ff0}._app_b4102{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50;margin-top:60px}._app2_87af3{margin-top:60px}
```

### 安装
```sh
yarn add @tzxhy/vite-plugin-shaking-css-module -D
```

### 引入方式
在 `vite.config.js` 中声明插件：

```js
// 引入插件
import pureCss from '@tzxhy/vite-plugin-shaking-css-module';
import vue from '@vitejs/plugin-vue';

export default defineConfig((env) => {
    // 插件
    const pureCssPlugin = pureCss();
	// 插件位置在 vue 插件之后
    const plugins = [vue(), pureCssPlugin];
    
    return {
        css: {
            modules: {
				// 必要步骤，用于替换内置的 css 模块名命名方式
                generateScopedName: pureCssPlugin.generateScopedName,
            },
        },
        plugins,
    };
});
```

### 其他
当前仅能分析出 template 和 script 中直接使用 CssModulesName.moduleName (或者 CssModulesName['moduleName]) 的形式获取依赖；对于动态求值类型，无法计算。当出现这种情况时，可以在 script 中增加引用，如：
```vue
<template>
	<div :class="'dynamicModule' + no" />
</template>
<script>
// 略
import {
    ref, useCssModule,
} from 'vue';
const css = useCssModule('css');
const no = ref(1); // 1 或者 2

// 依赖检测注入
(css.dynamicModule1, css.dynamicModule2);
</script>
```

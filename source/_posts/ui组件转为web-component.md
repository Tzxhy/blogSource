---
title: ui组件转为web-component
date: 2023-04-20 16:57:25
tags:
---

@tzxhy/create-web-component
---
将 `Vue/React` 组件，转换为通用 `web component（包含各自运行时）`。当前`不支持 attributes 改变后触发组件更新`，会在后面的版本中更新。

<!-- more -->

## 安装
```sh
yarn add @tzxhy/create-web-component
```
同时确保，`react,react-dom` 或 `vue` 依赖已安装。

## 函数签名说明
```ts
/** 注册 Vue 组件为 web component */
export function registryVueElement<
    P extends Record<string, any>
>(name: string, VComponent: import('vue').Component<P>, style?: string): void;

/** 注册 React 组件为 web component */
export function registryReactElement<
    P extends Record<string, any>
>(name: string, RComponent: import('react').FunctionComponent<P> | import('react').ComponentClass<P> | string, style?: string): void;

/** 传递给 web component 组件的参数包装器 */
export function t<T>(v: T): string;
```
其中的 `style` 参数为 `ShadowDOM` 下的 `局部 style`，在 `vite` 项目中可以使用如下形式来传入样式：
```ts
import style from './component.css?inline';

registryVueElement('name', Component, style);
```

## 使用

### 使用 React 组件注册的 web component
```ts
import {
    useEffect,
    useState,
} from 'react';

import {
    registryReactElement,
} from './index';
import {
    t,
} from './utils/attr2prop';

function ReactComponentTest(props: {name: string, onclick: () => void}) {
    const [count, updateCount] = useState(0);
    useEffect(() => {
        const t = setInterval(() => {
            updateCount((i) => i + 1);
        }, 1000);
        return () => {
            window.clearInterval(t);
        };
    }, []);
    return <div onClick={props.onclick}>React {props.name}。count: {count}</div>;
}

// 注册 react 组件为 web component
registryReactElement('component-test-react', ReactComponentTest, ':host{font-size: 18px}');

{
    const root = document.querySelector('#react-root')!;
    [...root.children].forEach((i) => i.remove());
    const e = document.createElement('component-test-react');
    e.setAttribute('name', t('tanzhixuan in reactify web component'));
    e.setAttribute('onclick', t((() => console.log('click in reactify web component'))));
    root.appendChild(e);
}
```

### 使用 Vue 组件注册的 web component
vue3 单组件，Test.vue：
```vue
<template>
    <div
        :class="css.test"
        @click="onclick">
        <span>Vue component: </span>{{ name }}。count: {{ count }}
    </div>
</template>

<script lang="ts" setup>import {
    onMounted, onUnmounted, ref,
} from 'vue';

defineProps<{
    name: string;
    onclick:() => void;
}>();

const count = ref(0);

let t: number;
onMounted(() => {
    t = setInterval(() => {
        count.value += 1;
    }, 1000);
});
onUnmounted(() => {
    window.clearInterval(t);
});

</script>
<script lang="ts">
export default {
    name: 'Test',
};
</script>

<style lang="less" module="css">
.test {}
</style>
```

注册及使用：
```ts
import {
    registryVueElement,
} from './index';
import Test from './test.vue';
import {
    t,
} from './utils/attr2prop';


// 注册 vue web component
registryVueElement('component-test-vue', Test, ':host{font-size: 26px}');
{
    const root = document.querySelector('#vue-root')!;
    [...root.children].forEach((i) => i.remove());
    const e = document.createElement('component-test-vue');
    e.setAttribute('name', t('tanzhixuan in vue web component'));
    e.setAttribute('onclick', t((() => console.log('click in vue web component'))));
    root.appendChild(e);
}
```

### 跨框架使用 web component
参考各自框架的引入说明。书写web component 类型定义可参考：

```ts
// react 定义
declare global {
    namespace JSX {
        interface TestReactComponentAttributes {
            name: string;
            onclick: string;
        }
        interface IntrinsicElements {

            // React 组件
            'test-react-component': TestReactComponentAttributes;
        }
    }
}
// vue 定义
declare module '@vue/runtime-core' {
    export interface TextVueComponentElement extends globalThis.JSX.TestReactComponentAttributes {
        /** 点击回调。实际数据格式为：(d: Point) => void */
        onclick: string;
    }
    export interface GlobalComponents {
        TextVueComponent: TextVueComponentElement;
    }
}
```

## ChangeLog

---
title: 初尝solid.js
date: 2023-05-06 16:45:14
tags:
- solid.js
categories:
- 前端框架
updated:
---

最近学习了下 `solid.js` 的[官网文档教程](https://www.solidjs.com/tutorial/introduction_basics)，以及结合具体的 [api 文档](https://www.solidjs.com/docs/latest/api#%E5%93%8D%E5%BA%94%E6%80%A7%E5%9F%BA%E7%A1%80)，总结了一下 `solid.js` 带给我的感受。

<!-- more -->

## 响应式
### Signal
在 `solid` 中，存在着类似 `react` 中 `useState` 的 api： `createSignal, createEffect` 等。如以下代码：
```jsx
function Counter() {
  const [count, setCount] = createSignal(0);

  setInterval(() => setCount(count() + 1), 1000);

  return <div>Count: {count()}</div>;
}
```
熟悉 react 的同学可能马上就有疑问了，这个 `setInterval` 不应该写在类似 `useEffect` 里，应该作为类似 `onMount` 执行吧？刚开始学习 `solid` 时，是会存在这些疑问的，这也是它与 `react` 不同的地方之一。`react` 中是 `state` 改变后，整个组件函数会重新执行一遍，返回一个新的 `react` 组件，在组件中的代码会重新执行一遍；而 `solid` 中， `signal` 改变后，仅会更新依赖该 `signal` 的 **子组件块**，不会走整个组件重新执行的逻辑，因此直接在组件体写 `setInterval` 是没有问题的。

在 `solid` 中访问 `signal`，是需要执行 `createSignal` 返回的第一项索引的。看看其签名：
```ts
import { createSignal } from "solid-js";

function createSignal<T>(
  initialValue: T,
  options?: { equals?: false | ((prev: T, next: T) => boolean) }
): [get: () => T, set: (v: T) => T];

// createSignal 的返回值的可用类型:
import type { signal, Accessor, Setter } from "solid-js";
type signal<T> = [get: Accessor<T>, set: Setter<T>];
type Accessor<T> = () => T;
type Setter<T> = (v: T | ((prev?: T) => T)) => T;
```
返回的 `getter` 是一个类似于对象的 `get` 属性。为什么要设计成 `get 属性`，而不是像 `react` 的直接变量引用呢？这是 `solid` 的设计如此，这样才能 **捕获依赖**。那么又有人要问了，为什么不做成 `vue2` 中的对象属性引用呢？为什么不做成 `vue3` 中的 `ref/reactive` 呢？哪有这么多为什么，只能说 `solid` 设计如此。每一种响应式的基本原理都一样，但实现上可以是千差万别的。

### 捕获依赖
关于响应式原理，之前有写过一篇文章及对应的库，有兴趣的可以看看[文章](https://reactivity.tanzhixuan.site/)，同时代码也放在了 github 上。这里简单说说。

何为捕获依赖？当我们在组件的某处依赖了某个 `state` 时，程序如何知道更新了 `state` 后触发对应的节点内容更新呢？其实这就是捕获依赖：在依赖了该 `state` 的方法执行时，记录下执行该方法的函数引用。比如：
```tsx
function Counter() {
  const [count, setCount] = createSignal(0);

  setInterval(() => setCount(count() + 1), 1000);

  // 这里的jsx最终会编译成函数调用的形式
  return <div>Count: {count()}</div>;
}

// 会编译成
import { template as _$template } from "solid-js/web";
import { createComponent as _$createComponent } from "solid-js/web";
import { insert as _$insert } from "solid-js/web";

const _tmpl$ = /*#__PURE__*/_$template(`<div>Count: </div>`, 2);

import { render } from "solid-js/web";
import { createSignal } from "solid-js";
function Counter() {
  const [count, setCount] = createSignal(0);
  setInterval(() => setCount(count() + 1), 1000);
  return (() => {
    const _el$ = _tmpl$.cloneNode(true),
          _el$2 = _el$.firstChild;

    _$insert(_el$, count, null);

    return _el$;
  })();
}
```
当渲染 `Counter` 组件时，程序能记录下，当 `count` 改变时，需要重新执行： _$insert 这里相关的代码来更新 UI。这就是捕获依赖的大致理解。

捕获依赖，一般是基于 `Object.defineProperty` 或者是基于 `Proxy` 来做，具体实现可以看看上面贴的文档链接。这里不详细说响应式原理。

### 衍生 Signal
基于捕获依赖，还能实现类似 `vue` 的 `computed` 属性：
```tsx
function Counter() {
  const [count, setCount] = createSignal(0);
  const doubleCount = () => count() * 2;

  setInterval(() => setCount(count() + 1), 1000);

  return <div>Count: {doubleCount()}</div>;
}
```
因为 `doubleCount` 中依赖了 `count`，当 `count` 更新时，会触发 `doubleCount` 重新执行， `doubleCount` 更新后，又会触发 `div` 下的文本节点更新。

### Effect
`solid` 中同样有 类似 `useEffect` 的 api： `createEffect`：
```tsx
function Counter() {
  const [count, setCount] = createSignal(0);
  createEffect(() => {
    console.log("The count is now", count());
  });

  return <button onClick={() => setCount(count() + 1)}>Click Me</button>;
}
```
`createEffect` 是一个显式的捕获依赖：当内部依赖的 `signal` 更新后，会触发该 `effect` 的重新执行。

来看看 `createEffect` 的签名：
```ts
import { createEffect } from "solid-js";

function createEffect<T>(fn: (v: T) => T, value?: T): void;
```
其 `value` 可选参数，实现了类似 `Array.prototype.reduce` 的功能：
```ts
createEffect((prev) => {
  const sum = a() + b();
  if (sum !== prev) console.log("sum 更改为: ", sum);
  return sum;
}, 0);
```

`effect` 主要用于读取但不写入反应系统的副作用：最好避免在 `effect` 中设置 `signal`，如果不小心可能会导致额外的渲染甚至**无限 effect 循环**。

### memo
`solid` 中同样有 `memo` 函数：
```ts
function fibonacci(num) {
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
}

function Counter() {
  const [count, setCount] = createSignal(10);
  const fib = createMemo(() => {
    console.log('Calculating Fibonacci');
    return fibonacci(count());
  });

  return (
    <>
      <button onClick={() => setCount(count() + 1)}>Count: {count()}</button>
      <div>1. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>2. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>3. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>4. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>5. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>6. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>7. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>8. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>9. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      <div>10. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
    </>
  );
}
```
仅当 `count` 变化时，才会触发 `fib 函数` 的重新执行。在上例中，点击按钮后，虽然有那么多个 `fib()` 的执行，但最终，其实只有一次执行。`memo` 与常见的 `react useMemo`, `vue memo`  等 api 一致，仅当依赖更新后，才重新触发执行。这里说的是更新，比如，依赖值从`0 => 1`，会导致重新执行一次；从`1 => 0`，也会导致重新执行，并没有一个值缓存的作用。如果需要值缓存，那么需要自己实现一个缓存。


## 流程控制
### Show
在 `vue` 中，通过 `v-if` `v-show` 来控制是否渲染/显示某一节点；在 `react` 中，通过 `{ show ? <SomeComponent /> : null}` 来控制是否渲染某一节点。而 `solid` 中是将这种行为也统一封装成了组件：
```tsx
function App() {
  const [loggedIn, setLoggedIn] = createSignal(false);
  const toggle = () => setLoggedIn(!loggedIn())
  
  return (
    <Show
      when={loggedIn()}
      fallback={<button onClick={toggle}>Log in</button>}
    >
      <button onClick={toggle}>Log out</button>
    </Show>
  );
}
```
`Show` 组件，接收一个 `whe`n 参数和 `fallback` 参数，用于控制是否显示直接子组件。

需要注意的是，并不是说 `{ show ? <SomeComponent /> : null}` 这种形式就用不了了，这种也是可以的。如：
```tsx
function App() {
  const [loggedIn, setLoggedIn] = createSignal(false);
  const toggle = () => setLoggedIn(!loggedIn())
  
  return (
    <>
      <button onClick={toggle}>切换</button>
      {
        loggedIn() ? 'logined' : 'not login'
      }
    </>
  );
}
```

会被编译为：
```tsx
function App() {
  const [loggedIn, setLoggedIn] = createSignal(false);

  const toggle = () => setLoggedIn(!loggedIn());

  return [(() => {
    const _el$ = _tmpl$.cloneNode(true);

    _el$.$$click = toggle;
    return _el$;
  })(), _$memo(() => loggedIn() ? 'logined' : 'not login')];
}
```

所以我们知道，在 `solid` 中，三目运算符可能被编译成 `memo` 函数（具体看是否是依赖 `Signal`）。

### Switch
当存在多个条件以上时，为了避免使用 `Show` 而导致的多层嵌套，可以使用 `Switch`:
```tsx
function App() {
  const [x] = createSignal(7);

  return (
    <Switch fallback={<p>{x()} is between 5 and 10</p>}>
      <Match when={x() > 10} >
        <p>{x()} is greater than 10</p>
      </Match>
      <Match when={5 > x()}>
        <p>{x()} is less than 5</p>
      </Match>
    </Switch>
  );
}
```

### 循环
对于循环，熟悉 `react` 的同学可能会问：能用 `map` 吗？如果您的数组是`静态`的，则使用 `map` 没有任何问题。但是如果你在一个 `signal` 或 `响应属性`上循环，`map` 是低效的：如果数组因任何原因发生变化，整个 `map` 将重新运行，所有节点都将重新创建。

`<For>` 和 `<Index>` 都提供了比这更智能的循环解决方案 它们将每个渲染的节点与数组中的一个元素耦合在一起，因此当数组元素发生变化时，只有相应的节点会重新渲染。

`<Index>` 将通过索引做到这一点：每个节点对应于数组中的一个索引；`<For>` 将通过值来执行此操作：每个节点对应于数组中的一条数据。这就是为什么在回调中，`<Index>` 给你一个 `item` 的 `signal`：每个 `item` 的索引被认为是固定的，但该索引处的数据可以改变。另一方面，`<For>` 给你一个`索引 signal`：`item` 的内容被认为是固定的，但如果元素在数组中移动，它可以移动。

### For

```tsx
function App() {
  const [cats, setCats] = createSignal([
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	]);
  
  return (
    <ul>
      <For each={cats()}>{(cat, i) =>
        <li>
          <a target="_blank" href={`https://www.youtube.com/watch?v=${cat.id}`}>
			      {i() + 1}: {cat.name}
		      </a>
        </li>
      }</For>
    </ul>
  );
}
```
`solid` 中 `For` 的参数是`数据项`和`索引 Signal`，且是将每一个 `item的引用` 作为列表项更新时判断 `diff` 的依据。`For` 的 `item` 渲染是根据每一个 `item` 引用的变化来的：仅当某个 `item` 引用发生改变时，才会重新渲染该 `item` 项，而其他未发生改变的 `item`，则复用原来的组件。

同时注意，上面的用例，`For` 参数中的`cat`，是`非响应式`的，也即是，即使更新了某个 `item` 的某个 `key` 值，也不会导致 `UI` 更新：
```tsx
function App() {
  const [cats, setCats] = createSignal([
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	], {equals: false});
  
  return (
    <>
      <button onClick={() => {
        // 这里不会打印：cat.name: ，因为只是顺序改变，item 实际未改变，但是 UI 上会有更新
        setCats([cats()[1], cats()[0], cats()[2], ])
      }}>改变顺序</button>
      <button onClick={() => {
        const c = cats();
        c[0].name = 'changed';
        // 这两种形式，都没用，虽然会将实际的 cats() 更新为最新的值，但对于 cats() 返回的数组来说，每一项的引用还是原来的同一个。
        setCats([...c]);
        setCats(c);
       
      }}>改变属性</button>
      <ul>
        <For each={cats()}>{(cat, i) =>
          <li>
            <a target="_blank" href={`https://www.youtube.com/watch?v=${cat.id}`}>
              {i() + 1}: {(console.log('cat.name: ', cat.name), cat.name)}
            </a>
          </li>
        }</For>
      </ul>
    </>
  );
}
```
如果需要嵌套更新 `item` 的值到 `UI`上，那么需要创建 `嵌套 Signal` 或者 `使用 Store`。

### Index
在某些时候使用引用相等来比较行没有意义。在处理原始值或二维数组时，将值视为键可能会导致很多不必要的渲染。例如，如果我们将一个字符串列表映射到可以编辑每个字段的 `<input>` 字段，对该值的每次更改都会导致 `<input>` 被重新创建，因为它被视为唯一标识符。

在上述情况下，从概念上讲，`数组索引`是列表的`实际键`。为此，提供 `<Index>` 组件。
```tsx
function App() {
  const [cats, setCats] = createSignal([
		{ id: 'J---aiyznGQ', name: 'Keyboard Cat' },
		{ id: 'z_AbfPXTKms', name: 'Maru' },
		{ id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
	]);
  
  return (
    <ul>
      <Index each={cats()}>{(cat, i) =>
        <li>
          <a target="_blank" href={`https://www.youtube.com/watch?v=${cat().id}`}>
			      {i + 1}: {cat().name}
		      </a>
        </li>
      }</Index>
    </ul>
  );
}
```

### 动态组件
动态组件，`solid` 也是提供了面向组件的实现方案：
```tsx
import { render, Dynamic } from "solid-js/web";
import { createSignal, For } from "solid-js";

const RedThing = () => <strong style="color: red">Red Thing</strong>;
const GreenThing = () => <strong style="color: green">Green Thing</strong>;
const BlueThing = () => <strong style="color: blue">Blue Thing</strong>;

const options = {
  red: RedThing,
  green: GreenThing,
  blue: BlueThing
}
function App() {
  const [selected, setSelected] = createSignal("red");

  return (
    <>
      <select value={selected()} onInput={e => setSelected(e.currentTarget.value)}>
        <For each={Object.keys(options)}>{
          color => <option value={color}>{color}</option>
        }</For>
      </select>
      <Dynamic component={options[selected()]} />
    </>
  );
}
```
使用 Dynamic 指定 component 属性即可，并提供其余 props 作为组件 props。

### Portal， ErrorBoundary
`Portal, ErrorBoundary` 都是与 `react` 类似的，这里不细说。

---

## 生命周期
`solid` 中只有少量的生命周期。如：`onMount，onCleanup`

### onMount
`onMount` 只是一个特殊的 `effect` 调用：一旦所有初始渲染完成，它只会在组件中运行一次。同时，`生命周期仅在浏览器中运行`。

```tsx
function App() {
  const [photos, setPhotos] = createSignal([]);

	onMount(async () => {
		const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
		setPhotos(await res.json());
	});

  return <>
    <h1>Photo album</h1>

    <div class="photos">
      <For each={photos()} fallback={<p>Loading...</p>}>{ photo =>
        <figure>
          <img src={photo.thumbnailUrl} alt={photo.title} />
          <figcaption>{photo.title}</figcaption>
        </figure>
      }</For>
    </div>
  </>;
}
```
虽然上面的用例使用 `onMount` 来模拟请求，但通常还是使用 `createResource` api 来请求数据。

### onCleanup
由于 `Solid` 渲染树中的所有内容都存在于（可能是惰性的）`Effect` 中并且可以嵌套，因此将 `onCleanup` 设为一级方法。可以在任何范围内调用它，它会在该范围被触发以重新求值以及最终销毁时运行。

可以在组件或 `Effect` 中使用 `onCleanup`。在自定义指令中使用 `onCleanup`。 在响应式系统同步执行的任何地方都可以使用 `onCleanup`。
```tsx
function Counter() {
  const [count, setCount] = createSignal(0);

  const timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));

  return <div>Count: {count()}</div>;
}
```

## 绑定
### 事件
事件绑定与通常定义的 `jsx` 中的事件绑定是一致的：
```tsx
function App() {
  const [pos, setPos] = createSignal({x: 0, y: 0});

  function handleMouseMove(event) {
    setPos({
      x: event.clientX,
      y: event.clientY
    });
	}

  return (
    <div onMouseMove={handleMouseMove}>
      The mouse position is {pos().x} x {pos().y}
    </div>
  );
}
```
还支持了数组语法调用事件处理程序，避免创建额外的闭包：
```tsx
const handler = (data, event /*...*/) => {};
return <button onClick={[handler, data]}>Click Me</button>;
```

如果有需要支持其他大小写或不使用事件委托的情况，可以使用 `on:` 命名空间来匹配冒号后面的事件处理程序。
```tsx
let buttonRef;
<button ref={buttonRef} on:WierdEventName={() => /* Do something */} >Click Me</button>

onMount(() => {
  buttonRef.dispatchEvent(new Event('WierdEventName')); // 触发事件
})
```

### 样式
`Solid` 通过调用 `style.setProperty` 的封装来进行样式设置。这意味着`键需要采用破折号的形式`，如 `background-color` 而不是 `backgroundColor`。
```tsx
function App() {
  const [num, setNum] = createSignal(0);
  setInterval(() => setNum((num() + 1) % 255), 30)

  return (
    <div style={{
      color: `rgb(${num()}, 180, ${num()})`,
      "font-weight": 800,
      "font-size": `${num()}px`}}
    >
      Some Text
    </div>
  );
}
```

### classList

`Solid` 支持同时使用 `class` 和 `className` 来设置元素的 `className` 属性。然而，条件设置 `class` 可以给开发者提供便利。出于这个原因，`Solid` 提供一个内置的 `classList JSX 属性`，`classList` 接受一个对象，其中键是类名，值是一个布尔表达式。当为 `true` 时应用该 `class`，当为 `false` 时该 `class` 被移除。
```tsx
function App() {
  const [current, setCurrent] = createSignal("foo");

  return <>
    <button
	   classList={{selected: current() === 'foo'}}
	   onClick={() => setCurrent('foo')}
    >foo</button>
    <button
	    classList={{selected: current() === 'bar'}}
	    onClick={() => setCurrent('bar')}
    >bar</button>
    <button
	    classList={{selected: current() === 'baz'}}
	    onClick={() => setCurrent('baz')}
    >baz</button>
  </>;
}
```
还可以使用 `css模块` 中接收到的类型进行动态设置：
```tsx
import { active } from "./style.module.css";

<div classList={{ [active]: isActive() }} />;
```

### ref
在 `Solid` 中，你可以通过赋值获拿到元素的引用，比如：
```tsx
const myDiv = <div>My Element</div>;
```
但是，避免将元素拆分并将放在单个连续的 `JSX` 模板中是有好处的，因为这样可以让 `Solid` 更好地对元素创建进行优化。

与之类似地，在 `Solid` 中你可以使用 `ref` 属性获取元素的引用。对 `Ref` 进行赋值类似于上面的例子，赋值行为是在元素创建时，`在 DOM 被追加前发生的`。 只需声明一个`变量`，元素引用就会赋值给该变量。
```tsx
let myDiv;
<div ref={myDiv}>My Element</div>;
```

Refs 也可以采用回调函数的形式。这便于封装逻辑，尤其是当你不需要等到元素被追加时。
```tsx
<div ref={el => /* 处理 el... */}>My Element</div>
```


### ref转发
在很多情况下，可能希望将组件内部的 `ref` 暴露给父组件。我们仍然使用 `ref` 属性来实现。表面上看，在组件上使用 `ref` 与在原生元素上使用 `ref` 非常相似。你可以将要赋值的变量或回调函数传递给 `ref`。

但是，组件作者有义务将该引用连接到内部元素以将其转发回来。为此，我们使用了 `props.ref`。如果 `props.ref` 被定义了，那么这是一个`回调形式的 ref`，但是其中大部分细节是隐藏的，因为你很可能只是直接将 `ref` 分配给这个组件的 `JSX` 中的元素或其中组件之一。

```tsx
import Canvas from "./canvas";
function App() {
  let canvas;
  onMount(() => {
    // ...
  });

  return <Canvas ref={canvas} />;
}

// canvas.jsx
export default function Canvas(props) {
  return <canvas ref={props.ref} width="256" height="256" />;
}

```
正如例子上面的一段话所说，第一眼看来，`App` 中的 `ref canvas` 是反直觉的：子组件中没有一种魔法可以修改 `canvas` 的引用。按照我们的理解，如果没有某种魔法，`canvas` 变量要么是 `undefined`，要么是 `Canvas 实例`，但该演示中， `canvas` 变量却指向 `canvas 画布元素`。我们来看下编译后的代码：
```js
function App() {
  let canvas;
  onMount(() => {
    // ...
  });
  return _$createComponent(Canvas, {
    ref(r$) {
      const _ref$ = canvas;
      typeof _ref$ === "function" ? _ref$(r$) : canvas = r$;
    }
  });
}
```
看到这里，就明白了：`ref` 转发到组件，这一行为来源于编译器的支持。手动执行了 `canvas = r$`，这才改变了引用。这种行为被我们称为：**语法糖**。

### 扩展
有时你的组件和元素会接收可变数量的属性，将所有属性作为对象而不是单独传递就很有必要了。在组件中包装 `DOM` 元素时尤其如此，这是制作设计系统时的常见实践。

为此，我们使用扩展运算符 `...` 如：`<Info {...pkg} />`

### 指令
`Solid` 通过 `use:` 命名空间支持自定义指令。但这只是 `ref` 一个有用的`语法糖`，类似于原生的绑定，并且可以在同一个元素上有多个绑定而不会发生冲突。`solid` 中的指令有点 `vue` 的那味：
```tsx
import clickOutside from "./click-outside";
function App() {
  const [show, setShow] = createSignal(false);

  return (
    <Show
      when={show()}
      fallback={<button onClick={(e) => setShow(true)}>Open Modal</button>}
    >
      <div class="modal" use:clickOutside={() => setShow(false)}>
        Some Modal
      </div>
    </Show>
  );
}

// click-outside.jsx
import { onCleanup } from "solid-js";

export default function clickOutside(el, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
```

## Props
`Props` 是一个在函数组件执行时传递进来的对象，其中包含了调用组件时绑定到 JSX 上的所有属性。`Props` 对象是只读的，并且含有封装为对象 `getter` 的响应式属性。它们具有一致的形式，无论调用者是使用 `Signal`、`Signal 表达式`还是`简单值`或`静态值`。 你只需通过 `props.propName` 访问它们。

正因如此，请时刻记住`不能直接解构`它们，这会导致被解构的值脱离追踪范围从而失去响应性。通常，在 `Solid` 的 `primitive` 或 `JSX` 之外访问 `props` 对象上的属性可能会失去响应性。除了解构，像是扩展运算以及 `Object.assign` 这样的函数也会导致失去响应性。

### 默认props
`Solid` 有一些工具函数可以帮助我们处理 `props`。 第一个 `mergeProps` 函数听起来很像它名字描述得那样 `合并 props`。`mergeProps` 将潜在的响应式对象合并而不会失去响应式性。最常见的情况就是是为组件设置默认 props。

```tsx
import { mergeProps } from "solid-js";

export default function Greeting(props) {
  const merged = mergeProps({ greeting: "Hi", name: "John" }, props);
  return <h3>{merged.greeting} {merged.name}</h3>
}

// app.jsx

function App() {
  const [name, setName] = createSignal();

  return <>
    <Greeting greeting="Hello" />
    <Greeting name="Jeremy" />
    <Greeting name={name()} />
    <button onClick={() => setName("Jarod")}>Set Name</button>
  </>;
}
```

### 分离 Props
`合并 props` 并不是我们唯一要做的操作。我们经常使用解构来在当前组件上使用一些 props，然后将其他 props 分离出来传递给子组件。

为此，Solid 提供了 `splitProps`。它接收一个 props 对象以及一个 props 对象的键数组。返回一个数组，数组第一个元素是与入参键数组对应的对象。数组中的最后一个元素会是一个未指定的键名的 props 对象，`类似于剩余参数`。

```tsx
export default function Greeting(props) {
  const [local, others] = splitProps(props, ["greeting", "name"]);
  return <h3 {...others}>{local.greeting} {local.name}</h3>
}
```

### children
Solid 如此高性能的部分原因是 Solid 的组件基本上只是函数调用。我们通过编译器将潜在的响应式表达式包装在对象 getter 中来传播更新。可以想象编译器输出：
```jsx
// 输入
<MyComp dynamic={mySignal()}>
  <Child />
</MyComp>

// 输出
MyComp({
  get dynamic() { return mySignal() },
  get children() { return Child() }
});
```
这意味着这些 props 会被惰性求值。props 的访问将被推迟到某些地方有用到它们。这保留了响应性，而不会引入无关的封装代码或同步行为。然而，这意味着存在子组件或元素的情况下，重复访问可能会导致重新创建。

大多数情况下，你只是将这些入参属性插入到 JSX 中，所以不会有问题。但是由于 children 元素可能会被重复创建，所以当你处理 children 时需要格外小心。

出于这个原因，Solid 提供了 children 工具函数。此方法既会根据 children 访问创建 memo 缓存，还会处理任何嵌套的子级响应式引用，以便可以直接与 children 交互。

在示例中，我们有一个动态列表，我们希望设置它们的 color 样式属性。如果我们直接与 props.children 交互，不仅会多次创建节点，还会发现 children 本身是一个从 `<For>` 返回的 `Memo` 函数。

```jsx
export default function ColoredList(props) {
  const c = children(() => props.children);
  createEffect(() => c().forEach(item => item.style.color = props.color));
  return <>{c()}</>
}
```

---

## Store

### 内嵌响应性
`Solid` 可以独立处理`嵌套更新`原因之一是它提供了`细粒度响应式`。你可以有一个用户列表，当我们更新一个名字时，我们只更新 `DOM` 中的`一个位置`，而不会对列表本身进行差异对比。很少有（甚至是响应式）UI 框架可以做到这一点。

怎么理解上面的话呢？举两个例子：
```tsx
function ReactComponent() {
  const [list, updateList] = useState([{
    name: '1',
  }]);

  return <div>
    <button onClick={() => {
      updateList([{
        name: '2',
      }])
    }}>修改第一项的name</button>
    {
      list.map((i, idx) => <span>{i.name}</span>)
    }
  </div>;
}
```
`react` 版本下，要更新某一个 `item` 的字段值，就需要更新 `state`，而更新 `state`，就会生成新的组件，然后走 diff, patch 的流程。最终可能导致更新整个组件的DOM。

```vue
<script>
export default {
  data() {
    return {
      list: [
        {
          name: '1',
        },
        {
          name: 'will rerender',
        }
      ]
    }
  },
  methods: {
	  click() {
      this.list[0].name = '2';
    }    
  }

}
</script>

<template>
  <button @click="click">
    修改第一项的name
  </button>
  <div v-for="item in list">
    {{ (console.log(item), item.name) }}
  </div>
</template>
```
在 `vue2` 版本中，点击按钮来更新第一项的 `name` 属性，原意也仅是更新第一项，但实际上同样会执行整个 `template` 的重新渲染，因此未被改变的第二项，同样会被重新渲染。


在示例中，我们在一个 `Signal` 中存放待办事项列表。为了将待办事项标记为完成，我们需要用克隆对象替换旧的待办事项。大多数框架都是这种工作方式，但是当我们重新进行列表差异对比并重新创建 `DOM` 元素时，这无疑是一种浪费，正如 `console.log` 中所示。
```tsx
const [todos, setTodos] = createSignal([])
const addTodo = (text) => {
  setTodos([...todos(), { id: ++todoId, text, completed: false }]);
}
const toggleTodo = (id) => {
  setTodos(
    todos().map((todo) => (todo.id !== id ? todo : { ...todo, completed: !todo.completed })),
  );
};
```
很明显，我们仅仅是想更新一个字段时，却将该 item 对应的整个 DOM 节点替换了，这不是我们期望的。

相反，在像 Solid 这样的细粒度库中，我们使用`嵌套的 Signal` 初始化数据，如下所示：
```tsx
const [todos, setTodos] = createSignal([])
const addTodo = (text) => {
  const [completed, setCompleted] = createSignal(false);
  setTodos([...todos(), { id: ++todoId, text, completed, setCompleted }]);
};
const toggleTodo = (id) => {
  const index = todos().findIndex((t) => t.id === id);
  const todo = todos()[index];
  if (todo) todo.setCompleted(!todo.completed())
}
```
可能又有人要说了，为什么可以在 `handler` 里使用 `createSignal` ？`react` 中的 `useXXX` 都必须是在顶级呀！没错，这是差异点：`react` 中需要根据调用顺序来确认相关的 `state` 和 `effect`，但 `solid` 中，这些仅仅被称为 **响应式数据**，它只是说明该引用是响应式的，可以在任意地方使用。

这个新版本的细粒度的响应性方案中，更新某个 `item` 的某个字段值，不会导致列表的整体更新，也不会导致依赖该 item 的 DOM 的替换更新，仅仅是`更新了该DOM依赖该字段值的子DOM`。


### 创建 Store
`Store` 是 `Solid` 处理嵌套响应式给出回答。Store 是代理对象，其属性可以被跟踪，并且可以包含其他对象，这些对象会自动包装在代理中，等等。

为了让事情变得简单，Solid 只为在跟踪范围内访问的属性创建底层 `Signal`。因此，Store 中的所有 Signal 都是根据要求`延迟创建`的。

`createStore` 函数接收一个初始值并返回一个类似于 `Signal 的读/写元组`。第一个元素是只读的 `store` 代理，第二个元素是 `setter` 函数。

让我们看看使用 Store 实现嵌套响应性有多容易。我们可以用这个替换我们组件的初始化代码：

```tsx
const [store, setStore] = createStore({ todos: [] });
const addTodo = (text) => {
  setStore('todos', (todos) => [...todos, { id: ++todoId, text, completed: false }]);
};
const toggleTodo = (id) => {
  setStore('todos', (t) => t.id === id, 'completed', (completed) => !completed);
};
```
利用 `Store`，可以实现类似 `Vue` 中深层监听的功能。但又有不同：`vue` 中某个对象的键值改变，会导致整个 `template` 重新渲染，而 `solid` 只更新依赖该 item 的 该 key 的子 DOM 部分。

### 修改 Store
Solid 强烈建议使用浅层不可变模式来更新状态。通过分离读写，我们可以更好地控制系统的响应性，而不会遭遇经过组件层传递后丢失变更跟踪代理。与 Signal 相比，使用 Store 适用范围更广。

然而，有时，突变更容易推理。这就是为什么 Solid 提供了一个受 Immer 启发的 `produce store` 修饰符的原因，它可以让你在 setStore 调用中改变 Store 对象的可写代理版本。

这是一个很好的工具，可以在不放弃控制的情况下允许小范围的突变。让我们在 Todos 示例中使用 produce，将事件处理程序代码替换为：
```tsx
const addTodo = (text) => {
  setStore(
    'todos',
    produce((todos) => {
      todos.push({ id: ++todoId, text, completed: false });
    }),
  );
};
const toggleTodo = (id) => {
  setStore(
    'todos',
    todo => todo.id === id,
    produce((todo) => (todo.completed = !todo.completed)),
  );
};
```

虽然带有 Store 配合 produce 可以处理绝大多数情况，但 Solid 也可以用 `createMutable` 创建一个可变的 Store 对象。虽然不是内部 API 所推荐的方法，但有时用来与第三方系统进行互操作或兼容很有用。

### Context
和所有主流 UI 框架一样， Solid 同样提供了 `Context` 的支持。
```tsx
// main.jsx
import { render } from "solid-js/web";
import Nested from "./nested";
import { CounterProvider } from "./counter";

function App() {
  return <>
    <h1>Welcome to Counter App</h1>
    <Nested />
  </>
};

render(() => (
  <CounterProvider count={1}>
    <App />
  </CounterProvider>
), document.getElementById("app"));
// main.jsx end


// nested.jsx
import { useCounter } from "./counter";

export default function Nested() {
  const [count, { increment, decrement }] = useCounter();
  return (
    <>
      <div>{count()}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
};
// nested.jsx end


// counter.jsx
import { createSignal, createContext, useContext } from "solid-js";
const CounterContext = createContext();

export function CounterProvider(props) {
  const [count, setCount] = createSignal(props.count || 0),
    store = [
      count,
      {
        increment() {
          setCount(c => c + 1);
        },
        decrement() {
          setCount(c => c - 1);
        }
      }
    ];

  return (
    <CounterContext.Provider value={store}>
      {props.children}
    </CounterContext.Provider>
  );
}

export function useCounter() { return useContext(CounterContext); }
```

### 不可变 Store
这一节主要是描述与第三方不可变库交互。略。


### 不使用 Context
`Context` 适合用来做数据存储。Context 处理注入，将所有权与响应图联系起来，自动管理销毁，并且鉴于 Solid 的细粒度渲染，而且没有渲染开销。

但是，你也可以直接将响应式系统用于简单的场景。尽管几乎没有指出的必要，但一个简单的`可写 Store` 确实就是一个 `Signal`：

```tsx

import { createSignal } from 'solid-js';

export default createSignal(0);

// 别的地方的代码
import counter from './counter';
const [count, setCount] = counter;
```
Solid 的响应性是一个普遍的概念。它跟是内部组件还是外部组件都没有关系。全局状态和局部状态没有不同的概念。都是一样的。

唯一的限制是所有计算（Effect/Momo）都需要在响应顶层即 —— `createRoot` 下创建。Solid 的 render 会自动执行此操作。所以当你使用包含计算的复杂全局 Store 时，一定要调用 createRoot。 或者更好的选择是出于为了方便使用 Context。

---

## 响应性

### 批量更新
与 `react / vue` 不同，这两者的更新是放在同一个任务中的：同一任务中的多次更新，最终只会触发一次重新渲染。Solid 的响应式是同步的，这意味着在任何变更后的下一行 DOM 都会更新。在大多数情况下，这完全没问题，因为 Solid 的粒度渲染只是更新在响应式系统中的传播。渲染两次无关的更改实际上并不意味着浪费性能。

如果更改是相关的怎么办？Solid 的 `batch` 工具函数允许将多个更改推入队列，然后在通知观察者之前同时使用它们。在批处理中更新的信号值直到批处理完成才会提交。

在这个例子中，我们在按钮点击时分配了两个名字，触发了渲染更新两次。单击该按钮后，可以在控制台中看到日志。因此，让我们将 set 调用打包成一个批次。
```tsx
 const updateNames = () => {
  console.log("Button Clicked");
  batch(() => {
    setFirstName(firstName() + "n");
    setLastName(lastName() + "!");
  })
}
```
就是这样。现在整个变更集只会通知一次。

### 忽略跟踪
有时希望 `Signal` 读取行为不被跟踪，即使在响应式上下文中也是如此 Solid 提供了 `untrack` 工具函数来避免包装计算跟踪任何读取行为。

在示例中，假设我们不想在 b 更改时输出日志。我们可以通过将 Effect 更改为以下内容来取消跟踪 b Signal：

```tsx
createEffect(() => {
  console.log(a(), untrack(b));
});
```
由于 Signal 是函数，可以直接传递，但 untrack 可以包装具有行为更复杂的函数。

即使 `untrack` 禁用了对读取的跟踪，但对写入并通知观察者并没有影响。

### 监听
为方便起见，Solid 提供一个 on 工具函数，可以为我们的计算设置显式依赖。这主要用来更明确地简洁地声明跟踪哪些信号。然而，它也允许计算不立即执行而只在第一次更改时运行。可以使用defer 选项启用此功能。

让 Effect 只在 a 更新时运行，并推迟到值发生变化时执行。
```tsx
createEffect(on(a, (a) => {
  console.log(a, b());
}, { defer: true }));
```

---

## 异步

### 懒加载组件
大多数打包器（如 `Webpack、Rollup、Parcel、Vite`）在使用动态导入时会自动进行代码分割处理。Solid 的 `lazy` 方法允许包装组件的动态导入来实现延迟加载。然后输出一个可以在 JSX 模板中正常使用的组件，它会在第一次渲染时在内部动态加载底层导入的代码，此时会暂停渲染分支直到代码可用。 

```tsx
import { render } from "solid-js/web";
import { lazy } from "solid-js";

const Greeting = lazy(() => import("./greeting"));

function App() {
  return (
    <>
      <h1>Welcome</h1>
      <Greeting name="Jake" />
    </>
  );
}
```

### 资源
`Resource` 是专门设计用于处理异步加载的`特殊 Signal`。它提供了一种包装异步值方法，使得异步值在 Solid 的分布式执行模型中易于交互。与提供顺序执行模型的 async/await 或 generators 相反。Resource 的目标是让异步不再阻塞执行并且`不会给我们的代码染色`。

生成的 `Resource Signal`，还包含响应式 `loading` 和 `error` 属性，可以根据当前状态轻松控制我们的视图。

```tsx
const fetchUser = async (id) =>
  (await fetch(`https://swapi.dev/api/people/${id}/`)).json();

const App = () => {
  const [userId, setUserId] = createSignal();
  const [user] = createResource(userId, fetchUser);

  return (
    <>
      <input
        type="number"
        min="1"
        placeholder="Enter Numeric Id"
        onInput={(e) => setUserId(e.currentTarget.value)}
      />
      <span>{user.loading && "Loading..."}</span>
      <div>
        <pre>{JSON.stringify(user(), null, 2)}</pre>
      </div>
    </>
  );
};
```

从 createResource 返回的第二个值包含一个 `mutate` 方法，用于直接更新内部 Signal ，另外还有一个 `refetch` 方法，即使源没有改变，也可以用它来重新加载当前查询请求。
```tsx
const [user, { mutate, refetch }] = createResource(userId, fetchUser);
```

### Suspense
虽然 `lazy` 和 `createResource` 可以单独使用，但 Solid 还提供了一种机制来协调多个异步事件的显示。Suspense 作为一个边界，可以在这些异步事件未完成时显示回退占位而不是部分加载的内容。

Suspense 可以通过消除过多的中间和部分加载状态导致的视觉卡顿来改善用户体验。Suspense 自动侦测所有子级异步读取并相应地采取行动。你可以根据需要嵌套尽可能多的 Suspense 组件，并且只有最近的祖先会在检测到加载状态时转换为回退。

```tsx
const Greeting = lazy(async () => {
  // simulate delay
  await new Promise(r => setTimeout(r, 1000))
  return import("./greeting")
});

function App() {
  return (
    <>
      <h1>Welcome</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Greeting name="Jake" />
      </Suspense>
    </>
  );
}
```
需要注意的是，触发 `Suspense` 的是`异步派生值的读取`，不是异步获取行为本身。**如果在 Suspense 边界下未读取资源 Signal（包括 lazy 组件），Suspense 将不会挂起**。这是说，如果组件内未使用 `createResource, lazy` 等api，那么不会导致 children 组件的挂起，会直接渲染子组件。如：
```tsx
const App = () => {
  const [tab, setTab] = createSignal(0);
  const updateTab = (index) => () => setTab(index);

  return (
    <>
      <div class="tab">
        <Suspense fallback={<div class="loader">Loading...</div>}>
          <Switch>
            <Match when={tab() === 0}>
              <Child page="Uno" />
            </Match>
            <Match when={tab() === 1}>
              <Child page="Dos" />
            </Match>
            <Match when={tab() === 2}>
              <Child page="Tres" />
            </Match>
          </Switch>
        </Suspense>
      </div>
    </>
  );
};

const CONTENT = {
  Uno: `1`,
  Dos: '2'
  Tres: `3`
};

function createDelay() {
  return new Promise((resolve) => {
    const delay = Math.random() * 420 + 160;
    setTimeout(() => resolve(delay), delay);
  });
}

const Child = (props) => {
  const [time] = createResource(createDelay);

  return (
    <div class="tab-content">
      This content is for page "{props.page}" after {time()?.toFixed()}ms.
      <p>{CONTENT[props.page]}</p>
    </div>
  );
};
```
如果在 Child 组件中没有使用 `createResource`, 那么App中的 `Suspense` 组件将不会有挂起的机会。

### Suspense List
某些时候你可能有多个要协调的 Suspense 组件。一种方法是将所有内容都放在一个 Suspense 下，但这将子组件限制成单一的加载行为。单一的回退状态意味着一切都需要等到最后一件事被加载。所以，Solid 引入了 `SuspenseList` 组件来协调这些组件。

考虑像我们的例子一样有多个 Suspense 组件。如果我们将 SuspenseList 的 revealOrder 属性配置为 forwards 来包裹内容，子组件将按照它们在树中出现的顺序呈现，而不管它们加载的顺序。这减少了页面跳转。 你可以将 revealOrder 设置为 backwards 或 together，backwards 将反转组件展示顺序，together 则会等待所有 Suspense 组件加载完毕。此外，还有一个 tail 选项可以设置为 hidden 或 collapsed。这会覆盖显示所有回退的默认行为，要么不显示，要么显示按照 revealOrder 设置的方向显示下一个。

```tsx
<SuspenseList revealOrder="forwards" tail="collapsed">
  <ProfileDetails user={props.user} />
  <Suspense fallback={<h2>Loading posts...</h2>}>
    <ProfileTimeline posts={props.posts} />
  </Suspense>
  <Suspense fallback={<h2>Loading fun facts...</h2>}>
    <ProfileTrivia trivia={props.trivia} />
  </Suspense>
</SuspenseList>
```

### Transition
Suspense 允许我们在加载数据时显示回退内容。在初始化加载时非常有用，但在后续导航中，回退到骨架屏通常是更糟糕的用户体验。

我们可以通过使用 useTransition 来避免回到回退状态。useTransition 提供了一个包装器和一个加载的指示器。包装器将所有下游更新放在一个事务中，该事务在所有异步事件完成之前不会提交。

这意味着当控制流暂停时，它会在离屏渲染时继续显示当前分支。现有边界下的资源读取会被添加到过渡(transition)中。但是，任何新的嵌套 Suspense 组件如果在进入视图之前尚未完成加载，则会显示回退内容。

```tsx
const App = () => {
  const [tab, setTab] = createSignal(0);
  const [pending, start] = useTransition();
  const updateTab = (index) => () => start(() => setTab(index));

  return (
    <>
      <ul class="inline">
        <li classList={{ selected: tab() === 0 }} onClick={updateTab(0)}>
          Uno
        </li>
        <li classList={{ selected: tab() === 1 }} onClick={updateTab(1)}>
          Dos
        </li>
        <li classList={{ selected: tab() === 2 }} onClick={updateTab(2)}>
          Tres
        </li>
      </ul>
      <div class="tab" classList={{ pending: pending() }}>
        <Suspense fallback={<div class="loader">Loading...</div>}>
          <Switch>
            <Match when={tab() === 0}>
              <Child page="Uno" />
            </Match>
            <Match when={tab() === 1}>
              <Child page="Dos" />
            </Match>
            <Match when={tab() === 2}>
              <Child page="Tres" />
            </Match>
          </Switch>
        </Suspense>
      </div>
    </>
  );
};
```

useTransition 返回一个挂起的信号指示器和一个开始过渡(transition)的方法，这两个返回值囊括了我们的状态更新。

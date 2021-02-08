---
title: ts 泛型深入
date: 2021-02-08 16:53:50
tags: typescript
categories: typescript
---


**关键词**：

- keyof、typeof
- T extends any ? U : Y
- infer
- 协变、抗变、双变、不变（最后一个本文没提到，参考文章中有）


## 一来就 show you code~


如果下面这些都能看懂且理解，那么恭喜你，你不用继续看本文了，see you next time 😄 ~~
```ts
// 这几个是根据官网的用例，自己写的，貌似跟官方的基本一致
type MyPartial<T> = {[U in keyof T]?: T[U]};
type MyReadonly<T> = {readonly [U in keyof T]: T[U]};
type MyRecord<K extends keyof any, V> = { [Key in K]: V}
type MyPick<Type, Keys extends keyof Type> = {[K in Keys]: Type[K]};
type MyExtract<Type, Union> = Union extends Type ? Union : never;
type MyNonNullable<Type> = Type extends void ? never : Type;
type MyParameters<Type extends (...args: any[]) => any> = Type extends (...args: infer I) => any ? (I) : never;
type MyConstructorParameters<Type> = Type extends new (...args: infer I) => any ? (I) : never;
type MyReturnType<Func> = Func extends (...args: any[]) => infer R ? R : never;
// 下面这些是文章 "ts 疑难杂症" 中拷贝过来的
type PromiseInnerType<T extends Promise<any>> = T extends Promise<infer P>
  ? P
  : never
// string
type Test = PromiseInnerType<Promise<string>>
// 联合类型改为交叉类型
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never
// { a: string } | { b: number } => { a: string } & { b: number }
type Test = UnionToIntersection<{ a: string } | { b: number }>
type Prettify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never
// { a: string; b: number; c: boolean }
type Param = Prettify<{ a: string } & { b: number } & { c: boolean }>
```

如果有一两个不懂的，那么请点击目录快速进入你想瞅一下的~

---

<!-- more -->

## keyof、typeof
这两个关键字比较基础了，两种姿势简单了解一下：

1. [keyof 官网介绍](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator)，[typeof 官网介绍](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
2. 听我简单逼逼一下~~

### keyof
获取类型 T 的所有 key 的类型**集合**（注意我变重了，返回的是**集合**）。

```ts
type Point = { x: number; y: number };
type P = keyof Point;
//   ^ x | y  Point 只有两个 key
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
//   ^number | string   为啥？
type KeyOfAny = keyof any;
//   ^ string | number | symbol   啊？
```

Mapish 中并没有 number，M 为啥是 number | string ？因为 js 中：


```ts
const obj = {};
// 你可以 数 着访问
obj[0];
// 还可以 串 着访问
obj['0']
```

KeyOfAny 为啥是这个结果？keyof 本身作为获取一个对象的所有 key 类型的关键字，本身是针对对象的。而访问一个对象，自然可以通过这3种 key 来访问。So ，就这样了。也可以参考这个[问题](https://stackoverflow.com/questions/55535598/why-does-keyof-any-have-type-of-string-number-symbol-in-typescript)。

### typeof
注意需要跟 js 内置的 typeof 区分开。ts 中的 typeof 后跟一个具体值，用于获取这个值的类型：
```ts
let s = "hello";
let n: typeof s;
//  ^string
let f = (name: string) => {
    return 1;
};
type TypeF = typeof f;
//   ^(name: string) => number
```

比较简单，不多缩~

---

## extends
这里说的 extends 不是 interface、class 的继承，而是泛型相关骚操作中 extends ~

最早的泛型 extends 是在 ts1.8 中引入的，[链接](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html#type-parameters-as-constraints)在这。 最开始这个是用来限制泛型类型的。

```ts
function assign<T extends U, U>(target: T, source: U): T {
  for (let id in source) {
    target[id] = source[id];
  }
  return target;
}
let x = { a: 1, b: 2, c: 3, d: 4 };
assign(x, { b: 10, d: 20 });
assign(x, { e: 0 }); // Error
```

用于限制泛型类型是比较简单的，但结合其他东西，就有点东西了，往下~



在 [ts 2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#conditional-types) 中引入了 **Conditional Types** ，这里建议大家还是读一下文档，很重要！我这辅助翻译一下，表喷翻译能力~~：

> 条件类型 T extends U ? X : Y 会被直接推导为 X 或者 Y，也可能由于条件依赖更多的类型而被推迟推导。是否直接推导或者延迟推导，取决于：
> 1. 首先，给定类型 T' 和 U'，他们分别是类型 T 和 U 的实例（如果 T、U 有类型参数，用 any 替换），如果 T' 不能被分配给 U'，那么有条件类型最终被推导为 Y。直觉上，如果 T 的最大化实例都不能分配给 U 的最大化实例，那么我们会直接推导为 Y。
> 2. 接下来，对于 U 中的推断(infer 关键字)声明引入的每个类型变量，通过从T推断到U（使用与泛型函数的类型推断相同的推断算法）来收集一组候选类型。对于给定的推断类型 V，如果有任意候选类型从协变位置推断出，那么推断类型 V 是这些候选类型的并集；不然，如果有任意候选从抗变位置推断出，推断类型 V 是这些候选类型的交集；否则，类型V 就是 never。
> 3. 然后，给定一个类型 T 的实例 T''，其中所有推断类型变量都替换为上一步中推断的类型V，如果T''绝对能分配给U，那么推导为 X。除了没考虑类型变量以外，绝对分配关系与常规的分配关系一致。直觉上来说，当一个类型绝对能分配到另一个类型上时，我们说它能分配到那些类型的所有实例上。
> 4. 最后，条件类型依赖更多的类型变量，那么类型推导被推迟。


其实不太好理解是不是？还是看栗子比较容易懂。（协变位置、抗变位置这个概念在 infer 一节中说哈，这里先忽略）



我们可以先只看第一点，后面的2、3、4都是针对 infer 的（还是拿官网的栗子）：

```ts
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
type T0 = TypeName<string>; // "string"
type T1 = TypeName<"a">; // "string"
type T2 = TypeName<true>; // "boolean"
type T3 = TypeName<() => void>; // "function"
type T4 = TypeName<string[]>; // "object"
```

- T0 中，string extends string 为 true，所以返回 'string'；
- T1 中，'a' 是 string 的一个实例化，就是第一点中说的T'，此时U'是所有字符串的实例化代表，所以 'a' 肯定能婚配给 string，所以返回 'string'；
- T2 中， 同理，true 是 boolean 的实例化，So~
- T3 - T4，同理 too。


可以顺着看一下分布条件类型，再看 infer~



### Distributive conditional types
[文档】(https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)


我把这个分布条件类型也放入 extends 小节里。

> 被选中的类型为裸类型参数的条件类型称为分布式条件类型（即没有被诸如数组，元组或者函数包裹）。 实例化期间，分布条件类型自动分布在联合类型上。 例如，T extends U ? X : Y，类型参数为 A | B | C ，的 T 解析为(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)

```ts
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;
type T20 = Boxed<string>; // BoxedValue<string>;
type T21 = Boxed<number[]>; // BoxedArray<number>;
type T22 = Boxed<string | number[]>; // BoxedValue<string> | BoxedArray<number>;
type T23 = Boxed<string> | Boxed<number[]>; // BoxedValue<string> | BoxedArray<number>;
```

T22 联合类型，就等于分开后再联合，就等于 T23。

需要注意的是 BoxedArray<T[number]> 这种写法：因为 T 已经有了 any[] 的基类型，说明 T 肯定是一个数组。是数组的话，就可以用 number 类型的索引去访问，比如T[0]、T[1]等，因此也可以写成 BoxedArray<T[0]> 。不过也有差异，写成 T[0] 的形式，就明确只要 0索引的类型；写成 T[number]，就表明需要所有类型的联合类型。这点需要注意。



狙一翻三，如果是对象类型的话：

```ts
type Boxed2<T> = T extends Record<string, number> ? BoxedArray<T[string]> : BoxedValue<T>;
type T24 = Boxed2<{[key: string]: number}> // BoxedArray<number>
type T25 = Boxed2<{[key: string]: string}> // BoxedArray<{[key: string]: string}>
```

## infer
同样是 [ts2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types) 提出的。

infer 关键字只能在 extends 语句中使用，表明一个需要推导的类型。对同一个类型可以进行多次 infer 推导。

比如，2.8中新增的 ReturnType:

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

ReturnType用于获取一个函数的返回类型，上面的意思是：如果 T 可以分配给 (...args: any[]) => infer R 这种类型的函数的话，那么返回类型 R，否则返回 any。在这里返回用了infer R 代表需要推断类型 R。



同样，也能“无限 extends”，比如：

```ts
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
```



**本文高潮** 要来了，大家别叫啊！

### 协变位置推导

下面的例子阐释了：在**协变位置**对于**同一个类型变量**的**多个候选类型**如何推导出一个**联合类型**。（你丑，这里这么多个 bold 文字，是不是很重要？）看不懂？没关系，后面要说。



还是官方的例子：

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T10 = Foo<{ a: string; b: string }>; // string
type T11 = Foo<{ a: string; b: number }>; // string | number
```

看这里，Foo 判断 T是否可婚配给 { a: infer U; b: infer U }，这里 U 是 key a 和 b的推导类型。

T10 中的 a 和 b 都是 string，哦耶，Foo 就直接是 string，no problem！

T11 中的 a 是string 和 b 是 number，哦耶，Foo 就直接是 string 和 number 的联合类型（也就是string | number）！为啥？因为就是ts2.8中的 infer 就这么设计的！！！



这里需要先说明一下：**对象型类型都可当做是协变类型**。（具体原因看一下参考文章，有兴趣的看下就 O98K）

### 抗变位置推导

在**抗变位置**对于**同一个类型变量**的**多个候选类型**如何推导出一个**交集类型**。（注意区别于协变位置的联合类型）

```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```

- T20 中的 a、b的类型都是(x: string) => void ，所以 Bar 推导 x 的类型时（不是非要与原函数的参数名一致哈，不要误解），U 都是 string，no doubt！
- T21 中 a 中 x类型是 string，b 的是 number，但是 infer 的参数类型 U都是同一个，那么最终该是啥类型？哦不对，不该问，上面都写了。。。不过为啥是 string & number （其实就等于 never）呢？为啥？因为就是ts2.8中的 infer 就这么设计的！！！



这里需要先说明一下：函数型类型都可当做是抗变类型。



关于函数的抗变类型，这里有个相关的说明：

--strictFunctionTypes 标志位。这个 flag 是 [ts2.6](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#strict-function-types) 引入的，通过设置该严格位，将默认的双向协变改为抗协变。即，针对函数类型，不再使用默认的双向协变。但是这里不是说，关了这个标志位，会对上面的结论产生影响，并不会，因为函数默认是双向协变的，因此本身也是抗变的。



关于双向协变，也可以通过下面的参考来了解。


有了上面协变和抗变的基础理解，UnionToIntersection 介玩意儿就好理解了！

--- 

## UnionToIntersection（墙裂建议瞅一哈）
有点远，抄一遍代码：

```ts
// 联合类型改为交叉类型
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never
// { a: string } | { b: number } => { a: string } & { b: number }
type Test = UnionToIntersection<{ a: string } | { b: number }>
```

如果是直接跳到这的，而且不知道**分布式条件状态、 infer、协变位置、抗变位置**这几个词，那么请点击目录稍微学习下~



// 等待10分钟后......



Then，我们都知道了上面几个词的意思，可以来剖析这个工具类了：

1. U extends any ? 那必须滴啊！TS 中啥都可以婚配给 any！所以，现在变成了：(k: U) => void extends ((k: infer I) => void) ? I : never
2. 返回类型 = I' => {a: string} | I'' => {b: number} （注意，这里不是分布式条件类型，分布式条件类型需要的是裸类型）
3. 此时 I被推导出两个类型！怎么处理？第1步中，我们发现，它把本身是对象类型的类型{ a: string } | { b: number } 转为了一个函数的参数类型，没毛病吧？从一个函数推导类型，是满足抗变位置推导的，对吧？抗变位置推导，最终类型是：没错，你答对了，是交集！所以最终返回类型 = I' => {a: string} & I'' => {b: number} = {a: string} & {b: number} = {a: string; b: number}


上面的分析可以搭配：https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286 一起看看。

## 参考
神马是协变与抗协变：what-are-covariance-and-contravariance

ts 中的协变、抗变、双变，不变是神马：https://zhuanlan.zhihu.com/p/143054881

ts 疑难杂症：https://zhuanlan.zhihu.com/p/82459341

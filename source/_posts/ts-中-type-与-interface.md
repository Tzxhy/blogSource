---
title: ts 中 type 与 interface
date: 2019-04-06 11:46:12
tags:
- type
- interface
categories: TypeScript
---

## 
type属于别名，和 interface 在很多地方一致，除了：
1. interface 方式可以实现接口的 extends 和 implements ， 而 type alias 则不行。
2. interface 可以实现接口的 merge ，但 type alias 则不行。

```ts
interface C {
    a: string;
}
interface C {
    b: number; // 这里会 merge 在一起
}
const obj:C = {
    a: '',
}; // Error: Type '{ a: string; }' is not assignable to type 'C'.  Property 'b' is missing in type '{ a: string; }'.

type C =  {
    a: string;
}
// Error:  Duplicate identifier 'C'.
type C =  {
    b: number;
}
```

---
title: js规范--赋值
date: 2019-04-07 22:22:46
tags:
- js grammar
categories: ES
---

今天遇到一个小问题：
```ts
let id: number = 0;
const arr: number[] = [];
arr[id] = ++id;
console.log(arr); // ?
```
当时我以为是：[undefined, 1]，而实际是[1]。
理解原理就是查看文档：

> The production AssignmentExpression : LeftHandSideExpression = AssignmentExpression is evaluated as follows:

> 1. Let lref be the result of evaluating LeftHandSideExpression.
> 2. Let rref be the result of evaluating AssignmentExpression.
> 3. Let rval be GetValue(rref).
> 4. Throw a SyntaxError exception if the following conditions are all true:
    > - Type(lref) is Reference is true
    > - IsStrictReference(lref) is true
    > - Type(GetBase(lref)) is Environment Record
    > - GetReferencedName(lref) is either "eval" or "arguments"
> 5. Call PutValue(lref, rval).
> 6. Return rval.

其实不用看后面，前面就说了，先求左值，再求右值。。
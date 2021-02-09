---
title: GraphQL入门-三
date: 2019-03-28 10:29:07
tags:
- GraphQL
categories: GraphQL
---
这篇讲 GraphQL 的其他内容。

# 验证
通过使用类型系统，能够预先确定一个 GraphQL 请求是否合法。这让服务器和客户端能有效地通知开发者一个 query 是否有效，而不用依赖运行时的检查。即在本地调试的时候，就能知道该请求是否符合 schema。代码详见https://graphql.github.io/learn/validation/ ,可以直接改变代码，来查看效果。

# 执行
GraphQL 的执行依赖于类型系统。来个例子：
```
type Query {
  human(id: ID!): Human
}

type Human {
  name: String
  appearsIn: [Episode]
  starships: [Starship]
}

enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Starship {
  name: String
}
```
为了描述当 query 执行时发生什么，用这个例子：
req:
```
{
  human(id: 1002) {
    name
    appearsIn
    starships {
      name
    }
  }
}
```
res:
```json
{
  "data": {
    "human": {
      "name": "Han Solo",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "starships": [
        {
          "name": "Millenium Falcon"
        },
        {
          "name": "Imperial shuttle"
        }
      ]
    }
  }
}
```

## 根字段和 resolver
每一个字段都用一个函数（就是 resolver 的概念，有点类似于 redux 的 reducer 的意味）来生成：
```
Query: {
  human(obj, args, context, info) {
    return context.db.loadHumanByID(args.id).then(
      userData => new Human(userData)
    )
  }
}
```
- obj 先前的对象，一般是上一层的值。对于根字段没有这个值。
- args 传递进来的参数
- context 环境信息
- info 当前请求的详细信息和 schema 信息。

## 异步 resolver
GraphQL 会等待异步的 resolver 返回后，再返回数据给前端。

## 普通 resolvers
当 Human 对象可访问后，GraphQL 的执行会继续下去：
```
Human: {
  name(obj, args, context, info) {
    return obj.name
  }
}
```
此时的 obj 是 Human 对象的值，因此简单返回该对象的 name 值即可。事实上，许多 GraphQL 库会让你忽略该简单实现：如果你没有定义该字段的 resolve，库会返回 obj[field]。

## 标量强制
如果默认地使用普通 resolver 的话，
```
Human: {
  appearsIn(obj) {
    return obj.appearsIn // returns [ 4, 5, 6 ]
  }
}
```
appearsIn返回的数字数组，而不是枚举值。怎么操作？

这是标量强制的例子。类型系统知道需要什么，会将值转换所需的类型。

## 列表 resolves
```
Human: {
  starships(obj, args, context, info) {
    return obj.starshipIDs.map(
      id => context.db.loadStarshipByID(id).then(
        shipData => new Starship(shipData)
      )
    )
  }
}
```
GraphQL 会等待 Promise List 完成后，才将数据返回。

## 生成结果
在每一个字段完成后，结果值将被放入一个键值对。

# 内省
能够去查看 GraphQL 的 Schema 能返回什么类型的数据是非常有用的。GraphQL 允许我们使用内省系统。


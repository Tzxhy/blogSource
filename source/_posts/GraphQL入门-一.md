---
title: GraphQL入门(2)
date: 2019-03-27 18:03:07
tags:
categories:
- GraphQL
---

上次说了 query 和 update ，这次说 schema 和 type 。
# Schema and Type
## 类型系统
以一个例子开始：
req:
```
{
  hero {
    name
    appearsIn
  }
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ]
    }
  }
}
```
会经历这些步骤：
1. 从特殊的『root』对象开始；
2. 选择 hero 字段；
3. 对于返回的字段 hero，我们选择 name 和 appearsIn 字段。

<!-- more -->
每一个 GraphQL 服务都定义了一系列的类型，它能完全描述你可以查询的数据。然后，当请求来了，它们被验证是否有效，然后根据 schema 返回数据。

## 对象类型和字段
最基础的组件是对象类型，代表一种你能从 service 中获取到的对象。如下定义：
```ts
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```
它非常易读。一起来理解一下：
- Charcter 是个 GraphQL 对象类型，代表着它包含一些字段。大部分的类型都是对象类型。
- name 和 appearsIn 都是 Character 类型的字段。意味着 任何操作如果需要 Character 类型对象的话，只会返回 name 和 appearsIn 这两个字段。
- String 是一个内建的标量类型。这些类型用于定义一个单标量对象，而不能有子选择。
- String! 表示该字段非空，GraphQL 一定能返回一个值。
- [Episode!]! 表示 Episode 对象的数组，同时不为空。

## 参数
每一个 GraphQL 对象类型的字段都能能有参数，比如：
```ts
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```
所有的参数都是具名的。length 字段定义了一个参数：unit。

参数可能是必须的，也可以是可选的。当是可选的时候，我们可以设置一个默认值：如果 unit 没有传递，会默认使用 METER。

## 查询和更新类型
在你的规格（schema） 中，大部分都将是普通的对象类型。但有两类是比较特殊的：
```
schema {
  query: Query
  mutation: Mutation
}
```
每一个 GraphQL 服务都一个 query 类型，可能会有 mutation（更新）类型。这些类型就像正常的对象类型一样，但也有特殊之处：他们定义了每一个 GraphQL 查询的入口点。比如:
req:
```
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2"
    },
    "droid": {
      "name": "C-3PO"
    }
  }
}
```
表明 GraphQL 需要一个 Query 类型，包含 hero 和 droid 字段。
```ts
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```
mutation 也是类似的，你需要定义 Mutation 类型，然后那些在 root 上可访问的用于更新的字段能够在请求中调用。

需要记住的是，除了『入口点』这个特殊的作用，Query 和 Mutation 就和其他对象类型一样。

## 标量类型
一个 GraphQL 对象类型有名字和字段，但有时字段会表示一些混合类型的数据。这就是为啥标量类型出现：它们表示了请求的其他信息。

在下面的例子中，name 和 appearsIn 字段会解析城标量类型：
req:
```
{
  hero {
    name
    appearsIn
  }
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ]
    }
  }
}
```
这些字段没有子字段，它们已经是请求的叶节点了（参照二叉树中的叶节点概念）。

GraphQL 提出了一些开箱即用的默认标量类型：
- Int 有符号的32位整数
- Float 有符号的双精度浮点数
- String UTF8编码的字符序列
- Boolean true 或者 false
- ID ID 标量类型代表了一个唯一的标志符，通常用于再次请求一个对象或者当做一份缓存的 key。ID 类型同样作为 String 被序列化。然而，明确把它定义为 ID 类型，表明它不是人类可读的。

在大量的 GraphQL 服务实现中，有一种方式去自定义标量类型。比如，定义一个 Date 类型：
> scalar Date

然后就由我们的实现去定义该类型如何被序列化、反序列化和验证。比如，你指定了 Date 类型应该总被序列化为一个整数时间戳，你的客户端也应该知道该字段的格式。

## 枚举类型
枚举值允许你：
1. 验证是否合法
2. 有限值。

定义枚举值的例子：
```ts
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```
这意味着，如果我们要使用 Episode，那么值必须是 NEWHOPE, EMPIRE, JEDI 之一。

## 列表和非空
```
type Character {
  name: String!
  appearsIn: [Episode]!
}
```
name 字段非空，表示 server 返回数据时该字段必须有值，否则会抛出一个错误，让客户端知道有错误产生。

非空 类型修饰符也可以用于参数定义，如果空值传递了，GraphQL Server 返回一个校验错误。

列表表示返回该数据类型的列表。

如果非空和列表组合在一起，比如 myFiled: [String!]  表示list 本身可以为 null，但不能有任何 null 元素。比如：
```
myField: null // valid
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // error
```

如果是这样：myField: [String]!  表示：
```
myField: null // error
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // valid
```

## 接口
一个接口是一个抽象类型，包含一些必须去实现的字段。
比如，你写了个 Character 接口，代表星际争霸三部曲中的任何人物：
```
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```
这表明实现 Character 的任何类型需要有这些明确的字段。

实现了 Character 的类型：
```
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```
可以发现这些类型中都有 character 接口的字段，但也带了额外的字段，比如 totalCredits、starships 和 primaryFunction。

当你想返回一个对象或者很多对象时，接口很有用，但也可能会使许多种不同的类型。

比如：
req:
```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    primaryFunction
  }
}

// variables:
{
  "ep": "JEDI"
}
```
res:
```json
{
  "errors": [
    {
      "message": "Cannot query field \"primaryFunction\" on type \"Character\". Did you mean to use an inline fragment on \"Droid\"?",
      "locations": [
        {
          "line": 4,
          "column": 5
        }
      ]
    }
  ]
}
```
hero 字段返回了 Character 类型，表示可能是 Human 或者 Droid 类型，取决于 episode 参数。在上面的例子中，你只能请求 Character 里有的字段，而不包含 primaryFunction。

为了请求子对象类型的字段，需要使用内联片段：
req:
```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
  }
}

// variables:
{
  "ep": "JEDI"
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "primaryFunction": "Astromech"
    }
  }
}
```

## 联合类型
联合类型和接口的概念非常相似，但是它们没有指定任何公共字段。
> union SearchReasult = Human | Droid | Starship

当我们在 schema 中返回了 SearchResult 类型，我们也许会得到 Human或者 Droid 或者 Starship 类型。注意联合类型的成员需要是混合对象类型，你不能在接口或者接口的联合之外创建联合类型。

在这种情况下，如果你请求了返回 SearchResult 联合类型的字段，你需要使用条件片段来查询字段：
req:
```
{
  search(text: "an") {
    __typename
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```
res:
```json
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo",
        "height": 1.8
      },
      {
        "__typename": "Human",
        "name": "Leia Organa",
        "height": 1.5
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1",
        "length": 9.2
      }
    ]
  }
}
```
__typename 字段解析为字符串，让客户端能辨别数据类型。

同样的，Human 和 Droid 共享了公共的接口（Character），你可以查询它们的公共字段：
req:
```
{
  search(text: "an") {
    __typename
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```
需要注意的是，虽然 Starship 里也有 name，但它不是 Character 的实现。

## 输入类型
目前为止，我们只讨论了传递标量值，比如枚举、字符串。但你也能传入复杂的对象。这在更新时尤为有用。在 GraphQL Schema 语言中，输入类型看起来就像正常的对象类型，除了把 type 变成 input：
```
input ReviewInput {
  stars: Int!
  commentary: String
}
```
可以在更新中这么使用：
req:
```
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}

// variables:
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```
res:
```json
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```
输入对象类型不能接收参数。










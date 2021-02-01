---
title: GraphQL入门(1)
date: 2019-03-26 18:26:51
tags:
- GraphQL
categories:
- GraphQL
---
[官网](https://graphql.github.io)，可以理解成翻译官方文档。在下篇中将来一发实战。
# 介绍
GraphQL是API查询语言，也是一个在服务端根据你定义的类型系统数据来执行查询的运行时。它并不与任何数据库或者存储引擎绑定。通过描述你需要的数据格式，返回对应的JSON数据，最大可能地减少多余字段以及请求数量。

<!-- more -->
# 查询和更新
## 字段
例子来一发：
req:
```txt
{
  hero {
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
    }
  }
}
```
直接描述你要的数据格式，然后返回相应的数据格式。字段可以不仅返回一个String，也可以是一个对象。下面这个例子，
req:
```txt
{
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```
这个例子， __friends__ 返回了一个数组。这是在 __schema__ 中定义的，后面会说。

## 参数
req:
```txt
{
  human(id: "1000") {
    name
    height
  }
}
```
res:
```json
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}
```
在像REST这样的系统中，你只能传递参数的一个集合：查询参数和URL中的参数。在GraphQL中，每一个字段和嵌套的对象都能得到它自己的一系列参数，使得GraphQL完全替代了多个API请求。你可以在标量上传入参数，在server端完成转换，而不用在客户端单独处理，再继续请求下一个API。如下：
req:
```txt
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```
res:
```json
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 5.6430448
    }
  }
}
```
参数可能会有非常多不同的类型。在上面的例子上，我们使用了一个枚举的类型，代表了有限集合的一个（本例中，长度的单位，METER或者FOOT）。GraphQL提出了一些默认的类型，但GraphQL服务器能定义自己的类型，只要它们能够被序列化到你的变换格式中。

## 别名
req:
```txt
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```
res:
```json
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```
这个例子中，我们是要查询多个hero的数据。由于js语法限制，一个对象中不能有同名的key，因此出现了别名的概念。使用empireHero/jediHero来代替hero。

## 片段
设想一下这样的场景：在上面的例子中，对hero使用了别名。这两个key都包含了name字段。如果此时需要多个字段，那么会这样写：
```txt
{
  empireHero: hero(episode: EMPIRE) {
    name
    key1
    key2
    key3
  }
  jediHero: hero(episode: JEDI) {
    name
    key1
    key2
    key3
  }
}
```
一下子就看出来其冗余。为了避免代码重复，引入了片段的概念。它类似于js的对象展开符号：...
req:
```txt
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```
res:
```json
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": [
        "NEWHOPE",
        "EMPIRE",
        "JEDI"
      ],
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```
下面的fragment定义也是建立在schame上的。

### 在片段中使用变量
req:
```txt
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```
query定义了一个变量first，类型为Int，默认值为3。在fragment中，friendsConnection传递了变量first，值为$first（即query定义的这个同名变量）。这样就实现了在fragment中使用变量。

## 操作名称
下面的例子中，使用 **query** 作为操作类型， **HeroNameAndFriends** 作为操作名称。
req:
```txt
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```
操作类型会是：query，mutaion，subscription和你要做的操作描述。操作类型是必须的，除非你使用查询的简略语法，也就是不用提供名称或者对于你操作的变量。

操作名称是针对你操作的明确的、有意义的名字。它只在多操作文档中必须。但是鼓励都写上操作名字，方便日志记录即错误追踪。

## 变量
很明显，对于很多接口我们都是有参数的。而如果把参数拼在请求req中的话，手动来拼凑，非常低效。相反地，GraphQL提供了query外的变量。

当我们开始使用变量，需要这3件事：
1. 替换query中的静态内容为$virableName
2. 声明$virableName为变量的一个值
3. 传递 varibleName: value 字典

req:
```txt
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}

// varibles: 
{
  "episode": "JEDI"
}
```

### 变量定义
在上面例子中，变量定义长得像：($episode: Episode)。列出所有变量，前缀为$，紧跟着类型，这里是Episode.

所有声明的变量都必须是标量、枚举值或者输入的对象类型。所以如果你想要传递一个复杂的对象给一个字段，你需要知道服务端能匹配的输入类型。详情看schema。

变量定义可能是可选的，也可能必须。在上面例子，引入在Episode类型后没有! 感叹号，它就是可选的。否则，必须提供。

### 默认变量
在类型后可以直接接上: = defaultValue。如下：
req:
```txt
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

## 指令
有时候我们会需要通过变量来决定query的结构。比如，有一个UI组件，有一个总结和详情的view，其中一个包含了更多的字段。

req:
```txt
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}

// variables:
{
  "episode": "JEDI",
  "withFriends": false
}
```
res:
```json
{
  "data": {
    "hero": {
      "name": "R2-D2"
    }
  }
}
```
如果把 withFriends 改为 true ，结果就会包含 withFriends 字段。

GraphQL的核心包括两个指令，任何对其的实现都必须支持这两个：
- @include(if: Boolean) 当argument为true时包含该字段
- @skip(if: Boolean) 当为true时跳过该字段。跟上面刚好相反。

## 更新
许多关于GraphQL的讨论关注在数据获取，但也需要一种方式去修改服务端的数据。

在 REST 中，任何请求都可能对服务器造成一些副作用，但传统来说，不要使用 **GET** 请求来修改数据。 GraphQL 也是类似的 --- 技术上来说，任何查询都被实现去造成数据的写入。然而，最好的方式是通过明确的更新来写入数据。

像query一样，如果更新字段返回了一个一个对象类型，你可以请求嵌套的字段。在一次更新后或者新的状态，这点非常有用。举个梨子：
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
这样就把传统的更新后再查询变成了，更新同时获取新的值，变为一次请求。

review变量不是一个标量，而是一个 __input object type__ 输入对象类型。同样是在 Schema 中定义。

### 更新多个字段
一次更新可以包含多个字段，就像查询一样。不过有个重要的区别是：
> 查询字段是并且执行，更新字段却是 **串行** 执行。一个完了，下一个才开始。

这表明如果我们在一个请求中发送了两个 incrementCredits 更新，第一个结束后，第二个才会开始，确保了不会存在竞态问题。

## 内联片段
像其他许多的类型系统一样，GraphQL 的 schema 也能够定义接口和联合类型。

如果你请求了一个返回一个接口或者联合类型的字段，你需要使用内联片段去访问底层具体类型的数据。举个梨子：
req:
```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
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
在这个请求中， **hero** 字段返回了 Character 类型，它可能是 Human 或者 Droid ，取决于 episode 参数。在这种情况下，你只能访问 Character 上存在的字段，比如 name 。

请求混合类型的字段，你需要用一个类型判断来使用 __内联片段__ 。因为第一个参数被标记为 ...on Droid， 字段 primaryFunction 只会在 Character 返回了 hero 是一个Dorid 才会被执行。同样的 height 对于 Human 类型。

在内联片段中也可以使用具名片段，即：
```
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      ...DroidFragment
    }
    ... on Human {
      height
    }
  }
}

fragment DroidFragment on Droid {
  primaryFunction
  model
}
```

### 元字段
鉴于这种情况：你不知道你会从GraphQL服务中返回什么类型的数据，你需要确定在客户端中怎么处理这些数据。GraphQL允许你是用 **__typename** ,一种元字段，可以写在query的任何地方。
req:
```
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
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
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
```
在上面的query中， search 返回了一个联合类型，可以是3种类型之一。如果不使用 **__typename** 字段，就不可能区分这几种类型。

GraphQL提供了不多的源字段，剩下的在 Introspection 系统中说明。

## 结束。即将开启 Schema 章节。


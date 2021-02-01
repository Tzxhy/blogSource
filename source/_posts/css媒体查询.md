---
title: css媒体查询
date: 2019-03-04 17:53:01
tags:
categories:
---

# css媒体查询

在写媒体查询的时候，顺序很重要。

- min相关的，必须从上到下的值依次递增。
- max相关的，必须从上到下的值依次递减。

原因：相同的权重，最后一条被选中。比如现在宽度750px，能匹配到第一条和第三条，最小值700px--最大值800px

```css
@media screen and (min-width: 700px) { /* 依次递增 */
  div.example {
	color: yellow;
  }
}
@media screen and (min-width: 800px) {
  div.example {
	color: white;
  }
}

@media screen and (max-width: 800px) { /* 依次递减 */
  div.example {
    background-color: green;
  }
}
@media screen and (max-width: 700px) {
  div.example {
	background-color: pink;
  }
}
```
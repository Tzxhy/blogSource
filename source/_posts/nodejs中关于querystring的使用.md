---
title: nodejs中关于querystring的使用
date: 2017-06-09 15:07:06
tags: nodejs querystring
---

# querystring

## 作用
The querystring module provides utilities for parsing and formatting URL query strings.
它可以解析和格式化URL的查询字符串。

### 方法
querystring.escape(str)
querystring.escape()方法以针对URL查询字符串的特定要求进行了优化的方式对给定的str执行URL百分比编码。
querystring.parse(str[, sep[, eq[, options]]])
将查询URL的参数解析为键值对对象。如'foo=bar&abc=xyz&abc=123'被解析为：
```javascript
{
  foo: 'bar',
  abc: ['xyz', '123']
}
```
querystring.stringify(obj[, sep[, eq[, options]]])
解析的逆过程
querystring.unescape(str)
编码的逆过程

---
title: nodejs中url模块的使用
date: 2017-06-15 17:58:04
tags: nodejs url
---

假如有一个地址为，
http://user:pass@host.com:8080/p/a/t/h?query=string#hash
## 属性
1. href
The full URL that was originally parsed. Both the protocol and host are lowercased.
Example: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
2. protocol
The request protocol, lowercased.
Example: 'http:'
3. host 
The full lowercased host portion of the URL, including port information.
Example: 'host.com:8080'
4. auth
The authentication information portion of a URL.
Example: 'user:pass'
<!-- more -->
5. hostname
Just the lowercased hostname portion of the host.
Example: 'host.com'
6. port
The port number portion of the host.
Example: '8080'
7. pathname
The path section of the URL, that comes after the host and before the query, including the initial slash if present.
Example: '/p/a/t/h'
8. search
The 'query string' portion of the URL, including the leading question mark.
Example: '?query=string'
9. path
Concatenation of pathname and search.
Example: '/p/a/t/h?query=string'
10. query
Either the 'params' portion of the query string, or a querystring-parsed object.
Example: 'query=string' or {'query':'string'}
11. hash
The 'fragment' portion of the URL including the pound-sign.
Example: '#hash'

## 方法
### url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
Take a URL string, and return an object.
Pass true as the second argument to also parse the query string using the querystring module. Defaults to false.

Pass true as the third argument to treat //foo/bar as { host: 'foo', pathname: '/bar' } rather than { pathname: '//foo/bar' } defaults to false.

### url.format(urlObj)
Take a parsed URL object, and return a formatted URL string.

href will be ignored.
protocol is treated the same with or without the trailing : (colon).
The protocols http, https, ftp, gopher, file will be postfixed with :// (colon-slash-slash).
All other protocols mailto, xmpp, aim, sftp, foo, etc will be postfixed with : (colon)
auth will be used if present.
hostname will only be used if host is absent.
port will only be used if host is absent.
host will be used in place of hostname and port
pathname is treated the same with or without the leading / (slash)
search will be used in place of query
query (object; see querystring) will only be used if search is absent.
search is treated the same with or without the leading ? (question mark)
hash is treated the same with or without the leading # (pound sign, anchor)

### url.resolve(from, to)
Take a base URL, and a href URL, and resolve them as a browser would for an anchor tag. Examples:
```javascript
url.resolve('/one/two/three', 'four')         // '/one/two/four'
url.resolve('http://example.com/', '/one')    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two') // 'http://example.com/two'
```
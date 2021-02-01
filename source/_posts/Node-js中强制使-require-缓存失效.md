---
title: Node.js中强制使 require 缓存失效
date: 2019-04-22 15:44:37
tags:
categories:
---
require.cache#
Added in: v0.3.0
<Object>
Modules are cached in this object when they are required. By deleting a key value from this object, the next require will reload the module. Note that this does not apply to native addons, for which reloading will result in an error.

Adding or replacing entries is also possible. This cache is checked before native modules and if a name matching a native module is added to the cache, no require call is going to receive the native module anymore. Use with care!
---
title: markdown语法
date: 2016-08-27 08:17:59
tags: 教程 markdown语法
---
Markdown是一种极简的『标记语言』，将文本转为HTML，通常为我大码农所用。其不追求大而全，简洁至上，正所谓不求最贵，只求最好！

本文介绍Markdown基本语法，内容很少，一行语法一行示例，学会后可轻松写出高大上的文档，再也不需要各种编辑器去调文章格式。另外，网上有各平台下的Markdown工具可用，也有在线的，我直接使用sublime搞定，Markdown本来就是为了追求简洁，弄个工具岂不多此一举。
<!--more-->
## 强调

星号与下划线都可以，单是斜体，双是粗体，符号可跨行，符号可加空格
\*\*一个人来到田纳西\*\*

\_\_毫无疑问\_\_
\*我做的馅饼
是全天下\*
\_最好吃的\_

**一个人来到田纳西**

__毫无疑问__
*我做的馅饼
是全天下*
_最好吃的_


## 分割线
三个或更多-_*，必须单独一行，可含空格

---
说啥呢.   分割线  "---"上一行要空行才可输入分割线, 若上一行有内容, 则变为小标题.

\-\-\-

## 引用
翻译成html就是<blockquote></blockquote>，符号后的空格可不要


\> 引用
内层符号前的空格必须要

\> 引用
 \>\> 引用中的引用
  \>\>\> 第三层



> 引用
内层符号前的空格必须要

> 引用
 >> 引用中的引用
  >>> 第三层

## 标题：Setext方式
 
三个或更多

大标题
<span>===</span>
小标题
\-\-\-
\# 一级标题
\#\# 二级标题
\#\#\# 三级标题
\#\#\#\# 四级标题
\#\#\#\#\# 五级标题
\#\#\#\#\#\# 六级标题 
 
大标题
===
小标题
---
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题 

## 无序列表
符号之后的空格不能少，-+*效果一样，但不能混合使用，因混合是嵌套列表，内容可超长

\- 无序列表
\- 无序列表
\- 无序列表
\- 无序列表：我很长。我也很长！那比一比啊？比就比！我有这么长，你有我长吗？我有这么这么长！好吧，你赢了！


- 无序列表
- 无序列表
- 无序列表
- 无序列表：我很长。我也很长！那比一比啊？比就比！我有这么长，你有我长吗？我有这么这么长！好吧，你赢了！

## 有序列表

数字不能省略但可无序，点号之后的空格不能少

\1. 有序列表
\2. 有序列表
\3. 有序列表
\4. 有序列表

1. 有序列表
2. 有序列表
3. 有序列表
4. 有序列表

## 嵌套列表
-+*可循环使用，但符号之后的空格不能少，符号之前的空格也不能少

- 嵌套列表
 + 嵌套列表
 + 嵌套列表
  - 嵌套列表
   * 嵌套列表
- 嵌套列表


## 文字超链：Inline方式
Tooltips可省略
\[不如\]\(http://bruce-sha.github.io "不如的博客"\)
[不如](http://bruce-sha.github.io "不如的博客")

## 图片超链
多个感叹号，Tooltips可省略，要设置大小只能借助HTML标记
\!\[GitHub Mark\]\(http://github.global.ssl.fastly.net/images/modules/logos_page/GitHub-Mark.png "GitHub Mark"\)
![GitHub Mark](http://github.global.ssl.fastly.net/images/modules/logos_page/GitHub-Mark.png "GitHub Mark")

## 索引超链：Reference方式
索引，1 2可以是任意字符

\[不如\]\[1\]
\!\[GitHub Octocat\]\[2\]

\[1\]:http://bruce-sha.github.io
\[2\]:http://github.global.ssl.fastly.net/images/modules/logos_page/Octocat.png

[不如][1]
![GitHub Octocat][2]

[1]:http://bruce-sha.github.io
[2]:http://github.global.ssl.fastly.net/images/modules/logos_page/Octocat.png

## 自动链接
尖括号

<span><http://ibruce.info>
<bu.ru@qq.com></span>

<http://ibruce.info>
<bu.ru@qq.com>

## 代码：行内代码
在第一行后指定编程语言，也可以不指定

<!--javascript-->

val s = "hello Markdown"
println( s )

## 代码：段落代码

每行文字前加4个空格或者1个Tab

val s = "hello Markdown"
println( s )
val s = "hello Markdown"
println( s )



	val s = "hello Markdown"
	println( s )
	val s = "hello Markdown"
	println( s )

## 代码：hexo
可指定编程语言，『』代表左右大括号

『% codeblock [title] [lang:language] [url] [link text] %』
	code snippet
『% endcodeblock %』

## 注释
用html的注释，好像只有这样？

<pre><!-- 注释 --></pre>

## 转义字符

用html的注释，好像只有这样？
Markdown中的转义字符为\，转义的有：
\\\\ 反斜杠
\\\` 反引号
\\\* 星号
\\_ 下划线
\\{\\} 大括号
\\[\\] 中括号
\\(\\) 小括号
\\\# 井号
\\\+ 加号
\\\- 减号
\\\. 英文句号
\\\! 感叹号


\\ 反斜杠
\` 反引号
\* 星号
\_ 下划线
\{\} 大括号
\[\] 中括号
\(\) 小括号
\# 井号
\+ 加号
\- 减号
\. 英文句号
\! 感叹号

## 其它
文本中可直接用html标签，但是要前后加上空行。
## one more thing：表格
Markdown的扩展语法，hexo不支持

|| *Year* || *Temperature (low)* || *Temperature (high)* ||
|| 1900 || -10 || 25 ||
|| 1910 || -15 || 30 ||
|| 1920 || -10 || 32 ||

首页不显示全文，底部有个阅读全文按钮，实现：
``` bash
//在md文档中想截断的段落前一行加下面一行代码
<!--more-->
```

1、首行缩进

写文章时，我们常常希望能够首行缩进，这时可以在段首加入&amp;ensp;来输入一个空格.加入&amp;emsp;来输入两个空格。
2、插入代码

插入代码的方式有两种

在每行代码前加入4个空格或者添加一个制表符（TAB键）
在代码两侧添加三个反引号‘```’。

两种方法都有需要注意的地方，很多入门文档未能提及。










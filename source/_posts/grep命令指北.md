---
title: grep命令指北
date: 2019-03-07 14:58:56
tags:
- 命令行
categories:
- linux
---

# grep命令指北


在上周的shell分享中，涛哥给我们展示了grep强大的文本搜索能力。鉴于自己对这一功能的不熟悉，于是利用周末时间赶紧补习。

grep命令用于从给定的多行数据中筛选出匹配的行。常用的egrep是grep -E的alias，fgrep是grep -F的alias。下面我以man grep中的解释以及自己的一些操作来说明其主要S操作。
<!-- more -->
定义：grep [OPTIONS] PATTERN [FILE...]   

grep [OPTIONS] [-e PATTERN]... [-f FILE]... [FILE...]

grep从FILES中查找匹配给定PATTERN的行。如果没有file指定，或者是用中划线 - ，grep会从标准输入中查找。默认grep会输出匹配到的行。同时上面说到的egrep和fgrep都是被弃用了的，只是考虑到后向兼容而提供的。

参数：

```bash
通用程序信息：
--help 显示帮助信息
-V, --version 显示grep的版本，然后退出


匹配模式选择：
-E， --extended-regexp 解释PATTERN为扩展正则表达式（ERE）
-F，--fixed-strings 解释PATTERN为一串固定的字符串（而不是正则表达式了），用换行符分个，每一个都会被匹配到
-G，--basic-regexp 解释PATTERN为基础正则表达式（BRE）。介个是默认的正则。
-P，--perl-regexp 解释PATTERN为Perl兼容的正则表达式（PCRE）。这是个实验属性。（为啥没有javascript兼容的）
```
举个-F的比方：

![grep](/images/grep-1.png)

这里使用-F，输入完第一个要匹配的后，回车，继续输入，输入完成后，输入表示结束的单引号。

```bash
匹配控制：
-e PATTERN, --regexp=PATTERN 使用PATTERN。如果被使用多次或者与-f结合使用，则会查所有pattern
-f FILE, --file=FILE 从FILE文件获取PATTERN（每个PATTERN为一行）。如果被多次使用或者与-e结合，则查所有pattern
-i, --ignore-case 忽略大小写
-v, --invert-match 输出不匹配的行
-w, --word-regexp 只选择匹配了PATTERN并且匹配到的单词必须是独立的单词。啥意思呢？就是说匹配到的行中该word的前后不能是字母、数字、下划线。下面打个例子。
-x，--line-regexp 只匹配 那些内容完全匹配PATTERN的行。有点相当于给PATTERN的前后加了个^$
```
![grep](/images/grep-2.png)

瞅一下，默认情况下，只要你这行有这些连续的字符串，就匹配。然后看加了-w的：

![grep](/images/grep-3.png)

看吧，加了-w的，最后一个my_name1并没有被匹配上，因为它不是一个独立的单词（前有下划线，后有数字，可怕）。

```bash
通用输出控制：
-c，--count 不输出匹配的行，而是输出匹配的行的数量。结合-v指令，输出不匹配的行数量
--color=WHEN，--colour=WHEN 对匹配的字符串进行终端着色。when可以是never、always、auto
-L，--files-withour-match 不输出匹配的行，而是输出没有任何匹配的文件的名称。对每个文件的扫描会在有第一次匹配时终止。
-l，--files-with-matches 对-L的取反，输出存在匹配内容的文件的名称。同样会在第一次匹配到时终止哟。
-m NUM，--max-count=NUM 在一个文件匹配到NUM个行时停止读取文件。在输出NUM行匹配的行后，会吐出一个上下文。这个上下文就是最后一次成功匹配的那一行的位置。这个东西下面讲-A，-B，-C的时候有用哦。尽请期待思密达。如果配合-v，则会输出NUM个不匹配的行。
-o，--only-matching 只打印匹配行中的匹配部分（非空）
-q，--quiet，--silent 不打印任何东西。如果有匹配，那么以状态0退出，如果没有匹配，则非零退出。
-s，--no-message 禁止错误信息输出到标准输出流。文件可能不存在或者不可读。
```


```bash
输出行前缀的控制：
-b，--byte-offset 输出该行到文件头（从零开始）的字节偏移。如果指定了-o，则偏移量为匹配到的字符串的偏移量
-H，--with-filename 输出每一行匹配到的行的文件来源。当超过了一个文件时，默认开启此命令。
-h，--no-filename 不输出。。。当只有一个文件，默认开启。。。
--label=LABEL 指定grep的输入流的标签。比如 gzip -cd foo.gz | grep  --label=foo  -H  something理解为gzip输出流pipe给grep，grep接收数据以label为依据。
-n，--line-number 从1开始，输出匹配到的行在整个文件中的第几行
-T，--initail-tab 对于-H，-b，-n的指令，将其前缀放在一个tab的中间显示。
-u，--unix-byte-offsets 报告unix风格的字节偏移量
-Z，--null 如果输出的是文件名，则将各个文件名之间的换行符去掉
```


```bash
上下文行控制：
-A NUM，--after-context=NUM 打印由-m指定的最后一次匹配的行的后NUM行。每个分组之间以两个中划线‘- -’分割
-B NUM，--before-context=NUM 打印由-m指定的最后一次匹配的行的前NUM行。分割。。
-A NUM，--context=NUM 打印由-m指定的最后一次匹配的行的前后NUM行。分割。。
上面三个，在指定了-o指令时不生效，并会产生警告。
```
举个例子：

![grep](/images/grep-4.png)

由上图，指定了-m为2，即匹配两次sb。然后吐出第1、9行的位置。-A会从第1、9行开始读取下面两行，打印出来。

```bash
文件和目录选择：
-a，--text 把一个二进制文件当作文本来处理。等同于--binary-files=text
--binary-files=TYPE 比较复杂，不忙说。
-D ACTION，--devices=ACTION
-d ACTION，--directories=ACTION
--exclude=GLOB
--exclude-from=FILE
--exclude-dir=DIR
-I
--include=GLOB
-r, --recursive 递归所有目录下的文件，如果在命令行中指定了软链接，才会去递归。等于-d recurse
-R，--dereference-recursive 在-r的基础上，除去了必须在命令行中指定软链接


其它选项：
--line-buffered 使用行缓存。可能有性能问题。
-U，--binary 把文件当作二进制数据。主要针对MS-DOS和MS-Windos来说，指定了这个，将不会默认开启对CR的清除。在其他平台上无效。
-z，--null-data 输入流的每行数据不以换行符为分割，而是以NUL字符为分割。
```

### 关于一点其他的骚操作：

取出关键字，剔除其它：
grep PATTERN -oP file
-o是仅输出匹配部分，-P是使用Perl正则（grep中只有这个可以使用零宽断言）


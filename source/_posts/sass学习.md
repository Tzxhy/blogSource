---
title: sass学习
date: 2016-10-22 19:47:36
tags:
---

# sass
## 编译风格
1, --style nested
``` bash
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```
<!--more-->
2, sass --watch test.scss:test.css --style expanded
``` bash
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```
3, sass --watch test.scss:test.css --style compact
4, sass --watch test.scss:test.css --style compressed

Sass 调试: sass --watch --scss --sourcemap style.scss:style.css.在 Sass3.3 版本之上（我测试使用的版本是 3.4.7），不需要添加这个参数也可以

## 基础
### [Sass]声明变量
声明变量的符号“$”
变量名称
赋予变量的值
``` bash
$brand-primary : darken(#428bca, 6.5%) !default; // #337ab7
$btn-primary-color : #fff !default;
$btn-primary-bg : $brand-primary !default;
$btn-primary-border : darken($btn-primary-bg, 5%) !default;
```
如果值后面加上!default则表示默认值。
### [Sass]普通变量与默认变量
普通变量：定义之后可以在全局范围内使用。
``` bash
$fontSize: 12px;
body{
	font-size:$fontSize;
}
```
默认变量：sass 的默认变量仅需要在值后面加上 !default 即可。
``` bash
$baseLineHeight:1.5 !default;
body{
	line-height: $baseLineHeight; 
}
```
sass 的默认变量一般是用来设置默认值，然后根据需求来覆盖的，覆盖的方式也很简单，只需要在默认变量之前重新声明下变量即可。
``` bash
$baseLineHeight: 2;
$baseLineHeight: 1.5 !default;
body{
	line-height: $baseLineHeight; 
}
```
编译后的css代码：
``` bash
body{
	line-height:2;
}
```
### [Sass]变量的调用
在 Sass 中声明了变量之后，就可以在需要的地方调用变量。调用变量的方法也非常的简单。
``` bash
.btn-primary {
	background-color: $btn-primary-bg;
	color: $btn-primary-color;
	border: 1px solid $btn-primary-border;
}
```
### [Sass]局部变量和全局变量
Sass 中变量的作用域在过去几年已经发生了一些改变。直到最近，规则集和其他范围内声明变量的作用域才默认为本地。如果已经存在同名的全局变量，从 3.4 版本开始，Sass 已经可以正确处理作用域的概念，并通过创建一个新的局部变量来代替。
先来看一下代码例子：
``` bash
//SCSS
$color: orange !default;//定义全局变量(在选择器、函数、混合宏...的外面定义的变量为全局变量)
.block {
  color: $color;//调用全局变量
}
em {
  $color: red;//定义局部变量
  a {
	color: $color;//调用局部变量
  }
}
span {
  color: $color;//调用全局变量
}
```
``` bash
//CSS
.block {
  color: orange;
}
em a {
  color: red;
}
span {
  color: orange;
}
```
上面的示例演示可以得知，在元素内部定义的变量不会影响其他元素。如此可以简单的理解成，全局变量就是定义在元素外面的变量，而定义在元素内部的变量，是一个局部变量。
我的建议，创建变量只适用于感觉确有必要的情况下。不要为了某些骇客行为而声明新变量，这丝毫没有作用。只有满足所有下述标准时方可创建新变量：
1. 该值至少重复出现了两次；
2. 该值至少可能会被更新一次；
3. 该值所有的表现都与变量有关（非巧合）。

### [Sass]嵌套-选择器嵌套
1、选择器嵌套
如果有：
``` bash
<header>
<nav>
    <a href=“##”>Home</a>
    <a href=“##”>About</a>
    <a href=“##”>Blog</a>
</nav>
<header>
```
想选中 header 中的 a 标签，在写 sCSS 会这样写：
``` bash
nav {
  a {
	color: red;
	header & {
		color:green;
	}
  }  
}
```
``` bash
nav a {
  color:red;
}

header nav a {
  color:green;
}
```
### [Sass]嵌套-属性嵌套
Sass 中还提供属性嵌套，CSS 有一些属性前缀相同，只是后缀不一样，比如：border-top/border-right，与这个类似的还有 margin、padding、font 等属性。假设你的样式中用到了：
``` bash
.box {
	border-top: 1px solid red;
	border-bottom: 1px solid green;
}
```
scss中可以这么写：
``` bash
.box {
  border: {
   top: 1px solid red;
   bottom: 1px solid green;
  }
}
```
注意border后面的冒号。
### [Sass]嵌套-伪类嵌套
其实伪类嵌套和属性嵌套非常类似，只不过他需要借助`&`符号一起配合使用。我们就拿经典的“clearfix”为例吧：
``` bash
.clearfix{
&:before,
&:after {
    content:"";
    display: table;
  }
&:after {
    clear:both;
    overflow: hidden;
  }
}
```
& 和冒号之间没有空格。
``` bash
clearfix:before, .clearfix:after {
  content: "";
  display: table;
}
.clearfix:after {
  clear: both;
  overflow: hidden;
}
```

选择器嵌套最大的问题是将使最终的代码难以阅读。开发者需要花费巨大精力计算不同缩进级别下的选择器具体的表现效果。
选择器越具体则声明语句越冗长，而且对最近选择器的引用(&)也越频繁。在某些时候，出现混淆选择器路径和探索下一级选择器的错误率很高，这非常不值得。

为了防止此类情况，我们应该尽可能避免选择器嵌套。然而，显然只有少数情况适应这一措施。
### [Sass]混合宏-声明混合宏
如果你的整个网站中有几处小样式类似，比如颜色，字体等，在 Sass 可以使用变量来统一处理，那么这种选择还是不错的。但当你的样式变得越来越复杂，需要重复使用大段的样式时，使用变量就无法达到我们目了。这个时候 Sass 中的混合宏就会变得非常有意义。
``` bash
@mixin border-radius{
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
```	
其中 @mixin 是用来声明混合宏的关键词，有点类似 CSS 中的 @media、@font-face 一样。border-radius 是混合宏的名称。大括号里面是复用的样式代码。
除了声明一个不带参数的混合宏之外，还可以在定义混合宏时带有参数，如：
``` bash
@mixin border-radius($radius:5px){
    -webkit-border-radius: $radius;
    border-radius: $radius;
}
```
上面是一个简单的定义混合宏的方法，当然， Sass 中的混合宏还提供更为复杂的，你可以在大括号里面写上带有逻辑关系，帮助更好的做你想做的事情,如：
``` bash
@mixin box-shadow($shadow...) {
  @if length($shadow) >= 1 {
    @include prefixer(box-shadow, $shadow);
  } @else{
    $shadow:0 0 4px rgba(0,0,0,.3);
    @include prefixer(box-shadow, $shadow);
  }
}
```
这个 box-shadow 的混合宏，带有多个参数，这个时候可以使用“ … ”来替代。简单的解释一下，当 $shadow 的参数数量值大于或等于“ 1 ”时，表示有多个阴影值，反之调用默认的参数值“ 0 0 4px rgba(0,0,0,.3) ”。
### [Sass]混合宏-调用混合宏
``` bash
button {
    @include border-radius;
}
```
@mixin 类似函数声明，@include 类似函数调用

### [Sass]混合宏的参数--传一个不带值的参数
在混合宏中，可以传递一个不带任何值得参数，比如：
``` bash
@mixin border-radius($radius){
  -webkit-border-radius: $radius;
  border-radius: $radius;
}
```
``` bash
.box {
  @include border-radius(3px);
}
```
注意，不传值会报错。

### [Sass]混合宏的参数--传一个带值的参数
在 Sass 的混合宏中，还可以给混合宏的参数传一个默认值，例如：
``` bash
@mixin border-radius($radius:3px){
  -webkit-border-radius: $radius;
  border-radius: $radius;
}
```
在混合宏“border-radius”传了一个参数“$radius”，而且给这个参数赋予了一个默认值“3px”。
在调用类似这样的混合宏时，会多有一个机会，假设你的页面中的圆角很多地方都是“3px”的圆角，那么这个时候只需要调用默认的混合宏“border-radius”:
``` bash
.btn {
  @include border-radius;
}
```
但有的时候，页面中有些元素的圆角值不一样，那么可以随机给混合宏传值，如：
``` bash
.box {
  @include border-radius(50%);
}
```
### [Sass]混合宏的参数--传多个参数
``` bash
@mixin center($width,$height){
  width: $width;
  height: $height;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -($height) / 2;
  margin-left: -($width) / 2;
}
```
调用：
``` bash
.box-center {
  @include center(500px,300px);
}
```
有一个特别的参数“…”。当混合宏传的参数过多之时，可以使用参数来替代，如：
``` bash
@mixin box-shadow($shadows...){
  @if length($shadows) >= 1 {
    -webkit-box-shadow: $shadows;
    box-shadow: $shadows;
  } @else {
    $shadows: 0 0 2px rgba(#000,.25);
    -webkit-box-shadow: $shadow;
    box-shadow: $shadow;
  }
}
```
### [Sass]混合宏的参数--混合宏的不足
混合宏在实际编码中给我们带来很多方便之处，特别是对于复用重复代码块。但其最大的不足之处是会生成冗余的代码块。比如在不同的地方调用一个相同的混合宏时。如：
``` bash
@mixin border-radius{
  -webkit-border-radius: 3px;
  border-radius: 3px;
}

.box {
  @include border-radius;
  margin-bottom: 5px;
}

.btn {
  @include border-radius;
}
```

### [Sass]扩展/继承
``` bash
//SCSS
.btn {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}

.btn-primary {
  background-color: #f36;
  color: #fff;
  @extend .btn;
}

.btn-second {
  background-color: orange;
  color: #fff;
  @extend .btn;
}
```
编译出来之后：
``` bash
//CSS
.btn, .btn-primary, .btn-second {
  border: 1px solid #ccc;
  padding: 6px 10px;
  font-size: 14px;
}

.btn-primary {
  background-color: #f36;
  color: #fff;
}

.btn-second {
  background-clor: orange;
  color: #fff;
}
```
从示例代码可以看出，在 Sass 中的继承，可以继承类样式块中所有样式代码，而且编译出来的 CSS 会将选择器合并在一起，形成组合选择器
### [Sass]占位符 %placeholder
Sass 中的占位符 %placeholder 功能是一个很强大，很实用的一个功能，这也是我非常喜欢的功能。他可以取代以前 CSS 中的基类造成的代码冗余的情形。因为 %placeholder 声明的代码，如果不被 @extend 调用的话，不会产生任何代码。来看一个演示：
``` bash
%mt5 {
  margin-top: 5px;
}
%pt5{
  padding-top: 5px;
}
```
这段代码没有被 @extend 调用，他并没有产生任何代码块，只是静静的躺在你的某个 SCSS 文件中。只有通过 @extend 调用才会产生代码：
``` bash
//SCSS
%mt5 {
  margin-top: 5px;
}
%pt5{
  padding-top: 5px;
}

.btn {
  @extend %mt5;
  @extend %pt5;
}

.block {
  @extend %mt5;

  span {
    @extend %pt5;
  }
}
```
编译出来的CSS
``` bash
//CSS
.btn, .block {
  margin-top: 5px;
}

.btn, .block span {
  padding-top: 5px;
}
```
从编译出来的 CSS 代码可以看出，通过 @extend 调用的占位符，编译出来的代码会将相同的代码合并在一起。这也是我们希望看到的效果，也让你的代码变得更为干净。

### [Sass]混合宏 VS 继承 VS 占位符
初学者都常常纠结于这个问题“什么时候用混合宏，什么时候用继承，什么时候使用占位符？”其实他们各有各的优点与缺点，先来看看他们使用效果：
混合宏：编译出来的 CSS 清晰告诉了大家，他不会自动合并相同的样式代码，如果在样式文件中调用同一个混合宏，会产生多个对应的样式代码，造成代码的冗余，这也是 CSSer 无法忍受的一件事情。不过他并不是一无事处，他可以传参数。
个人建议：如果你的代码块中涉及到变量，建议使用混合宏来创建相同的代码块。
继承：使用继承后，编译出来的 CSS 会将使用继承的代码块合并到一起，通过组合选择器的方式向大家展现，比如 .mt, .block, .block span, .header, .header span。这样编译出来的代码相对于混合宏来说要干净的多，也是 CSSer 期望看到。但是他不能传变量参数。

个人建议：如果你的代码块不需要专任何变量参数，而且有一个基类已在文件中存在，那么建议使用 Sass 的继承。
占位符：总结：编译出来的 CSS 代码和使用继承基本上是相同，只是不会在代码中生成占位符 mt 的选择器。那么占位符和继承的主要区别的，“占位符是独立定义，不调用的时候是不会在 CSS 中产生任何代码；继承是首先有一个基类存在，不管调用与不调用，基类的样式都将会出现在编译出来的 CSS 代码中。”
![chabie](images/diff_sass.png);

### [Sass]插值#{}
使用 CSS 预处理器语言的一个主要原因是想使用 Sass 获得一个更好的结构体系。比如说你想写更干净的、高效的和面向对象的 CSS。Sass 中的插值(Interpolation)就是重要的一部分。让我们看一下下面的例子：
``` bash
$properties: (margin, padding);
@mixin set-value($side, $value) {
    @each $prop in $properties {
        #{$prop}-#{$side}: $value;
    }
}
.login-box {
    @include set-value(top, 14px);
}
```
这是 Sass 插值中一个简单的实例。当你想设置属性值的时候你可以使用字符串插入进来。另一个有用的用法是构建一个选择器。可以这样使用：
``` bash
@mixin generate-sizes($class, $small, $medium, $big) {
    .#{$class}-small { font-size: $small; }
    .#{$class}-medium { font-size: $medium; }
    .#{$class}-big { font-size: $big; }
}
@include generate-sizes("header-text", 12px, 20px, 40px);
```
``` bash
.header-text-small { font-size: 12px; }
.header-text-medium { font-size: 20px; }
.header-text-big { font-size: 40px; }
```
第一个限制，这可能会很删除用于 Sass 变量的插值。你也不能在 mixin 中调用.
幸运的是，可以使用 @extend 中使用插值。例如：
``` bash
%updated-status {
    margin-top: 20px;
    background: #F00;
}
.selected-status {
    font-weight: bold;
}
$flag: "status";
.navigation {
    @extend %updated-#{$flag};
    @extend .selected-#{$flag};
}
```
### [Sass]注释
注释对于一名程序员来说，是极其重要，良好的注释能帮助自己或者别人阅读源码。在 Sass 中注释有两种方式，我暂且将其命名为：
  - 类似 CSS 的注释方式，使用 ”/* ”开头，结属使用 ”*/ ”
  - 类似 JavaScript 的注释方式，使用“//”
两者区别，前者会在编译出来的 CSS 显示，后者在编译出来的 CSS 中不会显示
### [Sass]数据类型
Sass 和 JavaScript 语言类似，也具有自己的数据类型，在 Sass 中包含以下几种数据类型：
  - 数字: 如，1、 2、 13、 10px；
  - 字符串：有引号字符串或无引号字符串，如，"foo"、 'bar'、 baz；
  - 颜色：如，blue、 #04a3f9、 rgba(255,0,0,0.5)；
  - 布尔型：如，true、 false；
  - 空值：如，null；
  - 值列表：用空格或者逗号分开，如，1.5em 1em 0 2em 、 Helvetica, Arial, sans-serif。
SassScript 也支持其他 CSS 属性值（property value），比如 Unicode 范围，或 !important 声明。然而，Sass 不会特殊对待这些属性值，一律视为无引号字符串 (unquoted strings)。
#### [Sass]字符串
SassScript 支持 CSS 的两种字符串类型：

  - 有引号字符串 (quoted strings)，如 "Lucida Grande" 、'http://sass-lang.com'；
  - 无引号字符串 (unquoted strings)，如 sans-serifbold。
在编译 CSS 文件时不会改变其类型。只有一种情况例外，使用 #{ }插值语句 (interpolation) 时，有引号字符串将被编译为无引号字符串，这样方便了在混合指令 (mixin) 中引用选择器名。
需要注意的是：当 deprecated = property syntax 时 （暂时不理解是怎样的情况），所有的字符串都将被编译为无引号字符串，不论是否使用了引号。
### [Sass]值列表
所谓值列表 (lists) 是指 Sass 如何处理 CSS 中： 
``` bash
margin: 10px 15px 0 0
```
或者： 
```
font-face: Helvetica, Arial, sans-serif
```
像上面这样通过空格或者逗号分隔的一系列的值。
Sass列表函数（Sass list functions）赋予了值列表更多功能（Sass进级会有讲解）：

1. nth函数（nth function） 可以直接访问值列表中的某一项；
2. join函数（join function） 可以将多个值列表连结在一起；
3. append函数（append function） 可以在值列表中添加值；
4. @each规则（@each rule） 则能够给值列表中的每个项目添加样式。
### [Sass运算]
程序中的运算是常见的一件事情，但在 CSS 中能做运算的，到目前为止仅有 calc() 函数可行。但在 Sass 中，运算只是其基本特性之一。在 Sass 中可以做各种数学计算，在接下来的章节中，主要和大家一起探讨有关于 Sass 中的数学运算。
#### [Sass运算]加法
加法运算是 Sass 中运算中的一种，在变量或属性中都可以做加法运算。如：
``` bash
.box {
  width: 20px + 8in;
}
```
``` bash
.box {
  width: 788px;
}
```
但对于携带不同类型的单位时，在 Sass 中计算会报错，如下例所示：
``` bash
.box {
  width: 20px + 1em;
}
```
编译的时候，编译器会报错：“Incompatible units: 'em' and ‘px'.”
#### [Sass运算]减法
Sass 的减法运算和加法运算类似，我们通过一个简单的示例来做阐述：
``` bash
$full-width: 960px;
$sidebar-width: 200px;

.content {
  width: $full-width -  $sidebar-width;
}
```
同样的，运算时碰到不同类型的单位时，编译也会报错。
#### [Sass运算]乘法
Sass 中的乘法运算和前面介绍的加法与减法运算还略有不同。虽然他也能够支持多种单位（比如 em ,px , %），但当一个单位同时声明两个值时会有问题。比如下面的示例：
``` bash
.box {
  width:10px * 2px;  
}
```
编译的时候报“20px*px isn't a valid CSS value.”错误信息。

如果进行乘法运算时，两个值单位相同时，只需要为一个数值提供单位即可。上面的示例可以修改成：
``` bash
.box {
  width: 10px * 2;
}
```
#### [Sass运算]除法
Sass 的乘法运算规则也适用于除法运算。不过除法运算还有一个特殊之处。众所周知“/”符号在 CSS 中已做为一种符号使用。因此在 Sass 中做除法运算时，直接使用“/”符号做为除号时，将不会生效，编译时既得不到我们需要的效果，也不会报错。一起先来看一个简单的示例：
``` bash
.box {
  width: 100px / 2;  
}
```
.box {
  width: 100px / 2;
}
这样的结果对于大家来说没有任何意义。要修正这个问题，只需要给运算的外面添加一个小括号( )即可：
``` bash
.box {
  width: (100px / 2);  
}
```
``` bash
.box {
  width: 50px;
}
```
除了上面情况带有小括号，“/”符号会当作除法运算符之外，如果“/”符号在已有的数学表达式中时，也会被认作除法符号。如下面示例：
.box {
  width: 100px / 2 + 0;  
}
另外，在 Sass 除法运算中，当用变量进行除法运算时，“/”符号也会自动被识别成除法，如下例所示：
``` bash
$width: 1000px;
$nums: 10;

.item {
  width: $width / 10;  
}

.list {
  width: $width / $nums;
}
```
综合上述，”/  ”符号被当作除法运算符时有以下几种情况：
  - 如果数值或它的任意部分是存储在一个变量中或是函数的返回值。
  - 如果数值被圆括号包围。
  - 如果数值是另一个数学表达式的一部分。

``` bash
//SCSS
p {
  font: 10px/8px;             // 纯 CSS，不是除法运算
  $width: 1000px;
  width: $width/2;            // 使用了变量，是除法运算
  width: round(1.5)/2;        // 使用了函数，是除法运算
  height: (500px/2);          // 使用了圆括号，是除法运算
  margin-left: 5px + 8px/2px; // 使用了加（+）号，是除法运算
}
```
Sass 的除法运算还有一个情况。我们先回忆一下，在乘法运算时，如果两个值带有相同单位时，做乘法运算时，出来的结果并不是我们需要的结果。但在除法运算时，如果两个值带有相同的单位值时，除法运算之后会得到一个不带单位的数值。如下所示：
``` bash
.box {
  width: (1000px / 100px);
}
```
出来的css：
``` bash
.box {
  width: 10;
}
```
### [Sass运算]变量计算
在 Sass 中除了可以使用数值进行运算之外，还可以使用变量进行计算，其实在前面章节的示例中也或多或少的向大家展示了。在 Sass 中使用变量进行计算，这使得 Sass 的数学运算功能变得更加实用。一起来看一个简单的示例：
``` bash
$content-width: 720px;
$sidebar-width: 220px;
$gutter: 20px;

.container {
  width: $content-width + $sidebar-width + $gutter;
  margin: 0 auto;
}
```
### [Sass运算]数字运算
在 Sass 运算中数字运算是较为常见的，数字运算包括前面介绍的：加法、减法、乘法和除法等运算。而且还可以通过括号来修改他们的运算先后顺序。和我们数学运算是一样的，一起来看个示例。
``` bash
.box {
  width: ((220px + 720px) - 11 * 20 ) / 12 ;  
}
```
### [Sass运算]颜色运算
所有算数运算都支持颜色值，并且是分段运算的。也就是说，红、绿和蓝各颜色分段单独进行运算。如：
``` bash
p {
  color: #010203 + #040506;
}
```
计算公式为 01 + 04 = 05、02 + 05 = 07 和 03 + 06 = 09， 并且被合成为：
``` bash
p {
  color: #050709;
}
```
算数运算也能将数字和颜色值 一起运算，同样也是分段运算的。
### [Sass运算]字符运算
在 Sass 中可以通过加法符号“+”来对字符串进行连接。例如：
``` bash
$content: "Hello" + "" + "Sass!";
.box:before {
  content: " #{$content} ";
}
```
``` bash
.box:before {
  content: " HelloSass! ";
}
```
除了在变量中做字符连接运算之外，还可以直接通过 +，把字符连接在一起：
``` bash
div {
  cursor: e + -resize;
}
```
``` bash
div {
  cursor: e + -resize;
}
```
注意，如果有引号的字符串被添加了一个没有引号的字符串 （也就是，带引号的字符串在 + 符号左侧）， 结果会是一个有引号的字符串。 同样的，如果一个没有引号的字符串被添加了一个有引号的字符串 （没有引号的字符串在 + 符号左侧）， 结果将是一个没有引号的字符串。 例如：
``` bash
p:before {
  content: "Foo " + Bar;
  font-family: sans- + "serif";
}
```
``` bash
p:before {
  content: "Foo Bar";
  font-family: sans-serif; }
```
### @if
@if 指令是一个 SassScript，它可以根据条件来处理样式块，如果条件为 true 返回一个样式块，反之 false 返回另一个样式块。在 Sass 中除了 @if 之，还可以配合 @else if 和 @else 一起使用。

假设要控制一个元素隐藏或显示，我们就可以定义一个混合宏，通过 @if...@else... 来判断传进参数的值来控制 display 的值。如下所示：
``` bash
//SCSS
@mixin blockOrHidden($boolean:true) {
  @if $boolean {
      @debug "$boolean is #{$boolean}";
      display: block;
    }
  @else {
      @debug "$boolean is #{$boolean}";
      display: none;
    }
}

.block {
  @include blockOrHidden;
}

.hidden{
  @include blockOrHidden(false);
}
```
``` bash
.block {
  display: block;
}

.hidden {
  display: none;
}
```
### @for循环
在制作网格系统的时候，大家应该对 .col1~.col12 这样的印象较深。在 CSS 中你需要一个一个去书写，但在 Sass 中，可以使用 @for 循环来完成。在 Sass 的 @for 循环中有两种方式：
``` bash
@for $i from <start> through <end>
@for $i from <start> to <end>
```
		$i 表示变量
    start 表示起始值
    end 表示结束值
这两个的区别是关键字 through 表示包括 end 这个数，而 to则不包括 end 这个数。
``` bash
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```
``` bash
.item-1 {
  width: 2em;
}

.item-2 {
  width: 4em;
}

.item-3 {
  width: 6em;
}
```
对to：
``` bash
@for $i from 1 to 3 {
  .item-#{$i} { width: 2em * $i; }
}
```
``` bash
.item-1 {
  width: 2em;
}

.item-2 {
  width: 4em;
}
```
@for应用在网格系统生成各个格子 class 的代码：
``` bash
//SCSS 
$grid-prefix: span !default;
$grid-width: 60px !default;
$grid-gutter: 20px !default;

%grid {
  float: left;
  margin-left: $grid-gutter / 2;
  margin-right: $grid-gutter / 2;
}
@for $i from 1 through 12 {
  .#{$grid-prefix}#{$i}{
    width: $grid-width * $i + $grid-gutter * ($i - 1);
    @extend %grid;
  }  
}
```
``` bash
.span1, .span2, .span3, .span4, .span5, .span6, .span7, .span8, .span9, .span10, .span11, .span12 {
  float: left;
  margin-left: 10px;
  margin-right: 10px;
}

.span1 {
  width: 60px;
}

.span2 {
  width: 140px;
}

.span3 {
  width: 220px;
}

.span4 {
  width: 300px;
}

.span5 {
  width: 380px;
}

.span6 {
  width: 460px;
}

.span7 {
  width: 540px;
}

.span8 {
  width: 620px;
}

.span9 {
  width: 700px;
}

.span10 {
  width: 780px;
}

.span11 {
  width: 860px;
}

.span12 {
  width: 940px;
}
```
### @while循环
@while 指令也需要 SassScript 表达式（像其他指令一样），并且会生成不同的样式块，直到表达式值为 false 时停止循环。这个和 @for 指令很相似，只要 @while 后面的条件为 true 就会执行。

这里有一个 @while 指令的简单用例：
``` bash
//SCSS
$types: 4;
$type-width: 20px;

@while $types > 0 {
    .while-#{$types} {
        width: $type-width + $types;
    }
    $types: $types - 1;
		//sass里赋值用冒号。
}
```
``` bash
.while-4 {
  width: 24px;
}

.while-3 {
  width: 23px;
}

.while-2 {
  width: 22px;
}

.while-1 {
  width: 21px;
}
```
### @each循环
@each 循环就是去遍历一个列表，然后从列表中取出对应的值。
@each 循环指令的形式：
@each $var in <list>
在下面的例子中你可以看到，$var 就是一个变量名，<list> 是一个 SassScript 表达式，他将返回一个列表值。变量 $var 会在列表中做遍历，并且遍历出与 $var 对应的样式块。这有一个 @each 指令的简单示例：
``` bash
$list: adam john wynn mason kuroir;//$list 就是一个列表

@mixin author-images {
    @each $author in $list {
        .photo-#{$author} {
            background: url("/images/avatars/#{$author}.png") no-repeat;
        }
    }
}

.author-bio {
    @include author-images;
}
```
``` bash
.author-bio .photo-adam {
  background: url("/images/avatars/adam.png") no-repeat; }
.author-bio .photo-john {
  background: url("/images/avatars/john.png") no-repeat; }
.author-bio .photo-wynn {
  background: url("/images/avatars/wynn.png") no-repeat; }
.author-bio .photo-mason {
  background: url("/images/avatars/mason.png") no-repeat; }
.author-bio .photo-kuroir {
  background: url("/images/avatars/kuroir.png") no-repeat; }
```
## Sass的函数简介
在 Sass 中除了可以定义变量，具有 @extend、%placeholder 和 mixins 等特性之外，还自备了一系列的函数功能。其主要包括：

  - 字符串函数
  - 数字函数
  - 列表函数
  - 颜色函数
  - Introspection 函数
  - 三元函数等
当然除了自备的函数功能之外，我们还可以根据自己的需求定义函数功能，常常称之为自定义函数。
### 字符串函数-unquote()函数
字符串函数顾名思意是用来处理字符串的函数。Sass 的字符串函数主要包括两个函数：
  - unquote($string)：删除字符串中的引号； - quote($string)：给字符串添加引号。
unquote() 函数主要是用来删除一个字符串中的引号，如果这个字符串没有带有引号，将返回原始的字符串。
注意：从测试的效果中可以看出，unquote( ) 函数只能删除字符串最前和最后的引号（双引号或单引号），而无法删除字符串中间的引号。如果字符没有带引号，返回的将是字符串本身。
quote() 函数刚好与 unquote() 函数功能相反，主要用来给字符串添加引号。如果字符串，自身带有引号会统一换成双引号 ""。
使用 quote() 函数只能给字符串增加双引号，而且字符串中间有单引号或者空格时，需要用单引号或双引号括起，否则编译的时候将会报错。
``` bash
.test1 {
    content:  quote(Hello Sass);
}
```
这样使用，编译器马上会报错。解决方案就是去掉空格，或者加上引号。
同时 quote() 碰到特殊符号，比如： !、?、> 等，除中折号 - 和 下划线_ 都需要使用双引号括起，否则编译器在进行编译的时候同样会报错。
### 字符串函数-To-upper-case()、To-lower-case()
To-upper-case()

To-upper-case() 函数将字符串小写字母转换成大写字母。如：
``` bash
//SCSS
.test {
  text: to-upper-case(aaaaa);
  text: to-upper-case(aA-aAAA-aaa);
}
```
``` bash
//CSS
.test {
  text: AAAAA;
  text: AA-AAAA-AAA;
}
```
To-lower-case() 函数 与 To-upper-case() 刚好相反，将字符串转换成小写字母。
### 数字函数简介
Sass 中的数字函数提要针对数字方面提供一系列的函数功能：
  - percentage($value)：将一个不带单位的数转换成百分比值；
  - round($value)：将数值四舍五入，转换成一个最接近的整数；
  - ceil($value)：将大于自己的小数转换成下一位整数；
  -  floor($value)：将一个数去除他的小数部分；
  - abs($value)：返回一个数的绝对值；
  - min($numbers…)：找出几个数值之间的最小值；
  - max($numbers…)：找出几个数值之间的最大值；
  - random(): 获取随机数

#### 数字函数-percentage()
percentage()函数主要是将一个不带单位的数字转换成百分比形式：
.footer{
    width : percentage(.2)
}
``` bash
.footer{
    width : 20%
}
```
如果您转换的值是一个带有单位的值，那么在编译的时候会报错误信息
#### 数字函数-round()函数
round() 函数可以将一个数四舍五入为一个最接近的整数
``` bash
.footer {
   width:round(12.3px)
}
```
``` bash
.footer {
  width: 12px;
}
```
#### 数字函数-ceil()函数
ceil() 函数将一个数转换成最接近于自己的整数，会将一个大于自身的任何小数转换成大于本身 1 的整数。也就是只做入，不做舍的计算：
``` bash
.footer {
   width:ceil(12.3px);
}
```
``` bash
.footer {
  width: 13px;
}
```
#### 数字函数-floor()函数
floor() 函数刚好与 ceil() 函数功能相反，其主要将一个数去除其小数部分，并且不做任何的进位。也就是只做舍，不做入的计算：
``` bash
.footer {
   width:floor(12.3px);
}
```
``` bash
.footer {
  width: 12px;
}
```
#### 数字函数-abs()函数
abs( ) 函数会返回一个数的绝对值。
``` bash
.footer {
   width:abs(-12.3px);
}
```
``` bash
.footer {
  width: 12.3px;
}
```
#### 数字函数-min()函数、max()函数
min() 函数功能主要是在多个数之中找到最小的一个，这个函数可以设置任意多个参数
不过在 min() 函数中同时出现两种不同类型的单位，将会报错误信息
max() 函数和 min() 函数一样，不同的是，max() 函数用来获取一系列数中的最大那个值
#### 数字函数-random()函数
random() 函数是用来获取一个随机数

### 列表函数简介
列表函数主要包括一些对列表参数的函数使用，主要包括以下几种：
  - length($list)：返回一个列表的长度值；
  - nth($list, $n)：返回一个列表中指定的某个标签值
  - join($list1, $list2, [$separator])：将两个列给连接在一起，变成一个列表；
  - append($list1, $val, [$separator])：将某个值放在列表的最后；
  - zip($lists…)：将几个列表结合成一个多维的列表；
  - index($list, $value)：返回一个值在列表中的位置值。
#### length()函数
length() 函数主要用来返回一个列表中有几个值，简单点说就是返回列表清单中有多少个值：
``` bash
>> length(10px)
1
>> length(10px 20px (border 1px solid) 2em)
4
>> length(border 1px solid)
3
```
length() 函数中的列表参数之间使用空格隔开，不能使用逗号，否则函数将会出错.
#### nth()函数
**nth($list,$n)**
nth() 函数用来指定列表中某个位置的值。不过在 Sass 中，nth() 函数和其他语言不同，1 是指列表中的第一个标签值，2 是指列给中的第二个标签值，依此类推。如：
``` bash
>> nth(10px 20px 30px,1)
10px
>> nth((Helvetica,Arial,sans-serif),2)
"Arial"
>> nth((1px solid red) border-top green,1)
(1px "solid" #ff0000)
```
注：在 nth($list,$n) 函数中的 $n 必须是大于 0 的整数.
#### join()函数
join() 函数是将两个列表连接合并成一个列表。
``` bash
>> join(10px 20px, 30px 40px)
(10px 20px 30px 40px)
>> join((blue,red),(#abc,#def))
(#0000ff, #ff0000, #aabbcc, #ddeeff)
>> join((blue,red),(#abc #def))
(#0000ff, #ff0000, #aabbcc, #ddeeff)
```
不过 join() 只能将两个列表连接成一个列表，如果直接连接两个以上的列表将会报错.
但很多时候不只碰到两个列表连接成一个列表，这个时候就需要将多个 join() 函数合并在一起使用:
``` bash
>> join((blue red), join((#abc #def),(#dee #eff)))
(#0000ff #ff0000 #aabbcc #ddeeff #ddeeee #eeffff)
```
在 join() 函数中还有一个很特别的参数 $separator，这个参数主要是用来给列表函数连接列表值是，使用的分隔符号，默认值为 auto。
建议大家使用 join() 函数合并列表项的时候就明确指定 $separator 参数.
#### append()函数
append() 函数是用来将某个值插入到列表中，并且处于最末位。
``` bash
>> append(10px 20px ,30px)
(10px 20px 30px)
>> append((10px,20px),30px)
(10px, 20px, 30px)
>> append(green,red)
(#008000 #ff0000)
>> append(red,(green,blue))
(#ff0000 (#008000, #0000ff))
```
当然，在 append() 函数中，可以显示的设置 $separator 参数，
如果取值为 comma 将会以逗号分隔列表项
如果取值为 space 将会以空格分隔列表项
#### zip()函数
zip()函数将多个列表值转成一个多维的列表：
``` bash
>> zip(1px 2px 3px,solid dashed dotted,green blue red)
((1px "solid" #008000), (2px "dashed" #0000ff), (3px "dotted" #ff0000))
```
在使用zip()函数时，每个单一的列表个数值必须是相同的.
#### index()函数
index() 函数类似于索引一样，主要让你找到某个值在列表中所处的位置。在 Sass 中，第一个值就是1，第二个值就是 2，依此类推：
``` bash
>> index(1px solid red, 1px)
1
>> index(1px solid red, solid)
2
>> index(1px solid red, red)
3
```
在 index() 函数中，如果指定的值不在列表中（没有找到相应的值），那么返回的值将是 false，相反就会返回对应的值在列表中所处的位置。
### Introspection函数
Introspection 函数包括了几个判断型函数：
  - type-of($value)：返回一个值的类型
  - unit($number)：返回一个值的单位
  - unitless($number)：判断一个值是否带有单位
  - comparable($number-1, $number-2)：判断两个值是否可以做加、减和合并.
#### Introspection 函数 -type-of()
type-of() 函数主要用来判断一个值是属于什么类型：

返回值：
  - number 为数值型。
  - string 为字符串型。
  - bool 为布尔型。
  - color 为颜色型
``` bash
>> type-of(100)
"number"
>> type-of(100px)
"number"
>> type-of("asdf")
"string"
>> type-of(asdf)
"string"
>> type-of(true)
"bool"
>> type-of(false)
"bool"
>> type-of(#fff)
"color"
>> type-of(blue)
"color"
>> type-of(1 / 2 = 1)
"string"
```
#### unit()函数
unit() 函数主要是用来获取一个值所使用的单位，碰到复杂的计算时，其能根据运算得到一个“多单位组合”的值，不过只充许乘、除运算：
``` bash
>> unit(100)
""
>> unit(100px)
"px"
>> unit(20%)
"%"
>> unit(1em)
"em"
>> unit(10px * 3em)
"em*px"
>> unit(10px / 3em)
"px/em"
>> unit(10px * 2em / 3cm / 1rem)
"em/rem"
```
但加、减碰到不同单位时，unit() 函数将会报错，除 px 与 cm、mm 运算之外.
#### unitless()函数
unitless() 函数相对来说简单明了些，只是用来判断一个值是否带有单位，如果不带单位返回的值为 true，带单位返回的值为 false：
``` bash
>> unitless(100)
true
>> unitless(100px)
false
>> unitless(100em)
false
>> unitless(100%)
false
>> unitless(1 /2 )
true
>> unitless(1 /2 + 2 )
true
>> unitless(1px /2 + 2 )
false
```
#### comparable()函数\
comparable() 函数主要是用来判断两个数是否可以进行“加，减”以及“合并”。如果可以返回的值为 true，如果不可以返回的值是 false
#### Miscellaneous函数
在这里把 Miscellaneous 函数称为三元条件函数，主要因为他和 JavaScript 中的三元判断非常的相似。他有两个值，当条件成立返回一种值，当条件不成立时返回另一种值：
``` bash
if($condition,$if-true,$if-false)
```
#### Map
Sass 的 map 常常被称为数据地图，也有人称其为数组，因为他总是以 key:value 成对的出现，但其更像是一个 JSON 数据。
``` bash
{
"employees": [
{ "firstName":"John" , "lastName":"Doe" },
{ "firstName":"Anna" , "lastName":"Smith" },
{ "firstName":"Peter" , "lastName":"Jones" }
]
}
```
对于 Sass 的 map，还可以让 map 嵌套 map。其实就是 map 的某一个 key 当成 map，里面可以继续放一对或者多对 key:value：
``` bash
$map: (
    key1: value1,
    key2: (
        key-1: value-1,
        key-2: value-2,
    ),
    key3: value3
);
```
map 的嵌套实用性也非常的强，大家可能有碰到过换皮肤的项目，可能每一套皮肤对应的颜色蛮多的，那么使用此功能来管理颜色的变量就非常的有条理性，便于维护与管理。你可以这样使用：
``` bash
$theme-color: (
    default: (
        bgcolor: #fff,
        text-color: #444,
        link-color: #39f
    ),
    primary:(
        bgcolor: #000,
        text-color:#fff,
        link-color: #93f
    ),
    negative: (
        bgcolor: #f36,
        text-color: #fefefe,
        link-color: #d4e
    )
);
```
### Sass Maps的函数
前面介绍了使用 map 来管理变量，但要在 Sass 中获取变量，或者对 map 做更多有意义的操作，我们必须借助于 map 的函数功能。在 Sass 中 map 自身带了七个函数：
  - map-get($map,$key)：根据给定的 key 值，返回 map 中相关的值。
  - map-merge($map1,$map2)：将两个 map 合并成一个新的 map。
  - map-remove($map,$key)：从 map 中删除一个 key，返回一个新 map。
  - map-keys($map)：返回 map 中所有的 key。
  - map-values($map)：返回 map 中所有的 value。
  - map-has-key($map,$key)：根据给定的 key 值判断 map 是否有对应的 value 值，如果有返回 true，否则返回 false。
  - keywords($args)：返回一个函数的参数，这个参数可以动态的设置 key 和 value。

#### Sass Maps的函数-map-get($map,$key)
map-get($map,$key) 函数的作用是根据 $key 参数，返回 $key 在 $map 中对应的 value 值。如果 $key 不存在 $map中，将返回 null 值。此函数包括两个参数：

  - $map：定义好的 map。
  - $key：需要遍历的 key。
``` bash
$social-colors: (
    dribble: #ea4c89,
    facebook: #3b5998,
    github: #171515,
    google: #db4437,
    twitter: #55acee
);
```
假设要获取 facebook 键值对应的值 #3b5998，我们就可以使用 map-get() 函数来实现：
``` bash
.btn-dribble{
  color: map-get($social-colors,facebook);
}
```
``` bash
.btn-dribble {
  color: #3b5998;
}
```
我们来看另一种情况，假设 $social-colors 这个 map 没有 $weibo 这个 key:
``` bash
.btn-weibo{
  font-size: 12px;
  color: map-get($social-colors,weibo);
}
```
``` bash
.btn-weibo {
  font-size: 12px;
}
```
从 编译出来的 CSS 可以得知，如果 $key 不在 $map 中，不会编译出 CSS，其实在 Sass 中，map-get($social- colors,weibo) 返回了一个 null 值。但在编译出来的 CSS 中，你只知道他没有编译出样式，而且在命令终端编译时，也没有任何错误或者警告信息。说实话，你并不知道他为什么编译不出来样式，或者说他已返回了值为 null。体验不强，也不好排错。其实如果我们自定义一个函数，另外加个判断，那就截然不同。

#### Sass Maps的函数-map-has-key($map,$key)
map-has-key($map,$key) 函数将返回一个布尔值。当 $map 中有这个 $key，则函数返回 true，否则返回 false。
前面的示例，当 $key 不在 $map 中时，使用 map-get($map,$key) 函数将返回一个 null 值。但对于开发人员，并看不到任何提示信息。如果使用 map-has-key($map,$key) 函数就可以改变这一状态。我们来看一个简单的示例。
``` bash
@if map-has-key($social-colors,facebook){
    .btn-facebook {
        color: map-get($social-colors,facebook);
    }
} @else {
    @warn "No color found for faceboo in $social-colors map. Property ommitted."
}
```
``` bash
.btn-fackbook{
    color: #3b5998;
} 
```
上面看到的示例是 facebook 这个 key 已存在 $social-colors 这个 map 当中。所以能正常编译。如果你手误，将 facebook 输错了：
``` bash
@if map-has-key($social-colors,faceboo){
    .btn-facebook {
        color: map-get($social-colors,facebook);
    }
} @else {
    @warn "No color found for faceboo in $social-colors map. Property ommitted."
}
```
这个时候，你编译出来的 CSS 代码中，不会有新代码添加，但在命令终端可以看到提示信息：
``` bash
WARNING: No color found for faceboo in $social-colors map. Property ommitted.
         on line 25 of test.scss
```
是不是非常的友好。但总觉得这样写是傻傻的，总不可能每获取一个 key 都写一个 @if 语句吧。其实不用这么复杂，我们可以自定义一个函数，比如 colors():
``` bash
@function colors($color){
    @if not map-has-key($social-colors,$color){
        @warn "No color found for `#{$color}` in $social-colors map. Property omitted.";
    }
    @return map-get($social-colors,$color);
}
```
有了这个函数之后，我们就可以这样使用
``` bash
.btn-dribble {
    color: colors(dribble);
}
.btn-facebook {
    color: colors(facebook);
}
.btn-github {
    color: colors(github);
}
.btn-google {
    color: colors(google);
}
.btn-twitter {
    color: colors(twitter);
}
.btn-weibo {
    color: colors(weibo);
}
```
编译出来的 CSS:
``` bash
.btn-dribble {
  color: #ea4c89;
}

.btn-facebook {
  color: #3b5998;
}

.btn-github {
  color: #171515;
}

.btn-google {
  color: #db4437;
}

.btn-twitter {
  color: #55acee;
}
```
同时你不难发现，命令终端提示信息：
``` bash
WARNING: No color found for `weibo` in $social-colors map. Property omitted.
         on line 13 of test.scss
```
那是在 $social-colors 这个 map 中没有 weibo 这个 key。是不是很有意思。

当然，如果你对 Sass 的指令熟悉的话，上面编译出来的 CSS 可以使用 @each：
``` bash
@each $social-network,$social-color in $social-colors {
    .btn-#{$social-network} {
        color: colors($social-network);
    }
}
```
#### Sass Maps的函数-map-keys($map)
map-keys($map) 函数将会返回 $map 中的所有 key。这些值赋予给一个变量，那他就是一个列表。如：
``` bash
$list: map-keys($social-colors);
```
``` bash
@function colors($color){
    $names: map-keys($social-colors);
    @if not index($names,$color){
        @warn "Waring: `#{$color} is not a valid color name.`";
    }
    @return map-get($social-colors,$color);
}
```
上面代码中最不同之处，我们使 用map-key s将 $social-colors 这个 map 的所有 key 取出，并赋予给一个名 为 $names 的列表。然后通过 index($names,$color) 返回 $color 在 $names 位置，如果这个位置不存在，将返回提示信息，如果存在将返回正确的值。
同样，也可以通过 @each 或者 @for 遍历出所有值：
``` bash
@each $name in map-keys($social-colors){
    .btn-#{$name}{
        color: colors($name);
    }
}

```
用for：
``` bash
@for $i from 1 through length(map-keys($social-colors)){
    .btn-#{nth(map-keys($social-colors),$i)} {
        color: colors(nth(map-keys($social-colors),$i));
    }
}
```
虽然使用的方法不一样，但最终得到的 CSS 是一样的：
``` bash
.btn-dribble {
  color: #ea4c89;
}

.btn-facebook {
  color: #3b5998;
}

.btn-github {
  color: #171515;
}

.btn-google {
  color: #db4437;
}

.btn-twitter {
  color: #55acee;
}
```
#### Sass Maps的函数-map-values($map)、map-merge($map1,$map2)
map-values($map) 函数类似于 map-keys($map) 功能，不同的是 map-values($map )获取的是 $map 的所有 value 值，可以说也将是一个列表。而且，map-values($map) 中如果有相同的 value 也将会全部获取出来。
map-merge($map1,$map2) 函数是将 $map1 和 $map2 合并，然后得到一个新的 $map。如果你要快速将新的值插入到 $map 中的话，这种方法是最佳方法。假设我们有两个 $map:
$color: (
    text: #f36,
    link: #f63,
    border: #ddd,
    backround: #fff
);
$typo:(
    font-size: 12px,
    line-height: 1.6
);
如果希望将这两个 $map 合并成一个 map，我们只要这样做：
``` bash
$newmap: map-merge($color,$typo);
```
将会生成一个新的 map:
``` bash
$newmap:(
    text: #f36,
    link: #f63,
    border: #ddd,
    background: #fff,
    font-size: 12px,
    line-height: 1.6
);
```
不过有一点需要注意，如果 $map1 和 $map2 中有相同的 $key 名，那么将 $map2 中的 $key 会取代 $map1 中的：
``` bash
$color: (
    text: #f36,
    link: #f63,
    border: #ddd,
    backround: #fff
);
$typo:(
    font-size: 12px,
    line-height: 1.6,
    border: #ccc,
    background: #000
);
```
执行：
$newmap: map-merge($color,$typo);
得到的新 map:
``` bash
$newmap:(
    text: #f36,
    link: #f63,
    font-size: 12px,
    line-height: 1.6,
    border: #ccc,
    background: #000
);
```
#### Sass Maps的函数-map-remove($map,$key)、keywords($args)
map-remove($map,$key) 函数是用来删除当前 $map 中的某一个 $key，从而得到一个新的 map。其返回的值还是一个 map。他并不能直接从一个 map 中删除另一个 map，仅能通过删除 map 中的某个 key 得到新 map.
如果删除的 key 并不存在于 $map 中，那么 map-remove() 函数返回的新 map 和以前的 map 一样。

keywords($args) 函数可以说是一个动态创建 map 的函数。可以通过混合宏或函数的参数变创建 map。参数也是成对出现，其中 $args 变成 key(会自动去掉$符号)，而 $args 对应的值就是value。
``` bash
@mixin map($args...){
    @debug keywords($args);
}

@include map(
  $dribble: #ea4c89,
  $facebook: #3b5998,
  $github: #171515,
  $google: #db4437,
  $twitter: #55acee
);
```
在命令终端可以看到一个输入的 @debug 信息：
``` bash
DEBUG: (dribble: #ea4c89, facebook: #3b5998, github: #171515, google: #db4437, twitter: #55acee)
```
### RGB颜色函数-RGB()颜色函数
在 Sass 的官方文档中，列出了 Sass 的颜色函数清单，从大的方面主要分为 RGB , HSL 和 Opacity 三大函数，当然其还包括一些其他的颜色函数，比如说 adjust-color 和 change-color 等。在这章节中，将主要和大家一起探讨 Sass 颜色函数中常见的 RGB、HSL 和 Opacity 函数。
RGB 颜色只是颜色中的一种表达式，其中 R 是 red 表示红色，G 是 green 表示绿色而 B 是 blue 表示蓝色。在 Sass 中为 RGB 颜色提供六种函数：
  - rgb($red,$green,$blue)：根据红、绿、蓝三个值创建一个颜色；
  - rgba($red,$green,$blue,$alpha)：根据红、绿、蓝和透明度值创建一个颜色；
  - red($color)：从一个颜色中获取其中红色值；
  - green($color)：从一个颜色中获取其中绿色值；
  - blue($color)：从一个颜色中获取其中蓝色值；
  - mix($color-1,$color-2,[$weight])：把两种颜色混合在一起。
仅从概念上，或许大家没有太多的概念，我们通过下面的命令来做一个简单的测试：
``` bash
sass -i
```
在命令终端开启这个命令，相当于开启 Sass 的函数计算。
接下来，分别在终端使用 RGB 函数来进行计算，看其最终结果：
``` bash
$ sass -i
>> rgb(200,40,88) //根据r:200,g:40,b:88计算出一个十六进制颜色值
#c82858
>> rgba(#c82858,.65) //根据#c82858的65%透明度计算出一个rgba颜色值
rgba(200, 40, 88, 0.65)
>> red(#c82858) //从#c82858颜色值中得到红色值 200
200
>> green(#c82858) //从#c82858颜色值中得到绿色值 40
40
>> blue(#c82858) //从#c82858颜色值中得到蓝色值 88
88
>> mix(#c82858,rgba(200,40,80,.65),.3) //把#c82858和rgba(200,40,88,.65) 两颜色按比例混合得到一个新颜色
rgba(200, 40, 80, 0.65105)
```
从上面的简单运算结果可以很清晰的知道。在 RGB 颜色函数中，在实际中常用的主要是 rgba() 和 mix() 两个函数，而 rgb() 函数只能快速的将一个 rgb 颜色转换成十六进制颜色表达，red()、green() 和 blue() 函数，只能取得某一颜色的一个值，对于颜色上使用并无太大作用（或许他的好处，我还没有理解过来）。
#### RGB颜色函数-RGBA()函数
rgba() 函数主要用来将一个颜色根据透明度转换成 rgba 颜色。
其语法有两种格式：
``` bash
rgba($red,$green,$blue,$alpha)  //将一个rgba颜色转译出来，和未转译的值一样
rgba($color,$alpha)  //将一个Hex颜色转换成rgba颜色
```
其中 rgba($color,$alpha) 函数作用更大，主要运用在这样的情形之中：假设在实际中知道的颜色值是 #f36 或者 red，但在使用中，需要给他们配上一个透明度，这个时候在原来的 CSS 中，首先需要通过制图工具，得到 #f36 或 red 颜色的 R、G、B 值，而不能直接使用（注意 css3 是可以的，但是存在浏览器兼容问题）：
``` bash
//CSS
color: rgba(#f36,.5); //在css中，这是无效的写法
```
但在 Sass 中，RGBA() 函数就能解决这个问题。我们先来看一个简单的例子，假设在变量中定义了一个基本的变量： 
``` bash
//SCSS
.rgba {
    color: rgba(#f36,.5);
    background: rgba(orange,.5);
    border-color: rgba(green,.5);
}
```
在这个实例中，我们使用了 Sass 的 rgba 函数，在括号是函数的参数，第一个参数是需要转换的颜色，他可以是任何颜色的表达方式，也可以是一个颜色变量；第二个参数是颜色的透明度，其值是 0~1 之间。上面的代码转译出来：
``` bash
.rgba {
  color: rgba(255, 51, 102, 0.5);
  background: rgba(255, 165, 0, 0.5);
  border-color: rgba(0, 128, 0, 0.5);
}
```
在来看一个调用前面定义的变量：
``` bash
//SCSS
.rgba {
    color: rgba($color,.5);
    background: rgba($bgColor,.5);
    border-color: rgba($borderColor,.5);
}
```
``` bash
//CSS
.rgba {
  color: rgba(255, 51, 102, 0.5);
  background: rgba(255, 165, 0, 0.5);
  border-color: rgba(0, 128, 0, 0.5);
}
```
#### RGB颜色函数-Red()、Green()、Blue()函数
Red() 函数

red() 函数非常简单，其主要用来获取一个颜色当中的红色值。假设有一个 #f36 的颜色，如果你想得到 #f36 中的 red 值是多少，这个时候使用 red() 函数就能很简单获取。
Green() 函数
green() 函数和red()函数一样，用来获取某一个颜色值中 green 的值。
Blue() 函数
同理，blue() 函数是用来获取某一个颜色值中 blue 的值，

#### RGB颜色函数-Mix()函数
Mix 函数是将两种颜色根据一定的比例混合在一起，生成另一种颜色。其使用语法如下：
``` bash
mix($color-1,$color-2,$weight);
```
$color-1 和 $color-2 指的是你需要合并的颜色，颜色可以是任何表达式，也可以是颜色变量。
$weight 为 合并的比例（选择权重），默认值为 50%，其取值范围是 0~1 之间。它是每个 RGB 的百分比来衡量，当然透明度也会有一定的权重。默认的比例是 50%，这意味着两个颜色各占一半，如果指定的比例是 25%，这意味着第一个颜色所占比例为 25%，第二个颜色所占比例为75%。
使用：
``` bash
mix(#f00, #00f) => #7f007f
mix(#f00, #00f, 25%) => #3f00bf
mix(rgba(255, 0, 0, 0.5), #00f) => rgba(63, 0, 191, 0.75)
```
``` bash
//SCSS
$color1: #a63;
$color2: #fff;
$bgColor1: #f36;
$bgColor2: #e36;
$borderColor1:#c36;
$borderColor2:#b36;
.mix {
    background: mix($bgColor1,$bgColor2,.75);
    color: mix($color1,$color2,.25);
    border-color: mix($borderColor1,$bgColor2,.05);
}
```
``` bash
//CSS
.mix {
    background: #ee3366;
    color: #fefefe;
    border-color: #ed33
}
```
### HSL函数简介
在 Sass 中提供了一系列有关于 HSL 的颜色函数，以供大家使用，其中常用的有 saturation、lightness、adjust-hue、lighten、darken 等等。接下来我们先来了解一下 HSL 颜色函数包括哪些具体的函数，所起的作用是什么：

  - hsl($hue,$saturation,$lightness)：通过色相（hue）、饱和度(saturation)和亮度（lightness）的值创建一个颜色；
  - hsla($hue,$saturation,$lightness,$alpha)：通过色相（hue）、饱和度(saturation)、亮度（lightness）和透明（alpha）的值创建一个颜色；
  - hue($color)：从一个颜色中获取色相（hue）值；
  - saturation($color)：从一个颜色中获取饱和度（saturation）值；
  - lightness($color)：从一个颜色中获取亮度（lightness）值；
  - adjust-hue($color,$degrees)：通过改变一个颜色的色相值，创建一个新的颜色；
  - lighten($color,$amount)：通过改变颜色的亮度值，让颜色变亮，创建一个新的颜色；
  - darken($color,$amount)：通过改变颜色的亮度值，让颜色变暗，创建一个新的颜色；
  - saturate($color,$amount)：通过改变颜色的饱和度值，让颜色更饱和，从而创建一个新的颜色
  - desaturate($color,$amount)：通过改变颜色的饱和度值，让颜色更少的饱和，从而创建出一个新的颜色；
  - grayscale($color)：将一个颜色变成灰色，相当于desaturate($color,100%);
  - complement($color)：返回一个补充色，相当于adjust-hue($color,180deg);
  - invert($color)：反回一个反相色，红、绿、蓝色值倒过来，而透明度不变。
### Opacity函数简介
在 CSS 中除了可以使用 rgba、hsla 和 transform 来控制颜色透明度之外，还可以使用 opacity 来控制，只不过前两者只是针对颜色上的透明通道做处理，而后者是控制整个元素的透明度。
在 Sass 中，也提供了系列透明函数，只不过这系列的透明函数主要用来处理颜色透明度：
  - alpha($color) /opacity($color)：获取颜色透明度值；
  - rgba($color, $alpha)：改变颜色的透明度值；
  - opacify($color, $amount) / fade-in($color, $amount)：使颜色更不透明；
  - transparentize($color, $amount) / fade-out($color, $amount)：使颜色更加透明。

### @import
Sass 支持所有 CSS3 的 @ 规则， 以及一些 Sass 专属的规则，也被称为“指令（directives）”。 这些规则在 Sass 中具有不同的功效，详细解释如下。
@import

Sass 扩展了 CSS 的 @import 规则，让它能够引入 SCSS 和 Sass 文件。 所有引入的 SCSS 和 Sass 文件都会被合并并输出一个单一的 CSS 文件。 另外，被导入的文件中所定义的变量或 mixins 都可以在主文件中使用。
Sass 会在当前目录下寻找其他 Sass 文件， 如果是 Rack、Rails 或 Merb 环境中则是 Sass 文件目录。 也可以通过 :load_paths 选项或者在命令行中使用 --load-path 选项来指定额外的搜索目录。

@import 根据文件名引入。 默认情况下，它会寻找 Sass 文件并直接引入， 但是，在少数几种情况下，它会被编译成 CSS 的 @import 规则：

  - 如果文件的扩展名是 .css。
  - 如果文件名以 http:// 开头。
  - 如果文件名是 url()。
  - 如果 @import 包含了任何媒体查询（media queries）。
如果上述情况都没有出现，并且扩展名是 .scss 或 .sass， 该名称的 Sass 或 SCSS 文件就会被引入。 如果没有扩展名， Sass 将试着找出具有 .scss 或 .sass 扩展名的同名文件并将其引入。
\@import "foo";
\@import "foo";
如果你有一个 SCSS 或 Sass 文件需要引入， 但是你又不希望它被编译为一个 CSS 文件， 这时，你就可以在文件名前面加一个下划线，就能避免被编译。 这将告诉 Sass 不要把它编译成 CSS 文件。 然后，你就可以像往常一样引入这个文件了，而且还可以省略掉文件名前面的下划线。
注意，在同一个目录不能同时存在带下划线和不带下划线的同名文件。 例如， _colors.scss 不能与 colors.scss 并存。
嵌套 @import

虽然大部分时间只需在顶层文件使用 @import 就行了， 但是，你还可以把他们包含在 CSS 规则 和 @media 规则中。
### @media
Sass 中的 @media 指令和 CSS 的使用规则一样的简单，但它有另外一个功能，可以嵌套在 CSS 规则中。有点类似 JS 的冒泡功能一样，如果在样式中使用 @media 指令，它将冒泡到外面。来看一个简单示例：
``` bash
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
```
``` bash
.sidebar {
  width: 300px; }
  @media screen and (orientation: landscape) {
    .sidebar {
      width: 500px; } }
```
@media 也可以嵌套 @media
``` bash
@media screen {
  .sidebar {
    @media (orientation: landscape) {
      width: 500px;
    }
  }
}
```
``` bash
@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px; } }
```
在使用 @media 时，还可以使用插件#{}:
``` bash
$media: screen;
$feature: -webkit-min-device-pixel-ratio;
$value: 1.5;

@media #{$media} and ($feature: $value) {
  .sidebar {
    width: 500px;
  }
}
```
``` bash
@media screen and (-webkit-min-device-pixel-ratio: 1.5) {
  .sidebar {
    width: 500px; } }
```
### @extend
Sass 中的 @extend 是用来扩展选择器或占位符。比如：
``` bash
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.error.intrusion {
  background-image: url("/image/hacked.png");
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```
``` bash
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.error.intrusion, .seriousError.intrusion {
  background-image: url("/image/hacked.png"); }

.seriousError {
  border-width: 3px; }
```
多个扩展

所设某个样式要继承多个地方的样式，那么可以使用 @extend 来继承多个选择器或占位符的样式，如：
``` bash
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.attention {
  font-size: 3em;
  background-color: #ff0;
}
.seriousError {
  @extend .error;
  @extend .attention;
  border-width: 3px;
}
```
``` bash
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.attention, .seriousError {
  font-size: 3em;
  background-color: #ff0; }

.seriousError {
  border-width: 3px; }
```
扩展单一选择器

前面我们知道 %placeholder 不使用@extend显示调用是不会生成任何样式代码。那么在选择器中使用占位符一样。比如下面的代码:
``` bash
#context a%extreme {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```
``` bash
.notice {
  @extend %extreme;
}
```
``` bash
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

### @at-root
@at-root 从字面上解释就是跳出根元素。当你选择器嵌套多层之后，想让某个选择器跳出，此时就可以使用 @at-root。来看一个简单的示例：
``` bash
.a {
  color: red;

  .b {
    color: orange;

    .c {
      color: yellow;

      @at-root .d {
        color: green;
      }
    }
  }  
}
```
``` bash
.a {
  color: red;
}

.a .b {
  color: orange;
}

.a .b .c {
  color: yellow;
}

.d {
  color: green;
}
```
### @debug
@debug 在 Sass 中是用来调试的，当你的在 Sass 的源码中使用了 @debug 指令之后，Sass 代码在编译出错时，在命令终端会输出你设置的提示 Bug:
\@debug 10em + 12em;
output:Line 1 DEBUG: 22em

### @warn
@warn 和 @debug 功能类似，用来帮助我们更好的调试 Sass。如：
``` bash
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @warn "Assuming #{$x} to be in pixels";
    $x: 1px * $x;
  }
  @if unitless($y) {
    @warn "Assuming #{$y} to be in pixels";
    $y: 1px * $y;
  }
  position: relative; left: $x; top: $y;
}
```
### @error
@error 和 @warn、@debug 功能是如出一辙.
``` bash
@mixin error($x){
  @if $x < 10 {
    width: $x * 10px;
  } @else if $x == 10 {
    width: $x;
  } @else {
    @error "你需要将#{$x}值设置在10以内的数";
  }

}

.test {
  @include error(15);
}
```
编译时，提示：你需要将15值设置在10以内的数 on line 7 at column 5














































































































































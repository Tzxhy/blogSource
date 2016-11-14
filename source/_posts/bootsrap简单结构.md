---
title: bootsrap简单结构
date: 2016-09-18 22:26:52
tags:
---

---

# 排版

## 标题:
Bootstrap和普通的HTML页面一样, 定义标题都是使用标签&lt;h1&gt;到&lt;h6&gt;,只不过Bootstrap覆盖了其默认的样式, 使用其在所有浏览器下显示的效果一样.
除此之外, 我们在Web的制作中, 常常会碰到在一个标题后面紧跟着一行小的副标题. 在Bootstrap中他也考虑了这种排版效果, 使用了&lt;small&gt;标签来制作副标题. 这个副标题具有其自己的一些独特样式.
<!--more-->
## 段落(正文文本)
全局文本字号为14px(font-size),行高为1.42857143(line-height), 大约是20px,深灰色(#333),字体为"Helvetica Neue", Helvetica, Arial, sans-serif;(font-family)

## 强调内容
如果想让一个段落p突出显示, 可以通过添加类名**“.lead”**实现, 其作用就是增大文本字号, 加粗文本, 而且对行高和margin也做相应的处理. 除此之外, Bootstrap还通过元素标签:**&lt;small&gt;、&lt;strong&gt;、&lt;em&gt;和&lt;cite&gt;**给文本做突出样式处理. 

## 粗体
粗体就是给文本加粗, 在普通的元素中我们一般通过font-weight设置为bold关键词给文本加粗. 在Bootstrap中, 可以使用**&lt;b&gt;和&lt;strong&gt;**标签让文本直接加粗. 

## 斜体
斜体类似于加粗一样, 除了可以给元素设置样式font-style值为italic实现之外, 在Bootstrap中还可以通过使用标签**&lt;em&gt;或&lt;i&gt;**来实现. 

## 强调相关的类
1.    	.text-muted：提示, 使用浅灰色(#999)
2.    	.text-primary：主要, 使用蓝色(#428bca)
3.   	 	.text-success：成功, 使用浅绿色(#3c763d)
4.   		.text-info：通知信息, 使用浅蓝色(#31708f)
5.   		.text-warning：警告, 使用黄色(#8a6d3b)
6.   	 	.text-danger：危险, 使用褐色(#a94442)

## 文本对齐风格
为了简化操作, 方便使用, Bootstrap通过定义四个类名来控制文本的对齐风格：
1. 			.text-left：左对齐
2. 			.text-center：居中对齐
3. 			.text-right：右对齐
4. 			.text-justify：两端对齐

## 列表--简介
Bootstrap根据平时的使用情形提供了六种形式的列表：
☑  普通列表
☑  有序列表
☑  去点列表
☑  内联列表
☑  描述列表
☑  水平描述列表

### 无序列表和有序列表
使用方式和我们平时使用的一样(无序列表使用ul, 有序列表使用ol标签), 在样式方面, Bootstrap只是在此基础上做了一些细微的优化.

### 列表--去点列表
在Bootstrap中默认情况下无序列表和有序列表是带有项目符号的, 但在实际工作中很多时候, 我们的列表是不需要这个编号的, 比如说用无序列表做导航的时候. Bootstrap为众多开发者考虑的非常周道, 通过给无序列表添加一个类名**“.list-unstyled”**,这样就可以去除默认的列表样式的风格. (ul/ol中加入CSS类).

### 列表--内联列表
Bootstrap像去点列表一样, 通过添加类名**“.list-inline”**来实现内联列表, 简单点说就是把垂直列表换成水平列表, 而且去掉项目符号(编号), 保持水平显示. 也可以说内联列表就是为**制作水平导航**而生. 

### 列表--定义列表
对于定义列表而言, Bootstrap并没有做太多的调整, 只是调整了行间距, 外边距和字体加粗效果. dl&gt;dt&gt;dd.

### 列表--水平定义列表
水平定义列表就像内联列表一样, Bootstrap可以给&lt;dl&gt;添加类名**“.dl-horizontal”**给定义列表实现水平显示效果. 

## 代码
在Bootstrap主要提供了三种代码风格：
1、使用&lt;code&gt;来显示单行内联代码
2、使用&lt;pre&gt;来显示多行块代码
3、使用&lt;kbd&gt;来显示用户输入代码
在使用代码时, 用户可以根据具体的需求来使用不同的类型：
1、&lt;code&gt;: 一般是针对于单个单词或单个句子的代码
2、&lt;pre&gt;: 一般是针对于多行代码(也就是成块的代码)
3、&lt;kbd&gt;: 一般是表示用户要通过键盘输入的内容
正如前面所示, &lt;pre&gt;元素一般用于显示大块的代码, 并保证原有格式不变. 但有时候代码太多, 而且不想让其占有太大的页面篇幅, 就想控制代码块的大小. Bootstrap也考虑到这一点, 你只需要在&lt;pre&gt;标签上添加类名“.pre-scrollable”, 就可以控制代码块区域最大高度为340px, 一旦超出这个高度, 就会在Y轴出现滚动条. 

## 表格
Bootstrap为表格提供了1种基础样式和4种附加样式以及1个支持响应式的表格. Bootstrap为表格不同的样式风格提供了不同的类名, 主要包括：
☑  .table：基础表格
☑  .table-striped：斑马线表格
☑  .table-bordered：带边框的表格
☑  .table-hover：鼠标悬停高亮的表格
☑  .table-condensed：紧凑型表格
☑  .table-responsive：响应式表格
表格--表格行的类:Bootstrap还为表格的行元素&lt;tr&gt;提供了五种不同的类名, 每种类名控制了行的不同背景颜色, active, success, info, warning, danger

### 表格--基础表格
在Bootstrap中, 对于基础表格是通过类名“.table”来控制. 如果在**&lt;table&gt;**元素中不添加任何类名, 表格是无任何样式效果的. 想得到基础表格, 我们只需要在&lt;table&gt;元素上添加“.table”类名, 就可以得到Bootstrap的基础表格.

### 表格--斑马线表格
有时候为了让表格更具阅读性, 需要将表格制作成类似于斑马线的效果. 简单点说就是让表格带有背景条纹效果. 在Bootstrap中实现这种表格效果并不困难, 只需要在&lt;table class="table"&gt;的基础上增加类名“.table-striped”即可.

### 表格--带边框的表格
基础表格仅让表格部分地方有边框, 但有时候需要整个表格具有边框效果. Bootstrap出于实际运用, 也考虑这种表格效果, 即所有单元格具有一条1px的边框. 
Bootstrap中带边框的表格使用方法和斑马线表格的使用方法类似, 只需要在基础表格&lt;table class="table"&gt;基础上添加一个“.table-bordered”类名即可.

### 表格--鼠标悬浮高亮的表格
当鼠标悬停在表格的行上面有一个高亮的背景色, 这样的表格让人看起来就是舒服, 时刻告诉用户正在阅读表格哪一行的数据. Bootstrap的确没有让你失望, 他也考虑到这种效果, 其提供了一个“.table-hover”类名来实现这种表格效果. 鼠标悬停高亮的表格使用也简单, 仅需要&lt;table class="table"&gt;元素上添加类名“table-hover”即可.

### 表格--紧凑型表格
何谓紧凑型表格, 简单理解, 就是单元格没内距或者内距较其他表格的内距更小. 换句话说, 要实现紧凑型表格只需要重置表格单元格的内距padding的值. 那么在Bootstrap中, 通过类名“table-condensed”重置了单元格内距值. 紧凑型表格的运用, 也只是需要在&lt;table class="table"&gt;基础上添加类名“table-condensed”.另外从上面的示例中大家可能也发现了, 不管制作哪种表格都离不开类名“table”. 所以大家在使用Bootstrap表格时, **千万注意, 你的&lt;table&gt;元素中一定不能缺少类名“table”**. 

### 表格--响应式表格
随着各种手持设备的出现, 要想让你的Web页面适合千罗万像的设备浏览, 响应式设计的呼声越来越高. 在Bootstrap中也为表格提供了响应式的效果, 将其称为响应式表格. 
Bootstrap提供了一个容器, 并且此容器设置类名“.table-responsive”,此容器就具有响应式效果, 然后**将&lt;table class="table"&gt;置于这个容器当中(多一个容器)**, 这样表格也就具有响应式效果. Bootstrap中响应式表格效果表现为：当你的浏览器可视区域小于768px时, 表格底部会出现水平滚动条. 当你的浏览器可视区域大于768px时, 表格底部水平滚动条就会消失. 

---

# 表单
## 基础表单
表单中常见的元素主要包括：文本输入框、下拉选择框、单选按钮、复选按钮、文本域和按钮等. 其中每个控件所起的作用都各不相同, 而且不同的浏览器对表单控件渲染的风格都各有不同. 对于基础表单, Bootstrap并未对其做太多的定制性效果设计, 仅仅对表单内的fieldset、legend、label标签进行了定制. 当然表单除了这几个元素之外, 还有input、select、textarea等元素, 在Bootstrap框架中, 通过定制了一个类名`form-control`, 也就是说, 如果这几个元素使用了类名**“form-control”**, 将会实现一些设计上的定制效果. 
1、宽度变成了100%
2、设置了一个浅灰色(#ccc)的边框
3、具有4px的圆角
4、设置阴影效果, 并且元素得到焦点之时, 阴影和边框效果会有所变化
5、设置了placeholder的颜色为#999
``` bash
<div class="form-group">
    <label for="exampleInputEmail1">邮箱：</label>
    <input type="email" class="form-control" id="exampleInputEmail1" 
			placeholder="请输入您的邮箱地址">
  </div>
```
``` bash
<div class="checkbox">
    <label>
      <input type="checkbox"> 记住密码
    </label>
  </div>
```
## 水平表单
在Bootstrap框架中要实现水平表单效果, 必须满足以下两个条件：
1、在&lt;form&gt;元素是使用类名“form-horizontal”. 
2、配合Bootstrap框架的网格系统. (网格布局会在以后的章节中详细讲解)

在&lt;form&gt;元素上使用类名“form-horizontal”主要有以下几个作用：
1、设置表单控件padding和margin值. 
2、改变“form-group”的表现形式, 类似于网格系统的“row”. 
``` bash
<div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">密码</label>
    <div class="col-sm-10">
      <input type="password" class="form-control" id="inputPassword3"
				placeholder="请输入您的邮箱密码">
    </div>
  </div>
```
## 内联表单
在Bootstrap框架中实现这样的表单效果是轻而易举的, 你只需要在&lt;form&gt;元素中添加类名“form-inline”即可. 内联表单实现原理非常简单, 欲将表单控件在一行显示, 就需要将表单控件设置成内联块元素(display:inline-block).如果你要在input前面添加一个label标签时, 会导致input换行显示. 如果你必须添加这样的一个label标签, 并且不想让input换行, 你需要将label标签也放在容器“form-group”中. 回过头来看示例, 你或许会问, 为什么添加了label标签, 而且没有放置在”form-group”这样的容器中, input也不会换行；还有label标签怎么没显示出来. 如果你仔细看, 在label标签运用了一个类名“sr-only”, 标签没显示就是这个样式将标签隐藏了.那么Bootstrap为什么要这么做呢？这样不是多此一举吗？其实不是的, 如果没有为输入控件设置label标签, 屏幕阅读器将无法正确识别. 这也是Bootstrap框架另一个优点之处, 为残障人员进行了一定的考虑. 

## 表单控件(输入框input)
单行输入框,常见的文本输入框, 也就是input的type属性值为text. 在Bootstrap中使用input时也必须添加type类型, 如果没有指定type类型, 将无法得到正确的样式, 因为Bootstrap框架都是通过input\[type=“?”\](其中?号代表type类型, 比如说text类型, 对应的是input\[type=“text”\])的形式来定义样式的. 
为了让控件在各种表单风格中样式不出错, 需要添加类名“form-control”, 
**全部input类型都在这了**
&lt;input type="email" class="form-control" placeholder="Enter email"&gt;
text button checkbox date datetime datetime-local img file hidden month number password radio range reset search submit tel time url week hidden

## 表单控件(下拉选择框select)
Bootstrap框架中的下拉选择框使用和原始的一致, 多行选择设置multiple属性的值为multiple. Bootstrap框架会为这些元素提供统一的样式风格. 
``` bash
<select multiple class="form-control"> 
  <option>1</option> 
  <option>2</option> 
  <option>3</option> 
  <option>4</option> 
  <option>5</option> 
</select>
```

## 表单控件(文本域textarea)
文本域和原始使用方法一样, 设置rows可定义其高度, 设置cols可以设置其宽度. 但如果textarea元素中添加了类名“form-control”类名, 则无需设置cols属性. 因为Bootstrap框架中的“form-control”样式的表单控件宽度为100%或auto. 
``` bash
<form role="form">
  <div class="form-group">
    <textarea class="form-control" rows="3"></textarea>
  </div>
</form>
```

## 表单控件(复选框checkbox和单选择按钮radio)
<span style="color:blue;">Bootstrap框架中checkbox和radio有点特殊</span>, Bootstrap针对他们做了一些特殊化处理, 主要是checkbox和radio与label标签配合使用会出现一些小问题(最头痛的是对齐问题). 使用Bootstrap框架, 开发人员无需考虑太多, 只需要按照下面的方法使用即可. 
``` bash
<div class="checkbox">
    <label>
      <input type="checkbox" value="">
      记住密码
    </label>
  </div>
```
``` bash
<div class="radio">
  <label>
    <input type="radio" name="optionsRadios" id="optionsRadios1" value="love" checked>
      喜欢
  </label>
</div>
<div class="radio">
	<label>
		<input type="radio" name="optionsRadios" id="optionsRadios2" value="hate">
		不喜欢
	</label>
</div>
```
从上面的示例, 我们可以得知：
1、**不管是checkbox还是radio都使用label包起来了**
2、checkbox连同label标签放置在一个名为“.checkbox”的容器内
3、radio连同label标签放置在一个名为“.radio”的容器内
在Bootstrap框架中, 主要借助“.checkbox”和“.radio”样式, 来处理复选框、单选按钮与标签的对齐方式. 

## 表单控件(复选框和单选按钮水平排列)
有时候, 为了布局的需要, 将复选框和单选按钮需要水平排列. Bootstrap框架也做了这方面的考虑：
1、如果checkbox需要水平排列, 只需要在**label标签上添加类名“checkbox-inline”**
2、如果radio需要水平排列, 只需要在**label标签上添加类名“radio-inline”**
``` bash
<div class="form-group">
  <label class="checkbox-inline">
    <input type="checkbox"  value="option1">游戏
  </label>
  <label class="checkbox-inline">
    <input type="checkbox"  value="option2">摄影
  </label>
  <label class="checkbox-inline">
    <input type="checkbox"  value="option3">旅游
  </label>
</div>
```

## 表单控件(按钮)
按钮也是表单重要控件之一,制作按钮通常使用下面代码来实现：
☑  input[type=“submit”]
☑  input[type=“button”]
☑  input[type=“reset”]
☑  &lt;button&gt;
在Bootstrap框架中的按钮都是采用&lt;button&gt;来实现. 

## 表单控件大小
前面看到的表单控件都正常的大小. 可以通过设置控件的height, line-height, padding和font-size等属性来实现控件的高度设置. 不过Bootstrap框架还提供了两个不同的类名, 用来控制表单控件的高度. 这两个类名是：
1、input-sm: 让控件比正常大小更小
2、input-lg: 让控件比正常大小更大
**这两个类适用于表单中的input, textarea和select控件.** 不管是“input-sm”还是“input-lg”仅对控件高度做了处理. 但往往很多时候, 我们需要控件宽度也要做一定的变化处理. 这个时候就要借住Bootstrap框架的网格系统. 
前面介绍水平表单时说过, **如果表单使用了类名“form-horizontal”, 其中“form-group”就相当于网格系统中的“row”**. 换句话说, 如果没有这样做, 要通过网格系统来控制表单控件宽度, 就需要这样使用：
``` bash
<div class="row">
	<div class="col-xs-4">
		<input class="form-control input-lg" type="text" placeholder=".col-xs-4">
	</div>
</div>
```

## 表单控件状态(焦点状态)
每一种状态都能给用户传递不同的信息, 比如表单有焦点的状态可以告诉用户可以输入或选择东西, 禁用状态可以告诉用户不可以输入或选择东西, 还有就是表单控件验证状态, 可以告诉用户的操作是否正确等. 那么在Bootstrap框架中的表单控件也具备这些状态.  从源码中我们可以看出, 要让控件在焦点状态下有上面样式效果, 需要给控件添加类名“form-control”.在Bootstrap框架中, file、radio和checkbox控件在焦点状态下的效果也与普通的input控件不太一样, 主要是因为Bootstrap对他们做了一些特殊处理

## 表单控件状态(禁用状态)
Bootstrap框架的表单控件的禁用状态和普通的表单禁用状态实现方法是一样的, 在相应的表单控件上**添加属性“disabled”**(__不是添加类__). 和其他表单的禁用状态不同的是, Bootstrap框架做了一些样式风格的处理. 在使用了“form-control”的表单控件中, 样式设置了禁用表单背景色为灰色, 而且手型变成了不准输入的形状. 如果控件中不使用类名“form-control”, 禁用的控件只会有一个不准输入的手型出来. 在Bootstrap框架中, 如果fieldset设置了disabled属性, 整个域都将处于被禁用状态
``` bash
<form role="form">
<fieldset disabled>
  <div class="form-group">
  <label for="disabledTextInput">禁用的输入框</label>
    <input type="text" id="disabledTextInput" class="form-control" placeholder="禁止输入">
  </div>
  <div class="form-group">
  <label for="disabledSelect">禁用的下拉框</label>
    <select id="disabledSelect" class="form-control">
  <option>不可选择</option>
  </select>
  </div>
  <div class="checkbox">
  <label>
    <input type="checkbox">无法选择
  </label>
  </div>
  <button type="submit" class="btnbtn-primary">提交</button>
</fieldset>
</form>
```
据说对于整个禁用的域中, 如果legend中有输入框的话, 这个输入框是无法被禁用的. 

## 表单控件状态(验证状态)
在制作表单时, 不免要做表单验证. 同样也需要提供验证状态样式, 在Bootstrap框架中同样提供这几种效果. 
1、.has-warning: 警告状态(黄色)
2、.has-error: 错误状态(红色)
3、.has-success: 成功状态(绿色)
使用的时候只需要在form-group容器上对应添加状态类名. 很多时候, 在表单验证的时候, 不同的状态会提供不同的icon, 比如成功是一个对号(√), 错误是一个叉号(×)等. 在Bootstrap框中也提供了这样的效果. 如果你想让表单在对应的状态下显示icon出来, 只需要在对应的状态下添加类名“has-feedback”. 请注意, 此类名要与“has-error”、“has-warning”和“has-success”在一起
``` bash
<div class="form-group has-success has-feedback">
	<label class="control-label" for="inputSuccess1">成功状态</label>
	<input type="text" class="form-control" id="inputSuccess1" placeholder="成功状态" >
	<span class="glyphicon glyphicon-ok form-control-feedback"></span>
	<!-- 使用图标的话,必须加入之前的 成功状态 的 label -->
</div>
```

## 表单提示信息
平常在制作表单验证时, 要提供不同的提示信息. 在Bootstrap框架中也提供了这样的效果. 使用了一个"help-block"样式, 将提示信息以块状显示, 并且显示在控件底部. 
``` bash
<div class="form-group has-success has-feedback">
  <label class="control-label" for="inputSuccess1">成功状态</label>
  <input type="text" class="form-control" id="inputSuccess1" placeholder="成功状态" >
  <span class="help-block">你输入的信息是正确的</span>
  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
</div>
```

## 按钮
**请始终为按钮规定 type 属性**. Internet Explorer 的默认类型是 "button", 而其他浏览器中(包括 W3C 规范)的默认值是 "submit". 
``` bash
<button class="btn" type="button">基础按钮.btn</button>  
<button class="btn btn-default" type="button">默认按钮.btn-default</button> 
<button class="btn btn-primary" type="button">主要按钮.btn-primary</button> 
<button class="btn btn-success" type="button">成功按钮.btn-success</button> 
<button class="btn btn-info" type="button">信息按钮.btn-info</button> 
<button class="btn btn-warning" type="button">警告按钮.btn-warning</button> 
<button class="btn btn-danger" type="button">危险按钮.btn-danger</button> 
<button class="btn btn-link" type="button">链接按钮.btn-link</button> 
```

### 默认按钮
Bootstrap框架首先通过基础类名“.btn”定义了一个基础的按钮风格, 然后通过“.btn-default”定义了一个默认的按钮风格. 默认按钮的风格就是在基础按钮的风格的基础上修改了按钮的背景颜色、边框颜色和文本颜色. 使用默认按钮风格也非常的简单, 只需要在基础按钮“btn”的基础上增加类名“btn-default”即可

### 多标签支持
虽然在Bootstrap框架中使用任何标签元素都可以实现按钮风格, 但个人并不建议这样使用, 为了避免浏览器兼容性问题, 个人强烈建议使用button或a标签来制作按钮. 

### 定制风格
在介绍按钮开篇就说过, Web页面可能会有不同的按钮风格. 那么在Bootstrap框架也考虑了. 在Bootstrap框架中除了默认的按钮风格之外, 还有其他六种按钮风格, 每种风格的其实都一样, 不同之处就是按钮的背景颜色、边框颜色和文本颜色. 

### 按钮大小
在Bootstrap框架中, 对于按钮的大小, 也是可以定制的. 类似于input一样, 通过在基础按钮“.btn”的基础上追加类名来控制按钮的大小. 
``` bash
<button class="btn btn-primary btn-lg" type="button">大型按钮.btn-lg</button> 
<button class="btn btn-primary" type="button">正常按钮</button>
<button class="btn btn-primary btn-xs" type="button">小型按钮.btn-sm</button>
<button class="btn btn-primary btn-xs" type="button">小型按钮.btn-sm</button>
```

### 块状按钮
Bootstrap框架中提供了一个类名“btn-block”. 按钮使用这个类名就可以让按钮充满整个容器, 并且这个按钮不会有任何的padding和margin值. 在实际当中, 常把这种按钮称为块状按钮. 

### 按钮状态——活动状态
Bootstrap框架针对按钮的状态做了一些特殊处理. 在Bootstrap框架中针对按钮的状态效果主要分为两种：活动状态和禁用状态. Bootstrap按钮的活动状态主要包括按钮的悬浮状态(:hover), 点击状态(:active)和焦点状态(:focus)几种. 而且不同风格下的按钮都具有这几种状态效果, 只是颜色做了一定的调整.当按钮处理正在点击状态(也就是鼠标按下的未松开的状态), __对于&lt;button&gt;元素是通过“:active”伪类实现__, __而对于&lt;a&gt;这样的标签元素则是通过添加类名“.active”来实现__. 

### 按钮状态——禁用状态
和input等表单控件一样, 在Bootstrap框架的按钮中也具有禁用状态的设置. 禁用状态与其他状态按钮相比, 就是背景颜色的透明度做了一定的处理, opcity的值从100%调整为65%. 在Bootstrap框架中, 要禁用按钮有两种实现方式：
方法1: 在标签中添加disabled属性
方法2: 在元素标签中添加类名“disabled”

## 图像
图像在网页制作中也是常要用到的元素, 在Bootstrap框架中对于图像的样式风格提供以下几种风格：
1、img-responsive：响应式图片, 主要针对于响应式设计
2、img-rounded: 圆角图片
3、img-circle: 圆形图片
4、img-thumbnail: 缩略图片
使用方法非常简单, 只需要在&lt;img&gt;标签上添加对应的类名.
``` bash
<img  alt="140x140" src="http://placehold.it/140x140">
<img  class="img-rounded" alt="140x140" src="http://placehold.it/140x140">
<img  class="img-circle" alt="140x140" src="http://placehold.it/140x140">
<img  class="img-thumbnail" alt="140x140" src="http://placehold.it/140x140">
<img  class="img-responsive" alt="140x140" src="http://placehold.it/140x140">
```

## 图标
``` bash
<span class="glyphicon glyphicon-search"></span>
<span class="glyphicon glyphicon-asterisk"></span>
<span class="glyphicon glyphicon-plus"></span>
<span class="glyphicon glyphicon-cloud"></span>
<span class="glyphicon glyphicon-phone"></span>
```
在网页中使用图标也非常的简单, 在任何内联元素上应用所对应的样式即可.所有icon都是以”glyphicon-”前缀的类名开始, 然后后缀表示图标的名称. 

---

# 网格系统
网格系统的实现原理非常简单, 仅仅是通过定义容器大小, 平分12份(也有平分成24份或32份, 但12份是最常见的), 再调整内外边距, 最后结合媒体查询, 就制作出了强大的响应式网格系统. Bootstrap框架中的网格系统就是将容器平分成12份
Bootstrap框架的网格系统工作原理如下：
1、**数据行(.row)**必须包含在容器(.container)中, 以便为其赋予合适的对齐方式和内距(padding). 如：
``` bash
<div class="container">
  <div class="row"></div>
</div>
```
2、在行(.row)中可以添加列(.column), 但列数之和不能超过平分的总列数, 比如12. 如：
``` bash
<div class="container">
	<div class="row">
		<div class="col-md-4"></div>
		<div class="col-md-8"></div>
	<div>
<div>
```
3、具体内容应当放置在列容器(column)之内, 而且**只有列(column)才可以作为行容器(.row)的直接子元素**
4、通过设置内距(padding)从而创建列与列之间的间距. 然后通过为第一列和最后一列设置负值的外距(margin)来抵消内距(padding)的影响

## 列偏移
有的时候, 我们不希望相邻的两个列紧靠在一起, 但又不想使用margin或者其他的技术手段来. 这个时候就可以使用列偏移(offset)功能来实现. 使用列偏移也非常简单, 只需要在列元素上添加类名“col-md-offset-\*” (其中星号代表要偏移的列组合数), 那么具有这个类名的列就会向右偏移. 例如, 你在列元素上添加“col-md-offset-4”, 表示该列向右移动4个列的宽度. 不过有一个细节需要注意, 使用 ”col-md-offset-\*” 对列进行向右偏移时, 要保证列与偏移列的总数不超过12, 不然会致列断行显示.

## 列排序
列排序其实就是改变列的方向, 就是改变左右浮动, 并且设置浮动的距离. 在Bootstrap框架的网格系统中是通过添加类名“col-md-push-*”(向右)和“col-md-pull-*”(向左) (其中星号代表移动的列组合数). 

## 列的嵌套
Bootstrap框架的网格系统还支持列的嵌套. 你可以在一个列中添加一个或者多个行(row)容器, 然后在这个行容器中插入列(像前面介绍的一样使用列). 但在列容器中的行容器(row), 宽度为100%时, 就是当前外部列的宽度. 
``` bash
<div class="row">
	<div class="col-md-8">
	我的里面嵌套了一个网格
		<div class="row">
			<div class="col-md-6">col-md-6</div>
			<div class="col-md-6">col-md-6</div>
		</div>
	</div>
</div>
```

---

# 菜单、按钮和导航
在Bootstrap框架中的下拉菜单组件是一个独立的组件, 根据不同的版本, 它对应的文件. 在使用Bootstrap框架的下拉菜单时, 必须调用Bootstrap框架提供的bootstrap.js文件. 当然, 如果你使用的是未编译版本, 在js文件夹下你能找到一个名为“dropdown.js”的文件. 你也可以调用这个js文件. 
<span style="color:red;">特别声明</span>：因为Bootstrap的组件交互效果都是依赖于jQuery库写的插件, 所以在使用bootstrap.min.js之前一定要先加载jquery.min.js才会生效果. 

## 下拉菜单
```bash
<div class="dropdown">
	<button class="btn btn-default dropdown-toggle" type="button"
		id="dropdownMenu1" data-toggle="dropdown">
		下拉菜单
		<span class="caret"></span>
	</button>
	<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
		<li role="presentation"><a role="menuitem" tabindex="-1" href="#">
			下拉菜单项</a></li>
		<li role="presentation" class="divider"></li>
		<li role="presentation"><a role="menuitem" tabindex="-1" href="#">
			下拉菜单项</a></li>
	</ul>
</div>
```

使用方法：在使用Bootstrap框架中的下拉菜单组件时, 其结构运用的正确与否非常的重要, 如果结构和类名未使用正确, 直接影响组件是否能正常运用. 我们来简单的看看：
1、使用一个名为“dropdown”的容器包裹了整个下拉菜单元素, 示例中为:&lt;div class="dropdown"&gt;&lt;/div&gt;
2、使用了一个&lt;button&gt;按钮做为父菜单, 并且定义类名“dropdown-toggle”和自定义“data-toggle”属性, 属性指明触发后的动作：data-toggle="dropdown"
3、下拉菜单项使用一个ul列表, 并且定义一个类名为“dropdown-menu”, 此示例为:
&lt;ul class="dropdown-menu"&gt;

### 下拉菜单(下拉分隔线)
在Bootstrap框架中的下拉菜单还提供了下拉分隔线, 假设下拉菜单有两个组, 那么组与组之间可以通过添加一个空的&lt;li&gt;, 并且给这个&lt;li&gt;添加类名“divider”来实现添加下拉分隔线的功能. 

### 下拉菜单(菜单标题)
``` bash
<li role="presentation" class="dropdown-header">第一部分菜单头部</li>
```

### 下拉菜单(对齐方式)
Bootstrap框架中下拉菜单默认是左对齐, 如果你想让下拉菜单相对于父容器右对齐时, 可以在“dropdown-menu”上添加一个“pull-right”或者“dropdown-menu-right”类名

### 下拉菜单(菜单项状态)
下拉菜单项的默认的状态(不用设置)有悬浮状态(:hover)和焦点状态(:focus).下拉菜单项除了上面两种状态, 还有当前状态(.active)和禁用状态(.disabled). 这两种状态使用方法只需要在对应的菜单项上添加对应的类名

## 按钮(按钮组)
按钮组和下拉菜单组件一样, 需要依赖于button.js插件才能正常运行. 不过我们同样可以直接只调用bootstrap.js文件. 因为这个文件已集成了button.js插件功能. 对于结构方面, 非常的简单. 使用一个名为“btn-group”的容器, 把多个按钮放到这个容器中.btn-group 主要使自身容器为内联块, 使内部 .btn 左浮. 如下所示：
```bash
<div class="btn-group">
  <button type="button" class="btn btn-default">
    <span class="glyphicon glyphicon-step-backward"></span>
  </button>
  <button type="button" class="btn btn-default">
    <span class="glyphicon glyphicon-step-forward"></span>
  </button>
</div>
```
除了可以使用&lt;button&gt;元素之外, 还可以使用其他标签元素, 比如&lt;a&gt;标签. 唯一要保证的是：不管使用什么标签, “.btn-group”容器里的标签元素需要带有类名“.btn”. 

### 按钮(按钮工具栏)
在富文本编辑器中, 将按钮组分组排列在一起,比如说复制、剪切和粘贴一组；左对齐、中间对齐、右对齐和两端对齐一组,那么Bootstrap框架按钮工具栏也提供了这样的制作方法,你只需要将按钮组“btn-group”按组放在一个大的容器“btn-toolbar”中, 如下所示：
```bash
<div class="btn-toolbar">
  <div class="btn-group"></div>
  <div class="btn-group"></div>
  <div class="btn-group"></div>
</div>
```
实现原理主要是让容器的多个分组“btn-group”元素进行浮动, 并且组与组之前保持5px的左外距.

### 按钮组大小设置
在介绍按钮一节中, 我们知道按钮是通过btn-lg、btn-sm和btn-xs三个类名来调整padding、font-size、line-height和border-radius属性值来改变按钮大小. 那么按钮组的大小, 我们也可以通过类似的方法：
☑  .btn-group-lg:大按钮组
☑  .btn-group-sm:小按钮组
☑  .btn-group-xs:超小按钮组
只需要在“.btn-group”类名上追加对应的类名, 就可以得到不同大小的按钮组. 如下所示：
``` bash
<div class="btn-toolbar">
  <div class="btn-group btn-group-lg">
    …
  </div>
  <div class="btn-group">
  …
  </div>
  <div class="btn-group btn-group-sm">
    …
  </div>
  <div class="btn-group btn-group-xs">
   …
  </div>
</div>
```

### 按钮(嵌套分组)
很多时候, 我们常把下拉菜单和普通的按钮组排列在一起, 实现类似于导航菜单的效果. 使用的时候, 只需要把当初制作下拉菜单的“dropdown”的容器换成“btn-group”, 并且和普通的按钮放在同一级. 
```bash
<div class="btn-group">
<button class="btn btn-default" type="button">首页</button>
<button class="btn btn-default" type="button">产品展示</button>
<button class="btn btn-default" type="button">案例分析</button>
<button class="btn btn-default" type="button">联系我们</button>
<div class="btn-group">
  <button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">关于我们<span class="caret"></span></button>
  <ul class="dropdown-menu">
		<li><a href="##">公司简介</a></li>
		<li><a href="##">企业文化</a></li>
		<li><a href="##">组织结构</a></li>
		<li><a href="##">客服服务</a></li>
	</ul>
</div>
</div>
```

### 按钮(等分按钮)
等分按钮的效果在移动端上特别的实用. 整个按钮组宽度是容器的100%, 而按钮组里面的每个按钮平分整个容器宽度. 例如, 如果你按钮组里面有五个按钮, 那么每个按钮是20%的宽度, 如果有四个按钮, 那么每个按钮是25%宽度, 以此类推.等分按钮也常被称为是自适应分组按钮, 其实现方法也非常的简单, 只需要在按钮组“btn-group”上追加一个“btn-group-justified”类名, 如下所示：
```bash
<div class="btn-group btn-group-justified">
  <a class="btnbtn-default" href="#">首页</a>
  <a class="btnbtn-default" href="#">产品展示</a>
  <a class="btnbtn-default" href="#">案例分析</a>
  <a class="btnbtn-default" href="#">联系我们</a>
</div>
```
**在制作等分按钮组时, 请尽量使用&lt;a&gt;标签元素来制作按钮**, 因为使用&lt;button&gt;标签元素时, 使用display:table在部分浏览器下支持并不友好. 

### 按钮(垂直分组)
前面看到的示例, 按钮组都是水平显示的. 但在实际运用当中, 总会碰到垂直显示的效果. 在Bootstrap框架中也提供了这样的风格. 我们只需要把水平分组的“btn-group”类名**换成**“btn-group-vertical”即可. 

## 按钮下拉菜单
按钮下拉菜单仅从外观上看和上一节介绍的下拉菜单效果基本上是一样的. 不同的是在普通的下拉菜单的基础上**封装了按钮(.btn)样式效果**. 简单点说就是点击一个按钮, 会显示隐藏的下拉菜单. 按钮下拉菜单其实就是普通的下拉菜单, 只不过把“&lt;a&gt;”标签元素换成了“&lt;button&gt;”标签元素. 唯一不同的是外部容器“div.dropdown”换成了“div.btn-group”. 
.btn-group 元素是内联元素 .dropdown 元素是块状元素
按钮的向下向上三角形:按钮的向下三角形, 我们是通过在&lt;button&gt;标签中添加一个“&lt;span&gt;”标签元素, 并且命名为“caret”:
``` bash
<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
	按钮下拉菜单<span class="caret"></span>
</button>
```

有的时候我们的下拉菜单会向上弹起(接下来一个小节会介绍), 这个时候我们的三角方向需要朝上显示, 实现方法：需要在“.btn-group”类上**追加**“dropup”类名(这也是做向上弹起下拉菜单要用的类名). 

## 向上弹起的下拉菜单
有些菜单是需要向上弹出的, 比如说你的菜单在页面最底部, 而这个菜单正好有一个下拉菜单, 为了让用户有更好的体验, 不得不让下拉菜单向上弹出. 在Bootstrap框架中专门为这种效果提代了一个类名“dropup”. 使用方法正如前面所示, 只需要在“btn-group”上添加这个类名(当然, 如果是普通向上弹出下拉菜单, 你只需要在“dropdown”类名基础上追加“dropup”类名即可). 

小笔记:
1.实现普通下拉菜单：.dropdown>button.dropdown-toggle[data-toggle="dropdown"]+ul.dropdown-menu;
2.按钮下拉菜单：把.dropdown换成.btn-group即可. 
3.下拉菜单变上拉菜单：.dropdown.dropup或.btn-group.dropup
4.下拉菜单通过绝对定位实现, 可通过设置top,bottom,left,right改变下拉菜单出现的位置. 
5.dropdown-header,li.divider,li.active,li.disabled

## 导航(基础样式)
Bootstrap框架中制作导航条主要通过“.nav”样式. 默认的“.nav”样式不提供默认的导航样式, 必须附加另外一个样式才会有效, 比如“nav-tabs”、“nav-pills”之类. 比如有一个tab导航条的例子, 他的实现方法就是为ul标签加入.nav和nav-tabs两个类样式. 
``` bash
<ul class="nav nav-tabs">
  <li><a href="##">Home</a></li>
  <li><a href="##">CSS3</a></li>
 	<li><a href="##">Sass</a></li>
 	<li><a href="##">jQuery</a></li>
 	<li><a href="##">Responsive</a></li>
</ul>
```

### 导航(标签形tab导航)
标签形导航, 也称为选项卡导航. 特别是在很多内容分块显示的时, 使用这种选项卡来分组十分适合.标签形导航是通过“nav-tabs”样式来实现.在制作标签形导航时需要在原导航“nav”上追加此类名.其实上例的效果和我们平时看到的选项卡效果并不一致. 一般情况之下, 选项卡教会有一个当前选中项. 其实在Bootstrap框架也相应提供了. 假设我们想让“Home”项为当前选中项, 只需要在其标签上添加类名“active”即可; 除了当前项之外, 有的选项卡还带有禁用状态, 实现这样的效果, 只需要在标签项上添加“disabled”即可.

### 导航(胶囊形(pills)导航)
胶囊形(pills)导航听起来有点别扭, 因为其外形看起来有点像胶囊形状. 但其更像我们平时看到的大众形导航. 当前项高亮显示, 并带有圆角效果. 其实现方法和“nav-tabs”类似,同样的结构, 只需要把类名“nav-tabs”换成“nav-pills”即可.

### 导航(垂直堆叠的导航)
在实际运用当中, 除了水平导航之外, 还有垂直导航, 就类似前面介绍的垂直排列按钮一样. 制作**垂直堆叠导航只需要在“nav-pills”的基础上添加一个“nav-stacked”类名**即可.
大家是否还记得, 在下拉菜单一节中, 下拉菜单组与组之间有一个分隔线. 其实在垂直堆叠导航也具有这样的效果, 只需要添加在导航项之间添加“&lt;li class=”nav-divider”&gt;&lt;/li&gt;”即可

### 自适应导航
自适应导航指的是导航占据容器全部宽度, 而且菜单项可以像表格的单元格一样自适应宽度. 自适应导航和前面使用“btn-group-justified”制作的自适应按钮组是一样的. 只不过在制作自适应导航时更换了另一个类名“nav-justified”. 当然他需要和“nav-tabs”或者“nav-pills”配合在一起使用. 如：
``` bash
<ul class="nav nav-tabs nav-justified">
	<li class="active"><a href="##">Home</a></li>
	<li><a href="##">CSS3</a></li>
	<li><a href="##">Sass</a></li>
	<li><a href="##">jQuery</a></li>
	<li><a href="##">Responsive</a></li>
</ul>
```

## 导航加下拉菜单(二级导航)
在Bootstrap框架中制作二级导航就更容易了. 只需要将li当作父容器, 使用类名“dropdown”, 同时在li中嵌套另一个列表ul, 使用前面介绍下拉菜单的方法就可以：
``` bash
<ul class="nav nav-pills">
	<li class="active"><a href="##">首页</a></li>
	<li class="dropdown">
		<a href="##" class="dropdown-toggle" data-toggle="dropdown">教程<span class="caret"></span></a>
			<ul class="dropdown-menu">
				<li><a href="##">CSS3</a></li>
            …
			</ul>
	</li>
	<li><a href="##">关于我们</a></li>
</ul>
```

## 面包屑式导航
面包屑(Breadcrumb)一般用于导航, 主要是起的作用是告诉用户现在所处页面的位置(当前位置). 在Bootstrap框架中面包屑也是一个独立模块组件
``` bash
<ol class="breadcrumb">
  <li><a href="#">首页</a></li>
  <li><a href="#">我的书</a></li>
  <li class="active">《图解CSS3》</li>
</ol> 
```

---


# 导航条,分页导航
## 导航条基础
导航条(navbar)和上一节介绍的导航(nav), 就相差一个字, 多了一个“条”字. 其实在Bootstrap框架中他们还是明显的区别. 在导航条(navbar)中有一个**背景色、而且导航条可以是纯链接(类似导航), 也可以是表单, 还有就是表单和导航一起结合等多种形式**. 在这一节中将一起探讨Bootstrap框架中导航条的使用. 
``` bash
<!--基本导航条-->
<div class="navbar navbar-default" role="navigation">
	<ul class="nav navbar-nav">
		<li class="active"><a href="##">网站首页</a></li>
		<li><a href="##">系列教程</a></li>
		<li><a href="##">名师介绍</a></li>
		<li><a href="##">成功案例</a></li>
		<li><a href="##">关于我们</a></li>
	</ul>
</div>
```
``` bash
<div class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
  　 <a href="##" class="navbar-brand">慕课网</a>
  </div>
  <ul class="nav navbar-nav">
	  <li class="active"><a href="##">网站首页</a></li>
      <li class="dropdown">
        <a href="##" data-toggle="dropdown" class=" dropdown-toggle">系列教程<span class="caret"></span></a>
        <ul class="dropdown-menu">
        	<li><a href="##">CSS3</a></li>
        	<li><a href="##">JavaScript</a></li>
        	<li class=""><a href="##">PHP</a></li>
        </ul>
     </li>
      <li><a href="##">名师介绍</a></li>
      <li><a href="##">成功案例</a></li>
      <li><a href="##">关于我们</a></li>
	  </ul>
  <form action="##" class="navbar-form navbar-left" rol="search">
   	<div class="form-group">
   		<input type="text" class="form-control" placeholder="请输入关键词" />
   	</div>
      <button type="submit" class="btn btn-default">搜索</button>
    </form>
</div>
```

## 基础导航条
在Bootstrap框中, 导航条和导航从外观上差别不是太多, 但在实际使用中导航条要比导航复杂得多. 我们先来看导航条中最基础的一个——基础导航条. 
第一步：首先在制作导航的列表(&lt;ul class=”nav”&gt;)基础上添加类名“navbar-nav”
第二步：在列表外部添加一个容器(div), 并且使用类名“navbar”和“navbar-default”

## 为导航条添加标题、二级菜单及状态
### 加入导航条标题
在Web页面制作中, 常常在菜单前面都会有一个标题(文字字号比其它文字稍大一些), 其实在Bootstrap框架也为大家做了这方面考虑, 其通过“navbar-header”和“navbar-brand”来实现.
``` bash
<div class="navbar-header">
	<a href="##" class="navbar-brand">慕课网</a>
</div>
```

### 导航条状态、二级菜单
同样的, 在基础导航条中对菜单提供了当前状态, 禁用状态, 悬浮状态等效果, 而且也可以带有二级菜单的导航条
``` bash
<!--导航条状态及二级菜单-->
<div class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
  　<a href="##" class="navbar-brand">慕课网</a>
  </div>
	<ul class="nav navbar-nav">
	 	<li class="active"><a href="##">网站首页</a></li>
        <li class="dropdown">
          <a href="##" data-toggle="dropdown" class="dropdown-toggle">系列教程<span class="caret"></span></a>
          <ul class="dropdown-menu">
						<li><a href="##">CSS3</a></li>
						<li><a href="##">JavaScript</a></li>
						<li class="disabled"><a href="##">PHP</a></li>
          </ul>
				</li>
		<li><a href="##">名师介绍</a></li>
		<li class="active"><a href="##">成功案例</a></li>
		<li><a href="##">关于我们</a></li>
	</ul>
</div>
```
**注意: a 中类不要加 btn ,否则样式不一致.**

## 带表单的导航条
在Bootstrap框架中提供了一个“navbar-form”, 使用方法很简单, 在navbar容器中放置一个带有navbar-form类名的表单.大家看到了“navbar-left”让表单左浮动, 更好实现对齐. 在Bootstrap框架中, 还提供了“navbar-right”样式, 让元素在导航条靠右对齐. 

## 导航条中的按钮、文本和链接
Bootstrap框架的导航条中除了使用navbar-brand中的a元素和navbar-nav的ul和navbar-form之外, 还可以使用其他元素. 框架提供了三种其他样式
1、导航条中的按钮navbar-btn
2、导航条中的文本navbar-text
3、导航条中的普通链接navbar-link

## 固定导航条
使用方法很简单, 只需要在制作导航条最外部容器navbar上追加对应的类名即可：
``` bash
<div class="navbar navbar-default navbar-fixed-top" role="navigation"> 或
<div class="navbar navbar-default navbar-fixed-bottom" role="navigation">
```
从运行效果中大家不难发现, 页面主内容顶部和底部都被固定导航条给遮住了. **为了避免固定导航条遮盖内容, 我们需要在body上做一些处理**

## 响应式导航条
如今浏览Web页面的终端不在是一尘不变了, 前面示例实现的导航条仅能适配于大屏幕的浏览器, 但当浏览器屏幕变小的时候, 就不适合了. 因此响应式设计也就随之而来. 那么在一个响应式的Web页面中, 对于响应式的导航条也就非常的重要. 
使用方法：
1、保证在窄屏时需要折叠的内容必须包裹在带一个div内, 并且为这个div加入collapse、navbar-collapse两个类名. 最后为这个div添加一个class类名或者id名. 
2、保证在窄屏时要显示的图标样式(固定写法)：
``` bash
<button class="navbar-toggle" type="button" data-toggle="collapse">
  <span class="sr-only">Toggle Navigation</span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
  <span class="icon-bar"></span>
</button>
```
3、并为button添加data-target=".类名/#id名", 究竞是类名还是id名呢？由需要折叠的div来决定. 如：
需要折叠的div代码段：
``` bash
<div class="collapse navbar-collapse" id="example">
	<ul class="nav navbar-nav">
	…
	</ul>
</div>
```
窄屏时显示的图标代码段：
``` bash
<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#example">
  ...
</button>
```
也可以这么写, 需要折叠的div代码段：
``` bash
<div class="collapse navbar-collapse example" >
	<ul class="nav navbar-nav">
	…
	</ul>
</div>
```
窄屏时要显示的图标：
``` bash
<button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".example">
  ...
</button>
```


完整:
``` bash
<div class="navbar navbar-default" role="navigation">
  <div class="navbar-header">
	　<!-- .navbar-toggle样式用于toggle收缩的内容, 即nav-collapse collapse样式所在元素 -->
		<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#ff">
		<!--<span class="sr-only">Toggle Navigation</span>-->
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		</button>
		<!-- 确保无论是宽屏还是窄屏, navbar-brand都显示 -->
		<a href="##" class="navbar-brand">慕课网</a>
  </div>
  <!-- 屏幕宽度小于768px时, div.navbar-responsive-collapse容器里的内容都会隐藏, 
		显示icon-bar图标, 当点击icon-bar图标时, 再展开. 屏幕大于768px时, 默认显示.  -->
  <div class="collapse navbar-collapse navbar-responsive-collapse" id="ff">
		<ul class="nav navbar-nav">
			<li class="active"><a href="##">网站首页</a></li>
			<li><a href="##">系列教程</a></li>
			<li><a href="##">名师介绍</a></li>
			<li><a href="##">成功案例</a></li>
			<li><a href="##">关于我们</a></li>
	 	</ul>
  </div>
</div>
```

## 反色导航条
反色导航条其实是Bootstrap框架为大家提供的第二种风格的导航条, 与默认的导航条相比, 使用方法并无区别, 只是将navbar-deafult类名换成navbar-inverse. 其变化只是导航条的背景色和文本做了修改. 

nav navbar-default默认导航条 nav-inverse反色导航条
navbar-fixed-top/bottom固定导航条
nav navbar-nav 导航条中的导航div类
navbar-form 导航表单
navbar-left左对齐
navbar-right右对齐

## 分页导航(带页码的分页导航)
使用方法：
平时很多同学喜欢用div&gt;a和div&gt;span结构来制作带页码的分页导航. 不过, 在Bootstrap框架中使用的是ul&gt;li&gt;a这样的结构, 在ul标签上加入pagination方法：
``` bash
<ul class="pagination">
   <li><a href="#">&laquo;</a></li>
   <li><a href="#">1</a></li>
   <li><a href="#">2</a></li>
   <li><a href="#">3</a></li>
   <li><a href="#">4</a></li>
   <li><a href="#">5</a></li>
   <li><a href="#">&raquo;</a></li>
</ul>
```
注意：要禁用当前状态和禁用状态不能点击, 我们还要依靠js来实现, 或者将这两状态下的a标签换成span标签. 

大小设置：
在Bootstrap框架中, 也可以通过几个不同的情况来设置其大小. 类似于按钮一样：
1、通过“pagination-lg”让分页导航变大；
2、通过“pagination-sm”让分页导航变小：  没有xs 这一说.

### 分页导航(翻页分页导航)
Bootstrap框架除了提供带页码的分页导航之外还提供了翻页导航. 这种分页导航常常在一些简单的网站上看到, 比如说个人博客, 杂志网站等. 这种分页导航是看不到具体的页码, 只会提供一个“上一页”和“下一页”的按钮. 
使用方法：
在实际使用中, 翻页分页导航和带页码的分页导航类似, 为ul标签加入pager类

#### 对齐样式设置
默认情况之下, 翻页分页导航是居中显示, 但有的时候我们需要一个居左, 一个居右. Bootstrap框架提供了两个样式：
☑   previous: 让“上一步”按钮居左
☑   next: 让“下一步”按钮居右

#### 状态样式设置：
和带页码分页导航一样, 如果在li标签上添加了disabled类名的时候, 分页按钮处于禁用状态, 但同样不能禁止其点击功能. 你可以通过js来处理, 或将a标签换成span标签. 

## 标签
使用方法很简单, 你可以在使用span这样的行内标签：
``` bash
<span class="label label-default">默认标签</span>
<span class="label label-primary">主要标签</span>
<span class="label label-success">成功标签</span>
<span class="label label-info">信息标签</span>
<span class="label label-warning">警告标签</span>
<span class="label label-danger">错误标签</span> 
```
## 徽章
使用方法, 其实也没什么太多可说的, 你可以像标签一样, 使用span标签来制作, 然后为他加入badge类：
``` bash
<a href="#">Inbox <span class="badge">42</span></a>
<span class="badge pull-right">42</span>
```

---

# 其他内置组件
## 缩略图
缩略图在网站中最常用的地方就是产品列表页面, 一行显示几张图片, 有的在图片底下(左侧或右侧)带有标题、描述等信息. Bootstrap框架将这一部独立成一个模块组件. 并通过“thumbnail”样式配合bootstrap的网格系统来实现. 可以将产品列表页变得更好看. 
通过“thumbnail”样式配合bootstrap的网格系统来实现. 
``` bash
<div class="container">
	<div class="row">
		<div class="col-xs-6 col-md-3">
			<a href="#" class="thumbnail">
				<img src="http://img.mukewang.com/5434eba100014fe906000338.png" style="height: 180px; width: 100%; display: block;" alt="">
			</a>
		</div>
    …
	</div>
</div>
```

上面的结构表示的是在宽屏幕(可视区域大于768px)的时候, 一行显示四个缩略图(单击全屏查看效果).
在窄屏(可视区域小于768px)的时候, 一行只显示两个缩略图.
上一小节, 展示的仅只有缩略图的一种使用方式, 除了这种方式之外, 还可以让缩略图配合标题、描述内容, 按钮等
在仅有缩略图的基础上, 添加了一个div名为“caption“的容器, 在这个容器中放置其他内容, 比如说标题, 文本描述, 按钮等：
``` bash
<div class="container">
  <div class="row">
    <div class="col-xs-6 col-md-3">
      <a href="#" class="thumbnail">
        <img src="http://a.hiphotos.baidu.com/image/w%3D400/sign=c56d7638b0b7d0a27bc9059dfbee760d/3b292df5e0fe9925d46873da36a85edf8cb171d7.jpg" style="height: 180px; width: 100%; display: block;" alt="">
      </a>
			<div class="caption">
				<h3>Bootstrap框架系列教程</h3>
				<p>Bootstrap框架是一个优秀的前端框, 就算您是一位后端程序员或者你是一位不懂设计的前端人员, 你也能依赖于Bootstrap制作做优美的网站...</p>
				<p>
					<a href="##" class="btn btn-primary">开始学习</a>
					<a href="##" class="btn btn-info">正在学习</a>
				</p>
			</div>
		</div>
    …
  </div>
</div>
```


## 警示框
在网站中, 网页总是需要和用户一起做沟通与交流. 特别是当用户操作上下文为用户提供一些有效的警示框, 比如说告诉用户操作成功、操作错误、提示或者警告等. 
``` bash
<h2>默认警示框</h2>
<div class="alert alert-success" role="alert">恭喜您操作成功！</div>
```
``` bash
<h2>可关闭的警示框</h2>
<div class="alert alert-success alert-dismissable" role="alert">
恭喜您操作成功！
    <button class="close" type="button" data-dismiss="alert">&times;</button>
</div>
```
**data-dismiss="alert"**

``` bash
<h2>警示框的链接</h2>
<div class="alert alert-success" role="alert">
    <strong>Well done!</strong> 
    You successfully read 
	<a href="#" class="alert-link">this important alert message</a>
	.
</div>
```


## 进度条
在网页中, 进度条的效果并不少见, 比如一个评分系统, 比如加载状态等. 
``` bash
<h2>基本进度条</h2>
<div class="progress">
  <div class="progress-bar" style="width:40%">
  </div>
</div> 
```
``` bash
<h2>彩色进度条</h2>
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width:40%"></div>
</div> 
```
``` bash
<h2>条纹进度条</h2> // 把progress-striped active 加在最外层的div 
//就不用一个个的来控制这个斑马纹了 可以全部控制
<div class="progress progress-striped">
  <div class="progress-bar progress-bar-success" style="width:40%"></div>
</div>
```
``` bash
<h2>动态条纹进度条</h2>
<div class="progress progress-striped active">
  <div class="progress-bar progress-bar-success" style="width:40%"></div>
</div> 
```
``` bash
<h2>层叠进度条</h2>
<h5>正常层叠进度条</h5>    // width 总和小于100%
<div class="progress">
	<div class="progress-bar progress-bar-success" style="width:20%"></div>
	<div class="progress-bar progress-bar-info" style="width:10%"></div>
	<div class="progress-bar progress-bar-warning" style="width:30%"></div>
	<div class="progress-bar progress-bar-danger" style="width:15%"></div>
</div> 
```
``` bash
<h2>带Label的进度条</h2>
<h5>进度条1</h5>
<div class="progress">
  <div class="progress-bar progress-bar-success"  role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width:20%">20%</div>  
</div>  
```


## 媒体对象
``` bash
<h3>默认媒体对象</h3>
<div class="media">
  <a class="pull-left" href="#">
    <img class="media-object" src="http://img.mukewang.com/52e1d29d000161fe06000338-300-170.jpg" alt="...">
  </a>
  <div class="media-body">
    <h4 class="media-heading">系列：十天精通CSS3</h4>
    <div>全方位深刻详解CSS3模块知识, 经典案例分析, 代码同步调试, 让网页穿上绚丽装备！</div>
  </div>
</div>
```
``` bash
<h3>媒体对象的嵌套</h3>
<div class="media">
  <a class="pull-left" href="#">
    <img class="media-object" src="http://a.disquscdn.com/uploads/users/3740/2069/avatar92.jpg?1406972031" alt="...">
	</a>
	<div class="media-body">
		<h4 class="media-heading">我是大漠</h4>
		<div>我是W3cplus站长大漠, 我在写Bootstrap框中的媒体对象测试用例</div>
		<div class="media">
			<a class="pull-left" href="#">
				<img class="media-object" src="http://tp2.sinaimg.cn/3306361973/50/22875318196/0" alt="...">
			</a>
			<div class="media-body">
				<h4 class="media-heading">慕课网</h4>
				<div>大漠写的《玩转Bootstrap》系列教程即将会在慕课网上发布</div>
				<div class="media">
					<a class="pull-left" href="#">
						<img class="media-object" src="http://tp4.sinaimg.cn/1167075935/50/22838101204/1" alt="...">
					</a>
					<div class="media-body">
						<h4 class="media-heading">W3cplus</h4>
						<div>W3cplus站上还有很多教程....</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
```
``` bash
<h3>媒体对象列表</h3>
<ul class="media-list">
  <li class="media">
    <a class="pull-left" href="#">
      <img class="media-object" src="http://a.disquscdn.com/uploads/users/3740/2069/avatar92.jpg?1406972031" alt="...">
    </a>
		<div class="media-body">
			<h4 class="media-heading">我是大漠</h4>
      <div>我是W3cplus站长大漠, 我在写Bootstrap框中的媒体对象测试用例</div>
    </div>
  </li>
  <li class="media">
		<a class="pull-left" href="#">
				<img class="media-object" src="http://tp2.sinaimg.cn/3306361973/50/22875318196/0" alt="...">
		</a>
    <div class="media-body">
      <h4 class="media-heading">慕课网</h4>
      <div>大漠写的《玩转Bootstrap》系列教程即将会在慕课网上发布</div>
    </div>
  </li>
  <li class="media">
		<a class="pull-left" href="#">
			<img class="media-object" src="http://tp4.sinaimg.cn/1167075935/50/22838101204/1" alt="...">
		</a>
		<div class="media-body">
			<h4 class="media-heading">W3cplus</h4>
			<div>W3cplus站上还有很多教程....</div>
		</div>
  </li>
</ul>
```

默认:媒体对象一般是成组出现, 而一组媒体对象常常包括以下几个部分：
☑  媒体对像的容器：常使用“media”类名表示, 用来容纳媒体对象的所有内容
☑  媒体对像的对象：常使用“media-object”表示, 就是媒体对象中的对象, 常常是图片
☑  媒体对象的主体：常使用“media-body”表示, 就是媒体对像中的主体内容, 可以是任何元素, 常常是图片侧边内容
☑  媒体对象的标题：常使用“media-heading”表示, 就是用来描述对象的一个标题, 此部分可选
除了上面四个部分之外, 在Bootstrap框架中还常常使用“pull-left”或者“pull-right”来控制媒体对象中的对象浮动方式. 
嵌套:从外往里看, 这里有三个媒体对象, 只不过是一个嵌套在另一个的里面. 那么在Bootstrap框架中的媒体对象也具备这样的功能, 只需要将另一个媒体对象结构放置在媒体对象的主体内“media-body”, 
列表:针对上图的媒体对象列表效果, Bootstrap框架提供了一个列表展示的效果, 在写结构的时候可以使用ul, 并且在ul上添加类名“media-list”, 而在li上使用“media”.



## 列表组
``` bash
<h3>基础列表组</h3>
<ul class="list-group">
  <li class="list-group-item">揭开CSS3的面纱</li>
  <li class="list-group-item">CSS3选择器</li>
	<li class="list-group-item">CSS3边框</li>
	<li class="list-group-item">CSS3背景</li>
	<li class="list-group-item">CSS3文本</li>
</ul>
```
``` bash
<h3>带徽章的列表组</h3>
<ul class="list-group">
  <li class="list-group-item">
    <span class="badge">13</span>揭开CSS3的面
	</li>
	<li class="list-group-item">
		<span class="badge">456</span>CSS3选择器
	</li>
	<li class="list-group-item">
		<span class="badge">892</span>CSS3边框
	</li>
	<li class="list-group-item">
		<span class="badge">90</span>CSS3背景
	</li>
	<li class="list-group-item">
		<span class="badge">1290</span>CSS3文本
	</li>
</ul>
```
``` bash
<h3>带链接的列表组</h3>
<ul class="list-group">
    <li class="list-group-item">
    	<a href="##">揭开CSS3的面</a>
	</li>
	<li class="list-group-item">
		<a href="##">CSS3选择器</a>
	</li>
	<li class="list-group-item">
		<a href="##">CSS3边框</a>
	</li>
	<li class="list-group-item">
		<a href="##">CSS3背景</a>
	</li>
	<li class="list-group-item">
		<a href="##">CSS3文本</a>
	</li>
</ul>
```
``` bash
<h3>自定义列表组</h3>
<div class="list-group">
	<a href="##" class="list-group-item">
		<h4 class="list-group-item-heading">图解CSS3</h4>
		<p class="list-group-item-text">
			详细讲解了选择器、边框、背景、文本、颜色、盒模型、伸缩布局盒模型、多列布局、渐变、过渡、动画、媒体、响应Web设计、Web字体等主题下涵盖的所有CSS3新特性...
		</p>
	</a>
	<a href="##" class="list-group-item">
		<h4 class="list-group-item-heading">Sass中国</h4>
		<p class="list-group-item-text">致力于为中国开发者提供最全面, 最具影响力, 最前沿的Sass相关技术与教程...</p>
	</a>
</div>
```
``` bash
<h3>组合列表项的状态</h3>
<div class="list-group">
	<a href="##" class="list-group-item active"><span class="badge">5902</span>图解CSS3</a>
	<a href="##" class="list-group-item"><span class="badge">15902</span>W3cplus</a>
	<a href="##" class="list-group-item"><span class="badge">59020</span>慕课网</a>
	<a href="##" class="list-group-item disabled"><span class="badge">0</span>Sass中国</a>
</div>
```
``` bash
<h3>多彩列表组</h3>
<div class="list-group">
	<a href="##" class="list-group-item active"><span class="badge">5902</span>图解CSS3</a>
	<a href="##" class="list-group-item list-group-item-success"><span class="badge">15902</span>W3cplus</a>
	<a href="##" class="list-group-item list-group-item-info"><span class="badge">59020</span>慕课网</a>
	<a href="##" class="list-group-item list-group-item-warning"><span class="badge">0</span>Sass中国</a>
	<a href="##" class="list-group-item list-group-item-danger"><span class="badge">10</span>Mobile教程</a>
</div>
```



## 面板
``` bash
<h3>基础面板</h3>
<div class="panel panel-default">
  <div class="panel-body">我是一个基础面板, 带有默认主题样式风格</div>
</div>
```
``` bash
<h3>带有头和尾的面板</h3>
<div class="panel panel-default">
  <div class="panel-heading">图解CSS3</div>
  <div class="panel-body">
		详细讲解了选择器、边框、背景、文本、颜色、盒模型、伸缩布局盒模型、多列布局、渐变、过渡、动画、媒体、响应Web设计、Web字体等主题下涵盖的所有CSS3新特性
	</div>
	<div class="panel-footer">作者：大漠</div>
</div>
```
``` bash
<h3>彩色面板</h3>
<div class="panel panel-default">
	<div class="panel-heading">图解CSS3</div>
	<div class="panel-body">			详细讲解了选择器、边框、背景、文本、颜色、盒模型、伸缩布局盒模型、多列布局、渐变、过渡、动画、媒体、响应Web设计、Web字体等主题下涵盖的所有CSS3新特性
	</div>
	<div class="panel-footer">作者：大漠</div>
</div>
<div class="panel panel-primary">
	<div class="panel-heading">图解CSS3</div>
	<div class="panel-body">
	详细讲解了选择器、边框、背景、文本、颜色、盒模型、伸缩布局盒模型、多列布局、渐变、过渡、动画、媒体、响应Web设计、Web字体等主题下涵盖的所有CSS3新特性
	</div>
```
``` bash
<h3>面板中嵌套表格</h3>
<div class="panel panel-default">
	<div class="panel-heading">图解CSS3</div>
	<div class="panel-body">
		<p>详细讲解了选择器、边框、背景、文本、颜色、盒模型、伸缩布局盒模型、多列布局、渐变、过渡、动画、媒体、响应Web设计、Web字体等主题下涵盖的所有CSS3新特性
		</p>
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>＃</th>
					<th>我的书</th>
					<th>发布时间</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<td>《图解CSS3》</td>
					<td>2014-07-10</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="panel-footer">作者：大漠</div>
</div>
```
在实际应用运中, 你或许希望表格和面板边缘不需要有任何的间距. 但由于panel-body设置了一个padding：15px的值, 为了实现这样的效果. 我们在**实际使用的时候需要把table提取到panel-body外面.**

---

# js插件简介
## js库
Bootstrap除了包含丰富的Web组件之外, 如前面介绍的下拉菜单、按钮组、导航、分页等. 他还包括一些JavaScript的插件. 
Bootstrap的JavaScript插件可以单独导入到页面中, 也可以一次性导入到页面中. 因为在Bootstrap中的JavaScript插件都是依赖于jQuery库, 所以不论是单独导入还一次性导入之前必须先导入jQuery库. 
``` bash
<!—导入jQuery版本库, 因为Bootstrap的JavaScript插件依赖于jQuery -->
<script src="http://libs.baidu.com/jquery/1.9.0/jquery.js"></script>
<!—- 一次性导入所有Bootstrap的JavaScript插件(压缩版本) -->
<script src="js/bootstrap.min.js"></script>
```
特别声明：jQuery版本库也可以加载你本地的jQuery版本. 

## 动画过渡(Transitions)
transition.js文件为Bootstrap具有过渡动画效果的组件提供了动画过渡效果. 不过需要注意的是, 这些过渡动画都是采用CSS3来实现的, 所以IE6-8浏览器是不具备这些过渡动画效果. 
默认情况之下, Bootstrap框架中以下组件使用了过渡动画效果：
☑ 模态弹出窗(Modal)的滑动和渐变效果；
☑ 选项卡(Tab)的渐变效果；
☑ 警告框(Alert)的渐变效果；
☑ 图片轮播(Carousel)的滑动效果. 

``` bash
<button class="btn btn-primary" type="button">点击我</button>
<div class="modal fade" id="mymodal">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				<h4 class="modal-title">模态弹出窗标题</h4>
			</div>
			<div class="modal-body">
				<p>模态弹出窗主体内容</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				<button type="button" class="btn btn-primary">保存</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script>
  $(function(){
    $(".btn").click(function(){
      $("#mymodal").modal("toggle");
    });
  });
</script>
```

## 模态弹出框(Modals)
在 Bootstrap 框架中把模态弹出框统一称为 Modal. 这种弹出框效果在大多数 Web 网站的交互中都可见. 比如点击一个按钮弹出一个框, 弹出的框可能是一段文件描述, 也可能带有按钮操作, 也有可能弹出的是一张图片. 

## 模态弹出框--结构分析
Bootstrap框架中的模态弹出框, 分别运用了“modal”、“modal-dialog”和“modal-content”样式, 而弹出窗真正的内容都放置在“modal-content”中, 其主要又包括三个部分：
☑ 弹出框头部, 一般使用“modal-header”表示, 主要包括标题和关闭按钮
☑ 弹出框主体, 一般使用“modal-body”表示, 弹出框的主要内容
☑ 弹出框脚部, 一般使用“modal-footer”表示, 主要放置操作按钮

## 模态弹出框--实现原理解析
实现原理解析：
bootstrap中的“模态弹出框”有以下几个特点：
1、模态弹出窗是固定在浏览器中的. 
2、单击右侧全屏按钮, 在全屏状态下, 模态弹出窗宽度是自适应的, 而且modal-dialog水平居中. 
3、当浏览器视窗大于768px时, 模态弹出窗的宽度为600px. 

两种尺寸选择：
除此之外, Bootstrap框架还为模态弹出窗提供了不同尺寸, 一个是大尺寸样式“modal-lg”, 另一个是小尺寸样式“modal-sm”. 其结构上稍做调整
``` bash
<div class="modal-dialog modal-lg">
       <divclass="modal-content"> ... </div>
</div>
```

## 模态弹出框--触发模态弹出窗2种方法
声明式触发方法：
方法一：模态弹出窗声明, 只需要自定义两个必要的属性：data-toggle和data-target(bootstrap中声明式触发方法一般依赖于这些自定义的data-xxx 属性. 比如data-toggle="" 或者 data-dismiss=""). 
``` bash
<!-- 触发模态弹出窗的元素 -->
<button type="button" data-toggle="modal" data-target="#mymodal" class="btn btn-primary">点击我会弹出模态弹出窗</button>
<!-- 模态弹出窗 -->
<div class="modal fade" id="mymodal">
	<div class="modal-dialog">
		<div class="modal-content">
			<!-- 模态弹出窗内容 -->
		</div>
	</div>
</div>
```
注意以下事项：
1、data-toggle必须设置为modal(toggle中文翻译过来就是触发器)；
2、data-target可以设置为CSS的选择符, 也可以设置为模态弹出窗的ID值, 一般情况设置为模态弹出窗的ID值, 因为ID值是唯一的值. 

方法二：触发模态弹出窗也可以是一个链接&lt;a&gt;元素, 那么可以使用链接元素自带的href属性替代data-target属性, 如：
``` bash
<!-- 触发模态弹出窗的元素 -->
<a data-toggle="modal" href="#mymodal" class=" btn btn-primary" >点击我会弹出模态弹出窗</a>
<!-- 模态弹出窗 -->
<div class="modal fade"  id="mymodal" >
  <div class="modal-dialog" >
    <div class="modal-content" >
      <!-- 模态弹出窗内容 -->
    </div>
  </div>
</div>
```
不过建议还是使用统一使用data-target的方式来触发.
 
## 模态弹出框--为弹出框增加过度动画效果
可通过给“.modal”增加类名“fade”为模态弹出框增加一个过渡动画效果. 

## 模态弹出框--模态弹出窗的使用(data-参数说明)
除了通过data-toggle和data-target来控制模态弹出窗之外, Bootstrap框架针对模态弹出框还提供了其他自定义data-属性, 来控制模态弹出窗. 比如说:是否有灰色背景modal-backdrop, 是否可以按ESC键关闭模态弹出窗. 有关于Modal弹出窗自定义属性相关说明如下所示
![modal-attr](/images/modal-attr.png)

## 模态弹出框--模态弹出窗的使用(JavaScript触发)
JavaScript触发方法
除了使用自定义属性触发模态弹出框之外, 还可以通过JavaScript方法来触发模态弹出窗. 通过给一个元素一个事件, 来触发. 比如说给一个按钮一个单击事件, 然后触发模态弹出窗. 

## JavaScript触发时的参数设置
使用JavaScript触发模态弹出窗时, Bootstrap框架提供了一些设置, 主要包括属性设置、参数设置和事件设置. 比如你不想让用户按ESC键关闭模态弹出窗, 你就可以这样做：
``` bash
$(function(){
  $(".btn").click(function(){
    $("#mymodal").modal({
      keyboard:false
    });
  });
});
```

---
title: vue组件开发之组件通信
date: 2017-08-24 18:43:34
tags: vue 组件开发
---

最近的学习工作中都用到了饿了么的[element-ui](http://element.eleme.io), 以及移动端的[Mint-ui](https://mint-ui.github.io/#!/zh-cn), 借此机会, 想深入学习Vue的组件开发流程及原理, 故写此篇博客, 记录所学及所感. 
<!-- more -->
---
本例程以一个table组件为例, 至于为什么想做这个table组件, 是看到element-ui中有这么一个强大的table组件, 感到很好奇. 本篇讲解组件间通信(父子/非父子), 以及运用slot的使用方法(下篇).

# 基本构造
```javascript
// in UlTest.vue 组件测试用例
<template>
	<t-table :items="items" border center>
  	<t-table-item
  	label="操作">
  		<template scope="prop">
  			<el-button type="primary" @click="showData(prop.index, prop.rowData)">删除{{prop.text}}</el-button>
  		</template>
  	</t-table-item>
  	<t-table-item
			label="数字"
			width="120px"
			prop="text"
  	></t-table-item>
  	<t-table-item
			label="年龄"
			width="150px"
			prop="age"
  	></t-table-item>
  	<t-table-item
			label="名字"
			prop="name"
  	></t-table-item>
	</t-table>
</template>

<script>
	export default {
		data(){
			return {
				items: [
					{
						text: '123',
						name: 'tzx',
						age: 13
					},
					{
						text: '456',
						name: 'hanya',
						age:12
					}
				]
			}
		},
		methods: {
			click(){
				alert('click')
			},
			showData(index, data){
				console.log(index, data);
			}
		},
		components: {
			// TTable, TTableItem组件已在全局注册!!!
		},
		mounted(){
			console.log('UlTest is mounted');
		}
	}
</script>
```
所有代码可在[这里](https://github.com/Tzxhy/myVueAppSource/tree/master/src/components/nav2)找到. 
## 组件渲染顺序
在Vue中, 组件的渲染顺序是由里向外的. 在本例中, 会先渲染TTableItem, 其次是TTable(如果里面有其他组件, 会先渲染其他组件), 最后是UlTest组件. 
下图是Vue组件的生命周期图示
![生命周期](/images/vue生命周期.png)
由图可知, 在created事件完成时, 数据绑定和事件初始化完成, 当允许编译模板时(有el选项或者有template提供), 将模板编译成render函数, 因此, 当此时render函数中有其他组件时, 会进入此组件的生命周期. 所以, created钩子是从外组件到内组件的, 即外组件的created调用后, 才可能进入内部其他组件的生命周期钩子函数如created.
```javascript 
UlTest is created
TTable is created
TTableItem is created
TThead is created.
TTbody is created
4 TTableItem is mounted
TThead is mounted
TTbody is mounted111111
TTable is mounted
UlTest is mounted
```
对于mounted函数, 在同一组件层面的组件, 如TTable中的TThead和TTbody, 先created的组件会先mounted, 好理解吧??
理解清楚这些周期函数有助于理解组件间通信的问题.

## 父子组件通信
先说说简单的, 父子组件通信.
### 父对子通信
在最上面的UlTest.vue组件中, template元素下直接包含一个t-table组件, 可以理解为t-table是UlTest的子组件(不晓得这么理解对不对). 对t-table组件, 我们传递了3个参数, 一个是绑定的items参数, 两个是布尔值参数(border center). 在TTable.vue中:
```javascript
<script>
import TTbody from './TTbody'
import TThead from './TThead'
	export default {
		props: {
			items: {
				type: Array,
				default: ()=>[]
			},
			border: {
				type: Boolean,
			},
			center: {
				type: Boolean
			}
		},
		tableId: 1,
		components: {
			TTbody,
			TThead,
		},
		data(){
			return {
				dataTable: this.items,
				tableHeader: [],
				scopedSlot: null,
			}
		},
		computed: {
			tableRow(){
				return this.items;
			},
			_bus(){
				return this.$refs.bus;
			}
		},
		created(){
			this.$on('init',this.handle)
			this.$on('initScope',this.handleScope)
			console.log('TTable is created');
		},
		methods:{
			handle(d){
				this.tableHeader.push(d);
			},
			handleScope(d){
				if (d) {
					this.scopedSlot = d;
				}
			}
		},
		mounted(){
			console.log('TTable is mounted');
		}
	}
</script>
```
即在子组件中, 通过定义props对象, 即可完成子组件接受父组件的数据. 
props可以简单地定义为字符串数组(不能验证数据类型), 也可以定义为对象, 每个键为接收的参数名, 值对参数对象, 可设置type, required, default(数组/对象等引用类型的默认值需要使用函数返回数据),validator等. <br>
以上为父对子的通信, 下面看子对父的通信方式. <br>
### 子对父的通信
这里用一个简单的例子说明:
```javascript
<div id="app">
  <p>
    {{num}}
  </p>
  <t-t1 @change="changeNum">
  </t-t1>
  <t-t2>
  </t-t2>
</div>


var bus = new Vue();//简易事件触发/捕获器
var TT1 = {
    data() {
      return {
        num: 1,
      };
    },
    methods: {
      handle(d){
      	this.num = d;
      },
      changeFa(){
      	this.$emit('change',666);
      }
    },
    created(){
    	bus.$on('change', this.handle)
    },
    template: `<div><p>{{this.num}}</p><button @click="changeFa">发送1</button></div>`,
  };
  var TT2 = {
    data() {
      return {
        num: 1,
      };
    },
    methods: {
      send(){
      	bus.$emit('change', 4);
      }
    },
    template: `<div><p>{{this.num}}</p><button @click='send'>发送2</button></div>`,
  }
  var Main = {
    data() {
      return {
        num:1,
      };
    },
    methods: {
      changeNum(d){
      	this.num = d;
      }
    },
    components: {
    	TT1,
      TT2,
      
    }
  }
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
```
本例中, 包含了非父子通信的简单实现(分析见下节). <br>
主要说子对父通信. 在tt1组件中, 注册change事件, 绑定处理函数到父组件的changeNum函数上, 当子组件通过 vm.$emit('change', props)触发时, 会被父组件捕获并交由changeNum函数处理. 即完成了子对父的通信.

### 非父子通信
如上一节中代码所示, 可以let bus = new Vue(); 用bus作为简单的中间处理系统. 通过在不同组件中用bus.$on/.$emit注册/发送事件, 实现任意组件间的通信.

---
需要注意的, 在组件上注册事件时, 尽量用一个单词或者是中划线格式的, 如不能写 @changeNumber="changeNum", 可以改为@change="changeNum" 或者是change-number="changeNum", 并且, $emit中事件名分别对应'change'或者'change-number'

本篇完结, 大家鼓掌!!!明天更新关于slot/scopedSlot的相关实践.



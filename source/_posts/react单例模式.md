---
title: react单例模式
date: 2019-03-07 14:22:40
tags:
- react
- 单例
categories:
- react
---
# react单例组件的实现方式
说到react的单例，大家可能一哈子就想到了像Alert啊，弹层啊、Confirm啊之类的。没毛病。单例嘛，就是全局唯一一个实例，不可能同时出现两个嘛。是的。极大部分业务情况下是这样的。所以，怎么实现一个单例组件，是个值得思考的问题。
<!-- more -->
## 因地制宜，我们的前提是react组件的单例。

使用react组件常见的套路是写jsx，直接声明式地将组件放在它该在地位置，如：

```js
// ...
// ...
render() {

	return (
        <div className={wrapperClassNames}>
            <GoBack goBack = {props.goBack} />
            <h1 className = 'header-title'>{props.headerTitle}</h1>
            {
                rightOptions ? <div className = 'header-right'>{ rightOptions }</div> : null
            }
        </div>
	);
}
// ...
// ...
```
如果我们想根据某种状态来决定是否显示某个组件，可以三目。这样：

```js
// ...
// ...
render() {

	return (
        <div className={wrapperClassNames}>
            {
				this.state.showModal ? <Modal /> : null
			}
        </div>
	);
}
// ...
// ...
```
是这样的吧？相信大家也都是这么用的。没没啥大毛病。

### 没啥毛病，意思是有点小毛病咯？
正如小标题，确实没啥大毛病，却有一些小毛病，我说说我在业务中遇到的问题。

1. 动画直接丢失。好理解吧？我这个组件有进场、退场动画，在状态变化、变为不显示时，直接就被干掉了，退场动画写给谁看啊？
2. 有多少个Modal，就要写多少次（除非把Modal的数据写在上层组件的state里，一并传给Modal）

## 跟单例组件有啥关系？
正如前面所说，使用React，就注定了对组件的使用是声明式的。声明式的组件也意味着满足条件时会直接render到页面上（虽然可以用state来判断是否显示组件，但这种方式直接导致动画失效，这里排除了这种情况）。一般来说，使用单例组件可以采用调用的形式，这里引用一个同事的Alert组件：

```js
class Alert extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            onConfirm: props.onConfirm,
            content: props.content
        };
        this.timer = null;
        that = this;
    }

    componentWillUnmount() {
        if (container) {
            document.body.removeChild(container);
        }
    }

    render() {
        const { show, content, onConfirm } = this.state;
        const actions = [{
            text: '确定',
            callback: () => {
                onConfirm();
                this.setState({
                    show: false
                });
            }
        }];
        return (
            <Modal
                title ='提示'
                footer
                onHide = {() => false}
                actions = {actions}
                show = {show}
            >
                { content }
            </Modal>
        );
    }
}

Alert.propTypes = {
    show: PropTypes.bool,
    onConfirm: PropTypes.func,
    content: PropTypes.string
};

Alert.defaultProps = {
    show: false,
    onConfirm: () => true,
    content: ''
};

if (!isNodeEnv()) {
    container = document.createElement('div');
    document.body.appendChild(container);
    ReactDom.render(<Alert />, container);
}

export default {
    alert(config) {
        that.setState(Object.assign({}, config, { show: true }));
    }
};
```
如上，对外暴露的不再是一个组件，而是包含alert方法的对象。通过手动调用alert(config)的方式，实现了单例组件。这种方式也非常常见。但这种方式有一个弊端，是什么呢？思考下。

## 使用API调用的方式实现单例组件
是组件吧？那我们肯定要传一些参数对吧？（不要把Alert这个单例组件那来当话题背景，你可以想象一个模态框弹层组件，除了外面的掩层，里面的内容是不是得完全自己去写呀？）调用api的话，必须每次都把配置对象传入，可能是很大一个对象，如：

```js
globalLayer.show({
	title: '测试',
	onHide: function() {},
	onClick: function() {},
	content: (<Component1> <Son/>  </Component1>)
	// .....
});
```
这样的配置。而且每次调用这个方法都得传一个大对象过去。是不是有点麻烦？

## 使用声明式组件实现单例
什么是声明组件？就是：
```js
// ...
render() {
	<GlobalLayer show = {this.state.showLayer1}>
	</GlobalLayer>


	<GlobalLayer show = {this.state.showLayer2}>
	</GlobalLayer>
	
	<GlobalLayer show = {this.state.showLayer3}>
	</GlobalLayer>
}
// ...
```
类似这种的“直接render“。虽然看上去被直接render了，看上去应该有3个被塞入DOM了。但巧妙的就是GlobalLayer是一个高阶函数，它管理了自己的state中显示逻辑----用这个state来控制children是否显示。这里贴一下我的高阶函数的实现：

```js
import React, { PureComponent } from 'react';
import LazyRender from '../LazyRender'; // 这个是一个单独的用来懒渲染的高阶函数，可脱离本高阶函数独立使用
export default function (MyComponent) {

    class Wrapper extends PureComponent {

        static displayName = 'SelfDeleteWrapper';

        state = {
            showComponent: false // 用来控制是否显示内部组件
        };

        static getDerivedStateFromProps(props, state) {
            if (props.show && !state.showComponent) { // 准备展示组件
                return {
                    showComponent: true
                };
            }

            return null;
        }
        deleteComponent = () => { // 销毁组件
            console.log('1');
            this.setState({
                showComponent: false
            });
        }

        LazyComponent = LazyRender(MyComponent); // 缓存要渲染的东西

        render() {

            const {
                showComponent
            } = this.state;

            const {
                deleteComponent,
                LazyComponent
            } = this;

            return (
                showComponent ?
                    <LazyComponent {...this.props} __onDelete={deleteComponent} /> : null
            );
        }
    }

    return Wrapper;
}

```
关键点还是在于__onDelete函数。在MyComponent触发了onHide函数或者被上层组件设置为show: false时会触发__onDelete，使LazyComponent这个组件被react干掉。当然，触发__onDelete是在执行完MyComponent的退场动画后才触发的。这样保证了全局单一的实例。

---
title: 阅读redux源码
date: 2019-03-06 15:35:08
tags:
categories:
- js
- 设计思想
---
# 阅读redux源码收获
有一个NB的程序猿哥哥说过，作为发开人员，不是说会用很多东西工具、框架就很厉害，而是了解框架的设计思想，并且自己有能力设计一款NB的框架，这样的开发才是牛逼的。

开始正事。

redux分为几个部分，从简单到难（我以为的简单到难。>_<）说一下：

**compose.js**: 正如字面意思，组合。将多个函数组合起来，比如将后面函数的返回值作为参数传递给前面一个函数。我之前学习的时候写过compose这种函数，但思路不同，同样也比redux中的实现更复杂（但是必须承认的是，redux的更棒）。可以看一下我的compose.js和它的，
<!-- more -->
```js
var toArray = require('./util.js').toArray;

module.exports = function() {

    var funs = toArray(arguments);
    return function() {
        var result = args = toArray(arguments);
        result = funs[0](...result);
        for (var i = 1, len = funs.length; i < len; ++i) {
            result = funs[i](result)
        }
        return result;
    }
}

// redux => compose.js

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
这个函数主要用在组合中间件上。

**bindActionCreators**：这个方法用于将很多actions的函数放置于一个对象中，方便调用。值得注意的是代码中对类型做了很多校验，不符合的都throw new Error出去。

**combineReducers**：接收一个对象，将所有key组合起来，返回一个可以返回该数据层的reducer函数。这个数据层不简单。这不是一个简单的概念，而是涉及到redux的设计理念：合理的state结构。一个state树可以有很多枝吧？比如现在我的state树是这样的：

```js
// 这里并不是为了用combineReducers而用，而是为了示范而删了一些东西，导致看着有点别扭
export default combineReducers({
    data: function (state = {}, action){
        switch (action.type) {
        case FETCH_FIRST_DATA:
            return Object.assign({}, state, {...action.data});
        default:
            return state;
        }
    }
});
```
我想新建一个分支，用于表示单独的数据，比如我表单需要提交的数据：

```js
const commitReducer = {
    commit: combineReducers({
        selectedRoomNumber: roomNumberCommit,
        phoneNo,
        accommodationList,
        arriveTime
    })
};


export default combineReducers({
    data: function (state={}, action){
        switch (action.type) {
        case FETCH_FIRST_DATA:
            return Object.assign({}, state, {...action.data});
        default:
            return state;
        }
    },
    ...commitReducer
});
```
这样很清楚：在任意数据的任意分层都可以聚合所有该层的reducer为一个包含该层所有情况的reducer。在每次dispatch的时候，都会调用这个最根部的reducer，由这个最根部的reducer层层调用各reducer（具体实现不是表面上的递归，而是常规的js调用，可以这样理解，调用顶层reducer函数，返回一个对象表示state对象树），比如

```js
const getData = {
	type: 'GET_FIRST_DATA'
};
store.dispatch(getData); // 执行store

// 根reducer返回一个对象：
{
	data: (function data(state = {}, action))(previousState.data, getData),
	commit: (function commit(state, action){})(previousState.commit, getData)
}
// 这样data数据又会被函数计算。这样层层层叠下去，直到最底部...
```
是的，想想就知道代码并不难。是的，实际代码也不难，100多行代码，而且还是大面积类型检测代码的情况下。但是，这种思想是值得学习的。为开发人员设计这样的功能，确实很好。根据这样的思想来设计state tree也很方便。

 **createStore**：这个是倒数第二个源码文件。说明还不是最难的。功能如其名，创建store，使用闭包存储state和reducer。暴露出如下几个API：

```javascript
{
	dispatch, // 用于派发事件
  subscribe, // 用于订阅更新
  getState, // 获取state tree
  replaceReducer, // 替换reducer
  [$$observable]: observable // 观察者。这个还比较蒙，还没深入浅出
}
```
通过代码的设计，发现几处有意思的东西：redux给redux使用者进行了代码测试，会自动派发一些随机事件，看是否返回了原来的state，没有的话，就报错，提示用户。其次就是对外提供接口enhancer，这个也是applyMiddleware开始介入的地方。

**applyMiddleware**：这个是最绕的东西。毕竟是多层高阶函数，不仔细看看还是会晕的。整体来说这个函数就是：

```js
applyMiddleware = (...middleares) => createStore => (...args) => {
	const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    } // 为了让#1处middleware(middlewareAPI)运行的时候不准使用dispatch而特意加的
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args) // #2
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI)) // #1


	// 这里修改了#2中dispatch的指向为一个新的函数
    dispatch = compose(...chain)(store.dispatch) // #3
	return {
		...store,
		dispatch // 经过中间件处理的增强版的dispatch	
};
}




对任意一个中间来说，其流程是：
middlewares = ({ dispatch, getState }) => next => action => something-interesting
```
最开始我一直没搞懂dispatch，为啥明明是不准使用的，还能用？后来想通了，js中的函数是可以改变指向的，如#3就将#2的dispatch改为增强的新函数。其次是next函数，next函数可以在#3中看出是原始的store.dispatch函数，也就是光秃秃的dispatch函数，这个函数能执行同步的函数。我们来看看一个常见的thunk中间件是怎么撸的：

```js
export function thunk({ dispatch, getState }) {
  return next => action =>
    typeof action === 'function' ? action(dispatch, getState) : next(action)
}
```
判断action是不是函数，是函数的话，执行函数，并且把dispatch/getState传入执行，这个dispatch是增强的版本，表明在action中运行的结果可以用增强的dispatch再处理一哈。一般来说我们是请求api的时候用thunk，写一下：

```js
export const FETCH_FIRST_DATA = 'FETCH_FIRST_DATA';

export const getFirstData = id => async (dispatch, getState, axios) => {
  const ret = await axios.get(`http://jsonplaceholder.typicode.com/users/`);
  return dispatch({
    type: FETCH_FIRST_DATA,
    data: ret.data
  });
};
```
先执行这个异步函数，执行好了再用增强的dispatch来执行一哈正常的action对象。

鄙人的理解是：next这个参数一点都不语义化，我jio得叫一个finalDispatch会更亲切。因为不管再怎么增强这个dispatch，其结果也只是为了最终的action对象提供数据而已，叫next，总让我想起中间件，以为是该调用下一个中间件了。但看了代码，我jio得并不是调用下一个中间件的问题。我说的对吗？

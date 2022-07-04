---
title: threejs 知识点
date: 2022-06-29 14:32:29
tags:
categories:
- threejs
---

threejs 知识点


<!-- more -->
# 场景
# 相机
# 渲染器

# 更新
## 怎么更新
所有加入到场景的对象都会默认自动更新。
```js
const object = new THREE.Object3D();
scene.add( object );
```
如果是另一个被加入到场景的对象的子对象，也会自动更新：
```js
const object1 = new THREE.Object3D();
const object2 = new THREE.Object3D();

object1.add( object2 );
scene.add( object1 ); //object1 and object2 will automatically update their matrices
```
如果设置了 `matrixAutoUpdate` 为 `false`，那么需要手动更新：
```js
object.matrixAutoUpdate = false;
object.updateMatrix();
```

## BufferGeometry 更新
该类可以存储很多信息，比如：定点位置，面索引，法线，颜色等。但底层存储是 `typed array`，因此不能增删，可以修改。这样性能更好，但也造成编程上的困难。

因为不能增加其大小，所以一开始就应该预测其最大长度。当修改了数据后，应该设置 `needsUpdate` 为 `true`。

## Material
所有表面值都可以自由更改（例如颜色、纹理、不透明度等），每帧将值发送到着色器。

其他值在运行时不能简单的被修改，比如：数字，表面类型，除了纹理/雾气/顶点颜色/渐变/阴影图/alpha测试/透明 这些之外的。如果这些值改变了，需要：
```js
material.needsUpdate = true
```
一定要记得这样的操作可能造成卡顿。如果有这种需求，可以考虑将材料细化为多个小块。

## Texture
同样的，当纹理更新后，需要设置：
```js
texture.needsUpdate = true;
```

## 相机
相机的位置和目标会自动更新。如果改了：
- for
- aspect
- near
- far

那么需要重新计算投影矩阵：
```js
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
```

# 销毁
在 threejs 中，任何东西都需要手动销毁。

Geometry 可以调用 `dispose()` 方法。

Material 可以调用 `dispose()` 方法。

Texture 可以调用 `dispose()` 方法。

RenderTarget 可以调用 `dispose()` 方法。

Object dispose 后并不会销毁 Geometry 和 Material，仍然需要手动销毁。

# 后处理
# 矩阵变换
每一个3D Object都有一个 `matrix` 属性，记录了它的位置，旋转和缩放。

如果要改变一个对象的变换信息，有两种方法：
## 1. 直接修改对象的 `position`, `quaternion`, 和 `scale` 属性，threejs 会自己重新计算。
```js
object.position.copy( start_position );
object.quaternion.copy( quaternion );
```
默认情况下，对象的 `matrixAutoUpdate` 属性是 `true`，意味着矩阵信息会自动重新计算。如果对象是静态的，或者是想自己去控制何时应该重新计算，那么可以设置为 `false`：
```js
object.matrixAutoUpdate = false;
```
然后在任何属性改变后，手动调用更新：
```js
object.updateMatrix();
```

## 2. 直接修改对象的 `matrix` 。
`matrix` 所属的 `Matrix4` 类上有很多方法可以来改变 matrix：
```js
object.matrix.setRotationFromQuaternion( quaternion );
object.matrix.setPosition( start_position );
object.matrixAutoUpdate = false;
```
注意到，这里的 `matrixAutoUpdate` 必须设置为 false，并且一定不能调用 `updateMatrix` 方法，否则会破坏对 matrix 的已有的直接操作。

## 对象矩阵和世界矩阵
对象的 `matrix` 属性存储了 ** 相对于 ** 父节点的变换信息。要获取世界范围内的坐标信息，需要获取对象的 `matrixWorld` 。

当该对象或者是父对象的变换信息改变后，可以通过请求该对象的 `updateMatrixWorld` 方法来更新 `matrixWorld`。

## Rotation 和 Quaternion 旋转和四元数
threejs 提供了两种表示3D旋转的方式：欧拉角和四元数，以及两者进行转化的方法。欧拉角由于有万向节锁定的问题，所以底层都会用四元数来存储。








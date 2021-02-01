---
title: Andr学习第3天
date: 2020-03-12 09:55:44
tags:
categories:
- Andr
---


学习范围：Application
## 目的
了解安卓中 Application 的概念，提供的能力。

## 介绍
代表应用程序（即 Android App）的类，也属于Android中的一个系统组件。[官网](https://developer.android.com/reference/android/app/Application)中说到：

> 维护全局应用状态的基类。可以提供你自己的实现，通过创建一个该类的子类，并且指定其类名为 AndroidManifest.xml's <application> 标签中 "android:name" 的值即可。Application 类或者你的子类，会在你的程序启动时第一时间初始化。

<!-- more -->

完整代码如下：
```java
public class AndroidApplication extends Application {

    private static AndroidApplication instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
    }

    public static AndroidApplication getInstance(){
        return instance;
    }
}
```

```xml
<application
    android:name=".AndroidApplication"
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">
    <activity android:name=".MainActivity">
        <intent-filter>
            <action android:name="android.intent.action.MAIN"/>

            <category android:name="android.intent.category.LAUNCHER"/>
        </intent-filter>
    </activity>
</application>
```

## 特点

### 实例创建方式：单例模式
每个Android App运行时，会首先自动创建Application 类并实例化 Application 对象，且只有一个。也可通过 继承 Application 类自定义Application 类和实例。

### 实例形式：全局实例
即不同的组件（如Activity、Service）都可获得Application对象且都是同一个对象。

### 生命周期：等于 Android App 的生命周期
Application 对象的生命周期是整个程序中最长的，即等于Android App的生命周期。

## 生命周期

### onCreate
调用时刻： Application 实例创建时调用。Android系统的入口是Application类的 onCreate（），默认为空实现。
作用：
1. 初始化应用程序级别的资源，如全局对象、环境配置变量、图片资源初始化、推送服务的注册等。__注：请不要执行耗时操作，否则会拖慢应用程序启动速度__
2. 数据共享、数据缓存。设置全局共享数据，如全局共享变量、方法等。注：这些共享数据只在应用程序的生命周期内有效，当该应用程序被杀死，这些数据也会被清空，所以只能存储一些具备 __临时性的共享数据__。

### registerComponentCallbacks & unregisterComponentCallbacks
作用：注册和注销 ComponentCallbacks2 回调接口。本质上是复写 ComponentCallbacks2回调接口里的方法从而实现更多的操作，具体下面会详细介绍。
```java
registerComponentCallbacks(new ComponentCallbacks2() {
// 接口里方法下面会继续介绍
    @Override
    public void onTrimMemory(int level) {

    }

    @Override
    public void onLowMemory() {

    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {

    }
});
```

### onTrimMemory
作用：通知 应用程序 当前内存使用情况（以内存级别进行识别）。应用场景：根据当前内存使用情况进行自身的内存资源的不同程度释放，以避免被系统直接杀掉 & 优化应用程序的性能体验。

### onLowMemory
作用：监听 Android系统整体内存较低时刻。调用时刻：Android系统整体内存较低时。

### onConfigurationChanged
作用：监听应用程序配置信息的改变，如屏幕旋转等。调用时刻：应用程序配置信息 改变时调用。
该配置信息是指 ：Manifest.xml文件下的 Activity标签属性android:configChanges的值，如下：
```xml
<activity android:name=".MainActivity">
    android:configChanges="keyboardHidden|orientation|screenSize"
    // 设置该配置属性会使 Activity在配置改变时不重启，只执行onConfigurationChanged（）
    // 上述语句表明，设置该配置属性可使 Activity 在屏幕旋转时不重启
 </activity>
```

### registerActivityLifecycleCallbacks & unregisterActivityLifecycleCallbacks
作用：注册 / 注销对应用程序内所有Activity的生命周期监听。调用时刻：当应用程序内 Activity 生命周期发生变化时就会调用。实际上是调用registerActivityLifecycleCallbacks（）里 ActivityLifecycleCallbacks接口里的方法。

### onTerminate
调用时刻：应用程序结束时调用。但该方法只用于Android仿真机测试，在Android产品机是不会调用的。

## 应用场景
从Applicaiton类的方法可以看出，Applicaiton类的应用场景有：（已按优先级排序）

- 初始化 应用程序级别 的资源，如全局对象、环境配置变量等
- 数据共享、数据缓存，如设置全局共享变量、方法等
- 获取应用程序当前的内存使用情况，及时释放资源，从而避免被系统杀死
- 监听 应用程序 配置信息的改变，如屏幕旋转等
- 监听应用程序内 所有Activity的生命周期

## 不要误用 Application

### 用于缓存状态
因为Application会因为进入background后内存不足被系统干掉，进入后系统会重现创建一个Application类，而导致缓存在Application类里的数据全部初始化而丢失。

### 错误的获取全局Context对象的方式
```java
public class AnddroidApplication extends Application {

    private static AnddroidApplication app;

    public static AnddroidApplication getInstance() {
        if (app == null) {
            app = new AnddroidApplication();
        }
        return app;
    }
}
```
组件必须被系统创建才有作用，而不仅仅是一个类。它是有上下文环境的。正确的获取方式是在 onCreate 中保存引用。

### 在控件的构造方法中获取Context或者做其他视图操作
写过Android的同学应该知道自己或者看别人dome都很少或者基本看不到在控件构造函数内进行初始化，获取参数等这些操作吧！是的，这样做是很容易出难以发现的Bug的。具体原因是在ContextWrapper类的源码中，他有一个attachBaseContext()方法，这个方法会将传入的一个Context参数赋值给mBase对象，之后mBase对象就有值了。而我们又知道，所有Context的方法都是调用这个mBase对象的同名方法，那么也就是说如果在mBase对象还没赋值的情况下就去调用Context中的任何一个方法时，就会出现空指针异常。

## 参考
[在Android开发中怎样使用Application类](https://www.jianshu.com/p/3138f9c351e8)
[Android：全面解析 Application类](https://juejin.im/entry/59c30e0ff265da06611f7024)

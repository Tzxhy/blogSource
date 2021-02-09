---
title: Andr学习第5天
date: 2020-03-16 22:27:04
tags:
published: false
categories: Android
---


今天学习一下 UI 开发的基础。内容为：第五章：UI 开发。（第四章介绍 Fragment，先忽略）

## 目的
了解安卓中的广播，以及用途。

## Broadcast Receiver
Android 中的广播机制更加灵活呢?这是因为 Android 中的每个应用程序都可以对 自己感兴趣的广播进行注册，这样该程序就只会接收到自己所关心的广播内容，这些广播可能是 来自于系统的，也可能是来自于其他应用程序的。Android 提供了一套完整的 API，允许应用程 序自由地发送和接收广播。

广播主要可以分为两种类型:标准广播和有序广播。
- 标准广播(Normal broadcasts)是一种完全异步执行的广播，在广播发出之后，所有的广 播接收器几乎都会在同一时刻接收到这条广播消息，因此它们之间没有任何先后顺序可 言。这种广播的效率会比较高，但同时也意味着它是无法被截断的。
- 有序广播(Ordered broadcasts)则是一种同步执行的广播，在广播发出之后，同一时刻只 会有一个广播接收器能够收到这条广播消息，当这个广播接收器中的逻辑执行完毕后， 广播才会继续传递。所以此时的广播接收器是有先后顺序的，优先级高的广播接收器就 可以先收到广播消息，并且前面的广播接收器还可以截断正在传递的广播，这样后面的 广播接收器就无法收到广播消息了。
<!-- more -->


### 接收广播

#### 动态注册监听网络变化
注册广播的方式一般有两种，在代码中注册 和在 AndroidManifest.xml 中注册，其中前者也被称为动态注册，后者也被称为静态注册。

那么该如何创建一个广播接收器呢?其实只需要新建一个类，让它继承自 Broadcast- Receiver，并重写父类的 onReceive()方法就行了。这样当有广播到来时，onReceive()方法就会得到执行，具体的逻辑就可以在这个方法中处理。

```java
public class MainActivity extends AppCompatActivity {
    private IntentFilter intentFilter;
    private NetworkChangeReceiver networkChangeReceiver;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState); setContentView(R.layout.activity_main);
        intentFilter = new IntentFilter(); intentFilter.addAction("android.net.conn.CONNECTIVITY_CHANGE");
        networkChangeReceiver = new NetworkChangeReceiver(); registerReceiver(networkChangeReceiver, intentFilter);
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(networkChangeReceiver);
    }
    class NetworkChangeReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Toast.makeText(context, "network changes", Toast.LENGTH_SHORT).show();
        }
    }
}
```

最后要记得，动态注册的广播接收器一定都要取消注册才行，这里我们是在 onDestroy() 方法中通过调用 unregisterReceiver()方法来实现的。
另外，这里有非常重要的一点需要说明，Android 系统为了保护用户设备的安全和隐私，做 了严格的规定:如果程序需要进行一些对用户来说比较敏感的操作，就必须在配置文件中声明权 限才可以，否则程序将会直接崩溃。比如这里访问系统的网络状态就是需要声明权限的。打开 AndroidManifest.xml 文件，在里面加入如下权限就可以访问系统网络状态了：
```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

#### 静态注册实现开机启动
动态注册的广播接收器可以自由地控制注册与注销，在灵活性方面有很大的优势，但是它也存在着一个缺点，即**必须要在程序启动之后才能接收到广播**，因为注册的逻辑是写在 onCreate() 方法中的。那么有没有什么办法可以让程序在未启动的情况下就能接收到广播呢?这就需要使用 静态注册的方式了。

首先需要创建一个 Broadcast Receiver, `Exported`/`Enabled`都勾选上，代码如下：
```java
public class BootCompleteReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context, "Boot Complete", Toast.LENGTH_LONG).show();
    }
}
```
另外，静态的广播接收器一定要在 AndroidManifest.xml 文件中注册才可以使用，不过由于我 们是使用 Android Studio 的快捷方式创建的广播接收器，因此注册这一步已经被自动完成了。打 开 AndroidManifest.xml 文件瞧一瞧，代码如下所示:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.broadcasttest">
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
            ...
            <receiver
                android:name=".BootCompleteReceiver"
                android:enabled="true"
                android:exported="true">
            </receiver>
    </application>
</manifest>
```
不过目前 BootCompleteReceiver 还是不能接收到开机广播的，我们还需要对 AndroidManifest. xml 文件进行修改才行，如下所示:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.broadcasttest">
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
        <receiver
            android:name=".BootCompleteReceiver" android:enabled="true" android:exported="true"> 
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
```
需要注意的是，不要在 onReceive()方法中添加过多的逻辑或者进行任何的耗时操作，因为在广播接收器中是 不允许开启线程的，当 onReceive()方法运行了较长时间而没有结束时，程序就会报错。因此 广播接收器更多的是扮演一种打开程序其他组件的角色，比如创建一条状态栏通知，或者启动一个服务等。

___

### 发送自定义广播

#### 发送标准广播
在发送广播之前，我们还是需要先定义一个广播接收器来准备接收此广播才行，不然发出去也是白发。因此新建一个 MyBroadcastReceiver，代码如下所示:
```java
public class MyBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context, "received in MyBroadcastReceiver", Toast.LENGTH_ SHORT).show();
    }
}
```
这里当 MyBroadcastReceiver 收到自定义的广播时，就会弹出“received in MyBroadcast-Receiver”的提示。然后在 AndroidManifest.xml 中对这个广播接收器进行修改:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.broadcasttest">
    ...
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
        <receiver android:name=".MyBroadcastReceiver" android:enabled="true" android:exported="true"> 
            <intent-filter>
                    <action android:name="com.example.broadcasttest.MY_BROADCAST"/>
            </intent-filter>
        </receiver>
    </application>
</manifest>
```
可以看到，这里让 MyBroadcastReceiver 接收一条值为 com.example.broadcasttest.MY_BROADCAST 的广播，因此待会儿在发送广播的时候，我们就需要发出这样的一条广播。

随便设置一个按钮，点击后发送广播，如：
```java
button.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Intent intent = new
        Intent("com.example.broadcasttest.MY_BROADCAST");
        sendBroadcast(intent);
    }
});
```

#### 发送有序广播
将 `sendBroadcast` 替换为 `sendOrderedBroadcast`。那么该如何设定广播接收器的先后顺序呢?当然是在注册的时候进行设定的了，修改AndroidManifest.xml 中的代码，如下所示:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.broadcasttest">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
        <receiver
            android:name=".MyBroadcastReceiver" android:enabled="true" android:exported="true">
            <intent-filter android:priority="100">
                <action android:name="com.example.broadcasttest.MY_BROADCAST" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
```

如果需要中断广播，在 `BroadcastReceiver` 中调用 `abortBroadcast();`即可。当优先级相同时，执行顺序参考[文章](https://blog.csdn.net/ritterliu/article/details/17025183)。


___
### 使用本地广播
前面我们发送和接收的广播全部属于系统全局广播，即发出的广播可以被其他任何应用程序 接收到，并且我们也可以接收来自于其他任何应用程序的广播。这样就很容易引起安全性的问题， 比如说我们发送的一些携带关键性数据的广播有可能被其他的应用程序截获，或者其他的程序不 停地向我们的广播接收器里发送各种垃圾广播。

为了能够简单地解决广播的安全性问题，Android 引入了一套本地广播机制，使用这个机制 发出的广播只能够在应用程序的内部进行传递，并且广播接收器也只能接收来自本应用程序发出 的广播，这样所有的安全性问题就都不存在了。

本地广播的用法并不复杂，主要就是使用了一个 LocalBroadcastManager 来对广播进行管理， 并提供了发送广播和注册广播接收器的方法。下面我们就通过具体的实例来尝试一下它的用法， 修改 MainActivity 中的代码，如下所示:
```java
public class MainActivity extends AppCompatActivity { private IntentFilter intentFilter;
    private LocalReceiver localReceiver;
    private LocalBroadcastManager localBroadcastManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        localBroadcastManager = LocalBroadcastManager.getInstance(this); // 获取实例
        Button button = (Button) findViewById(R.id.button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent("com.example.broadcasttest.LOCAL_BROADCAST");
                localBroadcastManager.sendBroadcast(intent); // 发送本地广播
            }
        });
        intentFilter = new IntentFilter();
        intentFilter.addAction("com.example.broadcasttest.LOCAL_BROADCAST");
        localReceiver = new LocalReceiver();
        localBroadcastManager.registerReceiver(localReceiver, intentFilter); // 注册本地广播监听器
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        localBroadcastManager.unregisterReceiver(localReceiver);
    }

    class LocalReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            Toast.makeText(context, "received local broadcast", Toast.LENGTH_SHORT). show();
        }
    }

```
其实这基本上就和我们前面所学的动态注册广播接收器 以及发送广播的代码是一样的。只不过现在首先是通过 LocalBroadcastManager 的 getInstance()方 法得到了它的一个实例，然后在注册广播接收器的时候调用的是 LocalBroadcastManager 的 registerReceiver()方法，在发送广播的时候调用的是 LocalBroadcastManager 的 sendBroadcast() 方法，仅此而已。

___
### 广播的最佳实践——实现强制下线功能
强制下线功能应该算是比较常见的了，很多的应用程序都具备这个功能，比如你的 QQ 号在别处登录了，就会将你强制挤下线。其实实现强制下线功能的思路也比较简单，只需要在界面上弹出一个对话框，让用户无法进行任何其他操作，必须要点击对话框中的确定按钮，然后回到登录界面即可。可是这样就存在着一个问题，因为当我们被通知需要强制下线时可能正处于任何一个界面，难道需要在每个界面上都编写一个弹出对话框的逻辑？如果你真的这么想，那思维就偏远了，我们完全可以借助本章中所学的广播知识，来非常轻松地实现这一功能。

基本思路：每一个 Activity 继承一个自定义的父类 Activity，这个父类重写 onResume 方法，用于注册广播；在 onPause 中，取消注册。事件处理逻辑：关闭所有 Activity，并开启一个新的 Activity（一般是登录页）。代码就不写了。



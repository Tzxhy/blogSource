---
title: Andr学习第2天
date: 2020-03-10 21:02:36
tags:
categories:
- Andr
---

学习范围：第二章-探究 Activity
## 目的
了解活动的生命周期，与活动相关的交互，了解活动提供的能力。
## 活动是什么
活动(Activity)是最容易吸引用户的地方，它是一种可以包含用户界面的组件，主要用于 和用户进行交互。

## 活动的基操
在 Android Studio 中，新建一个 Activity 时，可以勾选是否创建对应的布局文件。同时 AS 会自动把 Activity 注册到 Manifest 中。

一般在 onCreate 回调中加载布局：setContentView(R.layout.LAYOUT_ID)。

<!-- more -->

对于主活动，需要注册：
```xml
<application>
    <activity android:name=".FirstActivity"
        android:label="This is FirstActivity">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" /> </intent-filter>
    </activity>
</application>
```
\<action android:name="android.intent.action.MAIN" /\>\<category android:name="android.intent.category.LAUNCHER" \/\> \</intent-filter\> 这两者是配套出现的，用于表明一个活动是主活动（点击应用图标后进入的第一个活动）。

简单地绑定按钮点击事件：
```java
public class SecondActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        Intent intent = getIntent();
        String data = intent.getStringExtra("extra_data");
        Log.d("SecondActivity", data);
        Button button = findViewById(R.id.button_2);
        button.setOnClickListener(
            v -> {
                // 进入FirstActivity活动
                startActivity(new Intent(this, FirstActivity.class));
            }
        );
    }
}
```
AppCompatActivity这是一个向下兼容的 Activity。默认的 Activity 都会继承这个类。

### 使用 menu 文件
menu 是安卓活动右上角的三个点：点击后出现下拉菜单。其布局类似 web 中的 fixed 布局。

在res目录中新建一个 menu 的目录，然后在 menu 目录上右击选择新建 menu 文件。如下：
```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:id="@+id/add_item"
        android:title="Add" />
    <item
        android:id="@+id/remove_item"
        android:title="Remove" />
</menu>
```
在活动中重写回调：
```java
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.add_item:
                Toast.makeText(this, "You clicked Add", Toast.LENGTH_SHORT).show();
                break;
            case R.id.remove_item:
                Toast.makeText(this, "You clicked Add", Toast.LENGTH_SHORT).show();
                break;
            default:
                break;
        }
        return true;
    }
```

### 销毁一个活动
调用**finish**方法即可。

___

## Intent
Intent 是 Android 程序中各组件之间进行交互的一种重要方式，它不仅可以指明当前组件想 要执行的动作，还可以在不同组件之间传递数据。Intent 一般可被用于启动活动、启动服务以及 发送广播等场景。

### 显式
什么是显式 Intent？显式的就是指明了需要跳转的活动，比如：
```java
void handleButton() {
    Button button = findViewById(R.id.button_1);
    button.setOnClickListener(
        v -> {
            String data = "Hello SecondActivity";
            Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
            intent.putExtra("extra_data", data);
            startActivity(intent);
        }
    );
}
```
显式指定需要跳转的类，这就是显式。同时还向下一个活动传递了数据。我们看看怎么接受数据：
```java
public class SecondActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        Intent intent = getIntent();
        String data = intent.getStringExtra("extra_data");
        Log.d("SecondActivity", data);
        Button button = findViewById(R.id.button_2);
        button.setOnClickListener(
            v -> {
                startActivity(new Intent(this, FirstActivity.class));
            }
        );
    }
}

```

### 隐式
隐式是非显式，不用指定目的地。比如：你要拍照，但你的程序没有提供拍照功能，你可以把这个消息发送给安卓系统，让它给你安排一个活动来支持；你要打电话，你的程序没实现这个功能，你需要让安卓系统来帮你决定用哪个程序来打电话，当然，你要向安卓系统表达清楚你的需求。
下面是一个例子：
```java
button1.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent("com.example.activitytest.ACTION_START");
            startActivity(intent);
        }
});
```
用一个字符串"com.example.activitytest.ACTION_START"来表达你的意图。如果你自己的程序有可以处理这个操作的活动，需要在 manifest 中注册意图过滤器，如：
```xml
<activity android:name=".SecondActivity" >
    <intent-filter>
        <action android:name="com.example.activitytest.ACTION_START" />
        <category android:name="android.intent.category.DEFAULT" /> 
        <category android:name="com.example.activitytest.MY_CATEGORY"/>
    </intent-filter>
</activity>
```
一个意图过滤器由3部分组成：action，category，data，只要同时满足这三者，那么这个意图就会婚配给这个活动来处理。一个过滤器中可以出现很多 action，很多 category，很多 data，当满足 actions || category || data 时，就满足匹配。

### 获取上一个活动返回的数据

在第一个活动中，调用`startActivityForResult`方法以获取下一个页面返回的数据。第二个参数表示自定义的页面 id：
```java
button1.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Intent intent = new Intent(FirstActivity.this, SecondActivity.class);
        startActivityForResult(intent, 1);
    }
});
```

```java
public class SecondActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState); 11 setContentView(R.layout.second_layout);
        Button button2 = (Button) findViewById(R.id.button_2);
        button2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.putExtra("data_return", "Hello FirstActivity");
                setResult(RESULT_OK, intent);
                finish();
            }
        });
    }
}
```
调用`setResult`来设置返回数据。

在上一个活动中，重写 `onActivityResult` 方法：
```java
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case 1:
                if (resultCode == RESULT_OK) {
                    String returnedData = data.getStringExtra("data_return");
                    Log.d("FirstActivity", returnedData);
                }
                break;
            default:
        }
    }
```




## 活动生命周期
Activity 类中定义了 7 个回调方法，覆盖了活动生命周期的每一个环节，下面就来一一介绍
这 7 个方法。
- onCreate()。这个方法你已经看到过很多次了，每个活动中我们都重写了这个方法，它会在活动第一次被创建的时候调用。你应该在这个方法中完成活动的初始化操作，比如 说加载布局、绑定事件等。
- onStart()。这个方法在活动由不可见变为可见的时候调用。
- onResume()。这个方法在活动准备好和用户进行交互的时候调用。此时的活动一定位于返回栈的栈顶，并且处于运行状态。
- onPause()。这个方法在系统准备去启动或者恢复另一个活动的时候调用。我们通常会在这个方法中将一些消耗 CPU 的资源释放掉，以及保存一些关键数据，但这个方法的执行速度一定要快，不然会影响到新的栈顶活动的使用。
- onStop()。这个方法在活动完全不可见的时候调用。它和 onPause()方法的主要区别在于，如果启动的新活动是一个对话框式的活动，那么 onPause()方法会得到执行，而 onStop()方法并不会执行。
- onDestroy()。这个方法在活动被销毁之前调用，之后活动的状态将变为销毁状态。
- onRestart()。这个方法在活动由停止状态变为运行状态之前调用，也就是活动被重新启动了。

![生命周期](http://www.tanzhixuan.top/ng-s1/static/upload/img/6be26730/247ef92962438.png)

### 活动被回收了
前面我们已经说过，当一个活动进入到了停止状态，是有可能被系统回收的。那么想象以下 场景:应用中有一个活动 A，用户在活动 A 的基础上启动了活动 B，活动 A 就进入了停止状态， 这个时候由于系统内存不足，将活动 A 回收掉了，然后用户按下 Back 键返回活动 A，会出现什 么情况呢?其实还是会正常显示活动 A 的，只不过这时并不会执行 onRestart()方法，而是会 执行活动 A 的 onCreate()方法，因为活动 A 在这种情况下会被重新创建一次。
这样看上去好像一切正常，可是别忽略了一个重要问题，活动 A 中是可能存在临时数据和 状态的。打个比方，MainActivity 中有一个文本输入框，现在你输入了一段文字，然后启动 NormalActivity，这时 MainActivity 由于系统内存不足被回收掉，过了一会你又点击了 Back 键回 到 MainActivity，你会发现刚刚输入的文字全部都没了，因为 MainActivity 被重新创建了。

解决方法，在活动的 `onSaveInstanceState` 回调中，将数据保存到 Bundle 中：
```java
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        String tempData = "Something you just typed";
        outState.putString("data_key", tempData);
    }
```

当活动重新创建时，使用 Bundle 恢复状态：
```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "onCreate");
        setContentView(R.layout.activity_main);
        if (savedInstanceState != null) {
            String tempData = savedInstanceState.getString("data_key");
        }
    }
```


## 活动的启动方式
模式修改方式，manifest 中：
```xml
<activity
    android:name=".FirstActivity"
    android:launchMode="singleTask"
    android:label="这是FirstActivity">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```
android:launchMode="singleTask"这个是关键。

### standard
默认的模式。每一次进入一个活动，便创建一个新的活动实例。

### singleTop
如果当前活动页A是栈顶，然后再入栈一个页面 A，这时不会创建新的页面 A。

### singleTask
如果当前是活动 A，打开活动 B，又打开 C，又打开 A。这时会导致B、C 都出栈，只留下 A。

### singleInstance
被定义为 singleInstance 模式的页面，会拥有新的页面栈。这个模式比较复杂，可以自己查询相关内容。

## 参考
[intent 和 intent-filter](https://developer.android.com/guide/components/intents-filters)
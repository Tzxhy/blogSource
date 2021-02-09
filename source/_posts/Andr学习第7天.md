---
title: Andr学习第7天
date: 2020-03-18 23:06:01
tags:
categories: Android
published: false
---


## 跨程序共享数据——探究内容提供器
可能你会有些疑惑，为什么要将我们程序中的数据共享给其他程序呢?当然，这个是要视 情况而定的，比如说账号和密码这样的隐私数据显然是不能共享给其他程序的，不过一些可以 让其他程序进行二次开发的基础性数据，我们还是可以选择将其共享的。例如系统的电话簿程 序，它的数据库中保存了很多的联系人信息，如果这些数据都不允许第三方的程序进行访问的 话，恐怕很多应用的功能都要大打折扣了。除了电话簿之外，还有短信、媒体库等程序都实现 了跨程序数据共享的功能。

内容提供器(Content Provider)主要用于在不同的应用程序之间实现数据共享的功能，它提 供了一套完整的机制，允许一个程序访问另一个程序中的数据，同时还能保证被访数据的安全性。 目前，使用内容提供器是 Android 实现跨程序共享数据的标准方式。

<!-- more -->

## 运行时权限
访问系统的网络状态以及监听开机广播涉及了用户设备的安全性，因此必须在 AndroidManifest.xml 中加入权限声明，否则我们的程序就会崩溃。那么现在问题来了，加入了这两句权限声明后，对于用户来说到底有什么影响呢?为什么这 样就可以保护用户设备的安全性了呢?

其实用户主要在以下两个方面得到了保护，一方面，如果用户在低于 6.0 系统的设备上安装 该程序，会在安装界面给出提醒。这样用户就可以清楚地知晓该程序一共申请了 哪些权限，从而决定是否要安装这个程序。另一方面，用户可以随时在应用程序管理界面查看任意一个程序的权限申请情况。

其中有一些权限我并不 认可，比如微信为什么要读取我手机的短信和彩信?但是我不认可又能怎样，难道我拒绝安装微 信?没错，这种例子比比皆是。


Android 开发团队当然也意识到了这个问题，于是在 6.0 系统中加入了运行时权限功能。也 就是说，用户不需要在安装软件的时候一次性授权所有申请的权限，而是可以在软件的使用过程 中再对某一项权限申请进行授权。比如说一款相机应用在运行时申请了地理位置定位权限，就算 9 我拒绝了这个权限，但是我应该仍然可以使用这个应用的其他功能，而不是像之前那样直接无法 安装它。

每当要使 用一个权限时，可以在危险权限表中来查一下，如果是属于这张表中的权限，那么就需要进行运行时权限处理；如果不在这张表中，那么只需要在 AndroidManifest.xml 文件中添加一下权限声明就可以了。[权限列表](https://developer.android.google.cn/reference/android/Manifest.permission.html).


在低于6.0版本上，添加权限：\<uses-permission android:name="android.permission.CALL_PHONE" \/\>：
```java
makeCall.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        try {
            Intent intent = new Intent(Intent.ACTION_CALL);
            intent.setData(Uri.parse("tel:10086"));
            startActivity(intent);
        } catch (SecurityException e) {
            e.printStackTrace();
        }
    }
});
```
这段代码可以正常 run（打出电话）。在6.0及以后，会报错。需要申请运行时权限。

```java
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    Button makeCall = (Button) findViewById(R.id.make_call);
    makeCall.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (
                ContextCompat.checkSelfPermission(MainActivity.this, Manifest. permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    MainActivity.this,
                    new String[]{ Manifest.permission.CALL_PHONE },
                    1
                );
            } else {
                call();
            }
        }
    });
}

private void call() {
    try {
        Intent intent = new Intent(Intent.ACTION_CALL);
        intent.setData(Uri.parse("tel:10086"));
        startActivity(intent);
    } catch (SecurityException e) {
        e.printStackTrace();
    }
}

@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    switch (requestCode) {
        case 1:
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED ) {
                call();
            } else {
                Toast.makeText(this, "You denied the permission", Toast.LENGTH_ SHORT).show();
            }
            break;
            default:
    }
}
```





---
title: Andr学习第1天
date: 2020-03-10 08:55:11
tags:
published: false
categories:
- Android
---

学习范围：第一章-开始启程
## 目的
了解安卓项目的基础结构，了解各项配置文件。

## 安卓四大组件
- Activity。活动，页面的展示载体。
- Service。可以后台运行。
- Broadcast Receiver。接收其他程序发出的广播，也能发出广播给其他程序。
- ContentProvider。应用间共享数据。

<!-- more -->

## 项目结构
- .gradle 和.idea。Android Studio 自动生成的一些文件，不要去修改。
- app。默认的项目源码目录。
- build。生成的中间码，不需处理。
- gradle。这个目录下包含了 gradle wrapper 的配置文件，使用 gradle wrapper 的方式不需要提前将 gradle 下载好，而是会自动根据本地的缓存情况决定是否需要联网下载 gradle。
- build.gradle。这是项目全局的 gradle 构建脚本，通常这个文件中的内容是不需要修改的。
- gradle.properties。这个文件是全局的 gradle 配置文件，在这里配置的属性将会影响到项目中所有的 gradle 编译 脚本。
- gradlew 和 gradlew.bat。这两个文件是用来在命令行界面中执行 gradle 命令的，其中 gradlew 是在 Linux 或 Mac 系统
中使用的，gradlew.bat 是在 Windows 系统中使用的。
- HelloWorld.iml。iml 文件是所有 IntelliJ IDEA 项目都会自动生成的一个文件(Android Studio 是基于 IntelliJ IDEA 开发的)，用于标识这是一个 IntelliJ IDEA 项目，我们不需要修改这个文件中的任何内容。
- local.propert。这个文件用于指定本机中的 Android SDK 路径，通常内容都是自动生成的，我们并不需要修改。 除非你本机中的 Android SDK 位置发生了变化，那么就将这个文件中的路径改成新的位置即可。
- settings.gradle。这个文件用于指定项目中所有引入的模块。由于 HelloWorld 项目中就只有一个 app 模块，因 此该文件中也就只引入了 app 这一个模块。通常情况下模块的引入都是自动完成的，需要我们手 动去修改这个文件的场景可能比较少。

### app 目录下结构
- build。这个目录和外层的 build 目录类似，主要也是包含了一些在编译时自动生成的文件，不过它 里面的内容会更加更杂，我们不需要过多关心。
- libs。如果你的项目中使用到了第三方 jar 包，就需要把这些 jar 包都放在 libs 目录下，放在这个目 录下的 jar 包都会被自动添加到构建路径里去。
- androidTest。此处是用来编写 Android Test 测试用例的，可以对项目进行一些自动化测试。
- java。毫无疑问，java 目录是放置我们所有 Java 代码的地方，展开该目录，你将看到我们刚才创建 的 HelloWorldActivity 文件就在里面。
- res。这个目录下的内容就有点多了。简单点说，就是你在项目中使用到的所有图片、布局、字符 串等资源都要存放在这个目录下。当然这个目录下还有很多子目录，图片放在 drawable 目录下，布 局放在 layout 目录下，字符串放在 values 目录下，所以你不用担心会把整个 res 目录弄得乱糟糟的。
- AndroidManifest.xml。这是你整个 Android 项目的配置文件，你在程序中定义的所有四大组件都需要在这个文件里 注册，另外还可以在这个文件中给应用程序添加权限声明。由于这个文件以后会经常用到，我们 用到的时候再做详细说明。
- test。此处是用来编写 Unit Test 测试用例的，是对项目进行自动化测试的另一种方式。
- app.iml。IntelliJ IDEA 项目自动生成的文件，我们不需要关心或修改这个文件中的内容。
- build.gradle。这是 app 模块的 gradle 构建脚本，这个文件中会指定很多项目构建相关的配置。
- proguard-rules.pro。这个文件用于指定项目代码的混淆规则，当代码开发完成后打成安装包文件，如果不希望代 码被别人破解，通常会将代码进行混淆，从而让破解者难以阅读。

## Android-Manifest.xml
```xml
<activity android:name=".HelloWorldActivity">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
</activity>
```
这段代码表示对 HelloWorldActivity 这个活动进行注册，没有在 AndroidManifest.xml 里注册 的活动是不能使用的。其中 intent-filter 里的两行代码非常重要，<action android:name= "android.intent.action.MAIN" />和<category android:name="android.intent.category. LAUNCHER" />表示 HelloWorldActivity 是这个项目的主活动，在手机上点击应用图标，首先启动 的就是这个活动。**android:name=".HelloWorldActivity"**中.HelloWorldActivity的点，表示相对于包名的路径。

## res 资源文件
- drawable开头。存放图片。
- mipmap开头。存放应用图标。
- values开头。存放字符串、样式、颜色等配置。
- layout。存放布局。

之所以有这么多 mipmap 开头的文件夹，其实主要是为了让程序能够更好地兼容各种设备。 drawable 文件夹也是相同的道理，虽然 Android Studio 没有帮我们自动生成，但是我们应该自己创 建 drawable-hdpi、drawable-xhdpi、drawable-xxhdpi 等文件夹。在制作程序的时候最好能够给同 一张图片提供几个不同分辨率的版本，分别放在这些文件夹下，然后当程序运行的时候，会自动 根据当前运行设备分辨率的高低选择加载哪个文件夹下的图片。当然这只是理想情况，更多的时 候美工只会提供给我们一份图片，这时你就把所有图片都放在 drawable-xxhdpi 文件夹下就好了。参考[文章](https://www.open-open.com/lib/view/open1462929484471.html)。

```xml
<resources>
    <string name="app_name">HelloWorld</string>
</resources>
```
- 在代码中通过 R.string.app_name 可以获得该字符串的引用。 
- 在 XML 中通过@string/app_name 可以获得该字符串的引用。

## main build.gradle
Gradle 是一个非常先进的项目 构建工具，它使用了一种基于 Groovy 的领域特定语言(DSL)来声明项目设置，摒弃了传统基 7 于 XML(如 Ant 和 Maven)的各种烦琐配置。一个项目中有很多 build.gradle 文件，最外层有一个，每一个 module 也有一个。在一个 HelloWorld 项目中，

```groovy

buildscript {
    repositories { // 项目使用这两个仓库
        google()
        jcenter()
        
    }
    dependencies { // 依赖
        classpath 'com.android.tools.build:gradle:3.5.3'
    }
}

allprojects { // 所有项目（包括子项目）
    repositories {
        google()
        jcenter()
    }
}

task clean(type: Delete) { // 定义 clean task
    delete rootProject.buildDir
}
```

### settings.gradle
名字必须是 settings.gradle。它里边用来告诉 Gradle，这个 multiprojects 包含多少个子 Project。
```groovy
include ':app' // 包行 app 子项目
rootProject.name='My Application' // 设置属性值
```

### subproject build.gradle
```groovy
apply plugin: 'com.android.application' // app 依赖 application，库依赖 library

android {
    compileSdkVersion 28 // 编译的 sdk 版本
    buildToolsVersion "29.0.2" // 编译工具版本
    defaultConfig {
        applicationId "com.example.myapplication" // 包名
        minSdkVersion 15 // 最小兼容的版本
        targetSdkVersion 28 // 目标版本
        versionCode 1 // 版本好
        versionName "1.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release { // release 配置
            minifyEnabled false // 开启混淆，下面是规则
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies { // 定义依赖
    // 通常 Android Studio 项目一共有 3 种依 赖方式:本地依赖、库依赖和远程依赖。
    implementation fileTree(dir: 'libs', include: ['*.jar']) // 本地依赖声明
    implementation 'androidx.appcompat:appcompat:1.0.2' // 远程依赖
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'androidx.test.ext:junit:1.1.0'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.1.1'
}
```

## 总结
学习了书籍的第一章，对安卓的整体结构有了认识。

## 学习文档
[Gradle 教程](https://blog.csdn.net/innost/article/details/48228651)
[Android Gradle](https://www.jianshu.com/p/6dc2074480b8)
[java](https://www.runoob.com/java/java-files-io.html)
[Android gradle](https://juejin.im/post/5d6ddb9df265da03f12e759b)
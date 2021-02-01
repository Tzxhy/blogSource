---
title: Andr学习第6天
date: 2020-03-17 23:10:31
tags:
categories:
---



## 持久化技术简介
数据持久化就是指将那些内存中的瞬时数据保存到存储设备中，保证即使在手机或电脑关机的情况下，这些数据仍然不会丢失。保存在内存中的数据是处于瞬时状态的，而保存在存储设备中的数据是处于持久状态的，持久化技术则提供了一种机制可以让数据在瞬时状态和持久状态之间进行转换。

Android 系统中主要提供了3种方式用于简单地实现数据持久化功能，即文件存储、SharedPreferences存储以及数据库存储。

## 文件存储
文件存储是 Android 中最基本的一种数据存储方式，它不对存储的内容进行任何的格式化处 理，所有数据都是原封不动地保存到文件当中的，因而它比较适合用于存储一些简单的文本数据或二进制数据。如果你想使用文件存储的方式来保存一些较为复杂的文本数据，就需要定义一套自己的格式规范，这样可以方便之后将数据从文件中重新解析出来。

保存文件：
```java
public void save() {
    String data = "Data to save";
    FileOutputStream out = null;
    BufferedWriter writer = null;
    try {
        out = openFileOutput("data", Context.MODE_PRIVATE);
        writer = new BufferedWriter(new OutputStreamWriter(out));
        writer.write(data);
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        try {
            if (writer != null) {
                writer.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
} }
```

读取文件：
```java
public String load() {
    FileInputStream in = null;
    BufferedReader reader = null;
    StringBuilder content = new StringBuilder();
    try {
        in = openFileInput("data");
        reader = new BufferedReader(new InputStreamReader(in));
        String line = "";
        while ((line = reader.readLine()) != null) {
            content.append(line);
        }
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        if (reader != null) {
            try {
                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    return content.toString();
}
```

## SharedPreferences
不同于文件的存储方式，SharedPreferences 是使用键值对的方式来存储数据的。也就是说， 当保存一条数据的时候，需要给这条数据提供一个对应的键，这样在读取数据的时候就可以通过 这个键把相应的值取出来。而且 SharedPreferences 还支持多种不同的数据类型存储，如果存储的 数据类型是整型，那么读取出来的数据也是整型的;如果存储的数据是一个字符串，那么读取出 来的数据仍然是字符串。

保存数据。要想使用 SharedPreferences 来存储数据，首先需要获取到 SharedPreferences 对象。Android中主要提供了 3 种方法用于得到 SharedPreferences 对象。
1. Context 类中的 getSharedPreferences()方法。此方法接收两个参数，第一个参数用于指定 SharedPreferences 文件的名称，如果指定的文件 不存在则会创建一个，SharedPreferences 文件都是存放在/data/data/\<package name\>/shared_prefs/ 目录下的。第二个参数用于指定操作模式。
2. Activity 类中的 getPreferences()方法。这个方法和 Context 中的 getSharedPreferences()方法很相似，不过它只接收一个操作模
式参数，因为使用这个方法时会自动将当前活动的类名作为 SharedPreferences 的文件名。
3. PreferenceManager 类中的 getDefaultSharedPreferences()方法。这是一个静态方法，它接收一个 Context 参数，并自动使用当前应用程序的包名作为前缀 来命名 SharedPreferences 文件。

得到了 SharedPreferences 对象之后，就可以开始向 Shared- Preferences 文件中存储数据了，主要可以分为 3 步实现。
(1) 调用 SharedPreferences 对象的 edit()方法来获取一个 SharedPreferences.Editor 对象。
(2) 向 SharedPreferences.Editor 对象中添加数据，比如添加一个布尔型数据就使用 putBoolean()方法，添加一个字符串则使用 putString()方法，以此类推。
(3) 调用 apply()方法将添加的数据提交，从而完成数据存储操作。

```java
saveData.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
    SharedPreferences.Editor editor = getSharedPreferences("data", 4 MODE_PRIVATE).edit();
        editor.putString("name", "Tom");
        editor.putInt("age", 28);
        editor.putBoolean("married", false);
        editor.apply();
    }
});
```

读取数据。
```java
restoreData.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        SharedPreferences pref = getSharedPreferences("data", MODE_PRIVATE);
        String name = pref.getString("name", "");
        int age = pref.getInt("age", 0);
        boolean married = pref.getBoolean("married", false);
        Log.d("MainActivity", "name is " + name);
        Log.d("MainActivity", "age is " + age);
        Log.d("MainActivity", "married is " + married);
    }
});
```

## SQLite 略。

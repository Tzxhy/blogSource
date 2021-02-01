---
title: Andr学习第4天
categories:
  - Andr
date: 2019-12-11 22:25:48
tags:
---


今天学习一下 UI 开发的基础。内容为：第三章：UI 开发。

## 目的
了解常用组件的使用姿势。

### TextView
```xml
<TextView
    android:id="@+id/text_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="center"
    android:text="This is TextView" />
```
我们使用 android:gravity 来指定文字的对齐方式，可选值有 top、bottom、left、right、 center 等，可以用“|”来同时指定多个值，这里我们指定的 center，效果等同于 center_ vertical|center_horizontal，表示文字在垂直和水平方向都居中对齐。

<!-- more -->

### Button
```xml
<Button
    android:id="@+id/button"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:textAllCaps="false"
    android:text="Button" />
```
我们在布局文件里面设置的文字是“Button”，但最终的显示结果 却是“BUTTON”。这是由于系统会对 Button 中的所有英文字母自动进行大写转换，如果这不是你想要的效果，设置：android:textAllCaps="false"。

### EditText
```xml
<EditText
    android:id="@+id/edit_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Type something here"
    android:maxLines="2" />
```

### ImageView
```xml
<ImageView
    android:id="@+id/image_view"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/img_1 " />
```

### ProgressBar
```xml
<ProgressBar
    android:id="@+id/progress_bar"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:outlineAmbientShadowColor="#0f0"
    android:outlineSpotShadowColor="#0f0"
    style="?android:attr/progressBarStyleHorizontal"
    android:progress="20"
    />
```

### AlertDialog
```java
public void onClick(View v) {
    switch (v.getId()) {
        case R.id.button:
            AlertDialog.Builder dialog = new AlertDialog.Builder (MainActivity. this);
            dialog.setTitle("This is Dialog");
            dialog.setMessage("Something important.");
            dialog.setCancelable(false);
            dialog.setPositiveButton("OK", new DialogInterface.
                OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) { }
            });
            dialog.setNegativeButton("Cancel", new DialogInterface.
                OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) { }
            }); dialog.show(); break;
        default:
            break;
    }
}
```

### ProgressDialog

```xml
    public void showDialog(View v) {
        ProgressDialog progressDialog = new ProgressDialog
                (MainActivity.this);
        progressDialog.setTitle("This is ProgressDialog");
        progressDialog.setMessage("Loading...");
        progressDialog.setCancelable(true);
        progressDialog.show();
    }
```

## 布局

### 线性布局
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:orientation="horizontal"
android:layout_width="match_parent" android:layout_height="match_parent">
    <EditText
        android:id="@+id/input_message"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:hint="Type something"
        />
    <Button
        android:id="@+id/send"
        android:layout_width="wrap_content" 10 android:layout_height="wrap_content"
        android:text="Send"
        />
</LinearLayout>
```

### 相对布局
```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent">
    <Button
        android:id="@+id/button1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_alignParentTop="true"
        android:text="Button 1" />
    <Button
        android:id="@+id/button2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentRight="true"
        android:layout_alignParentTop="true"
        android:text="Button 2" />
   <Button
        android:id="@+id/button3"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:text="Button 3" /> 
    <Button
        android:id="@+id/button4"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_alignParentLeft="true"
        android:text="Button 4" />
    <Button
        android:id="@+id/button5"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_alignParentRight="true"
        android:text="Button 5" />
</RelativeLayout>
```

### 帧布局
这种布局没有方便的定位方式，所有的控件都会默认摆放在布局的左上角，类似 Stack。
```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent">
    <TextView
        android:id="@+id/text_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
            android:text="This is TextView"
            />
    <ImageView
        android:id="@+id/image_view"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@mipmap/ic_launcher"
        />
</FrameLayout>
```

## 创建自定义组件
我们所用的所有控件都是直接或间接继承自 View 的，所用的所有布局都是直接 或间接继承自 ViewGroup 的。View 是 Android 中最基本的一种 UI 组件，它可以在屏幕上绘制一 5 块矩形区域，并能响应这块区域的各种事件，因此，我们使用的各种控件其实就是在 View 的基 础之上又添加了各自特有的功能。而 ViewGroup 则是一种特殊的 View，它可以包含很多子 View
和子 ViewGroup，是一个用于放置控件和布局的容器。

### 编写一个布局文件
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal" android:layout_width="match_parent"
    android:layout_height="50sp">
    <Button
        android:id="@+id/title_back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:background="@drawable/ic_launcher_background"
        android:text="Back"
        android:textColor="#fff" />
    <TextView
        android:id="@+id/title_text"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_weight="1"
        android:gravity="center"
        android:text="Title Text"
        android:textColor="#fff"
        android:textSize="24sp" />
    <Button
        android:id="@+id/title_edit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:background="@drawable/ic_launcher_foreground"
        android:text="Edit"
        android:textColor="#fff" />
</LinearLayout>
```

### 引入布局
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
android:layout_width="match_parent" android:layout_height="match_parent" >
    <include layout="@layout/title" />
</LinearLayout>
```

### 创建组件
引入布局的技巧确实解决了重复编写布局代码的问题，但是如果布局中有一些控件要求能够 响应事件，我们还是需要在每个活动中为这些控件单独编写一次事件注册的代码。比如说标题栏 中的返回按钮，其实不管是在哪一个活动中，这个按钮的功能都是相同的，即销毁当前活动。而如果在每一个活动中都需要重新注册一遍返回按钮的点击事件，无疑会增加很多重复代码，这种情况最好是使用自定义控件的方式来解决。

新建一个 Layout：
```java
public class TitleLayout extends LinearLayout {
    public TitleLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.title, this);
        Button titleBack = (Button) findViewById(R.id.title_back);
        Button titleEdit = (Button) findViewById(R.id.title_edit);
        titleBack.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                ((Activity) getContext()).finish();
            }
        });
        titleEdit.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(getContext(), "You clicked Edit button", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

在布局中使用自定义 Layout：
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:layout_width="match_parent" android:layout_height="match_parent" >
    <com.example.myapplication.TitleLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />
</LinearLayout>
```


## ListView-最难用 & 最常用的组件

### 创建一个 item_layout.xml
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    style="android:colorControlHighlight"
    android:layout_gravity="end">
    <ImageView
        android:id="@+id/fruit_image"
        android:layout_width="50sp"
        android:layout_height="wrap_content" />
    <TextView
        android:id="@+id/fruit_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:layout_marginLeft="10dp" />
</LinearLayout>
```

### 创建一个 Adapter
```java

public class FruitAdapter extends ArrayAdapter<Fruit> {

    private int resourceId;

    private static final String TAG = "FruitAdapter";
    public FruitAdapter(Context context, int textViewResourceId, List<Fruit> objects) {
        super(context, textViewResourceId, objects);
        resourceId = textViewResourceId;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Log.d(TAG, "getView: called");
        Fruit fruit = getItem(position); // 获取当前项的 Fruit 实例
        View view;
        ViewHolder viewHolder;
        if (convertView == null) {
            view = LayoutInflater.from(getContext()).inflate(resourceId, parent,
                    false);
            viewHolder = new ViewHolder();
            viewHolder.fruitImage = (ImageView) view.findViewById
                    (R.id.fruit_image);
            viewHolder.fruitName = (TextView) view.findViewById (R.id.fruit_name);
            view.setTag(viewHolder); // 将 ViewHolder 存储在 View 中
        } else {
            view = convertView;
            viewHolder = (ViewHolder) view.getTag(); // 重新获取ViewHolder
        }
        viewHolder.fruitImage.setImageResource(fruit.getImageId());
        viewHolder.fruitName.setText(fruit.getName());
        return view;
    }

    private class ViewHolder {
        ImageView fruitImage;
        TextView fruitName;
    }
}
```

### 添加布局中的 ListView
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ListView
        android:id="@+id/list_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```


<!-- ## 更强大的滚动容器--RecyclerView
ListView 由于其强大的功能，在过去的 Android 开发当中可以说是贡献卓越，直到今天仍然 还有不计其数的程序在继续使用着 ListView。不过 ListView 并不是完全没有缺点的，比如说如果 我们不使用一些技巧来提升它的运行效率，那么 ListView 的性能就会非常差。还有，ListView 的 扩展性也不够好，它只能实现数据纵向滚动的效果，如果我们想实现横向滚动的话，ListView 是 做不到的。
为此，Android 提供了一个更强大的滚动控件——RecyclerView。它可以说是一个增强版的 ListView，不仅可以轻松实现和 ListView 同样的效果，还优化了 ListView 中存在的各种不足之处。 目前 Android 官方更加推荐使用 RecyclerView。

###  -->
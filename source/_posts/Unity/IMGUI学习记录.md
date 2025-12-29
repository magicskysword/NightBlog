---
title: IMGUI学习记录
date: 2021-04-03 18:07:00
category:
- Unity
---

# IMGUI学习
## 简介
### 来源
GUI 全称 IMGUI，全称“即时模式游戏用户交互界面”
是Unity里最早的GUI系统
### 主要作用
1. 游戏程序调试工具
2. 为脚本组件创建自定义检视面板
3. 创建新的编辑器窗口，以及扩展Unity本身
**注意：不要用IMGUI编写玩家GUI**
### 工作原理
在继承MonoBehavior的脚本中的特殊函数里，每帧调用OnGUI方法。
``` C#
private void OnGUI()
{
    //在其中书写GUI相关代码 即可显示GUI内容
}
```
* 注意事项
1. 在游戏里每帧调用执行
2. 一般只在其中执行GUI界面的操作相关函数
3. 该函数在` OnDisable()`  之前，` LateUpdate()` 之后执行
4. 只要继承`MonoBehaviour` 的脚本，都可以在OnGUi中绘制UI

## 绘制
### 1.GUI绘制的共同点
1. 同属于GUI类中的静态方法，可以直接调用
2. 共同参数大同小异

| 类型 | 参数 | 常用字段 |
| ---- | ----- | ---- |
|位置|Rect|位置：x y  尺寸：w h|
|文本|string||
|图片|Texture||
|综合|GUIContent||
|自定义样式|GUIStyle||

3. 每一种控件都有多种重载，是各个参数的排列组合
必备的参数 是 **位置信息**和**显示信息**

### 2.控件
#### 1. 文本控件
``` C#
public Texture texture;
private void OnGUI()
{
    // 绘制文本
    GUI.Label(new Rect(0,0,100,20),"Hello World");
    // 绘制图片
    GUI.Label(new Rect(0,20,100,100),texture);
    // 绘制GUIContent
    GUI.Label(new Rect(0,120,120,100),new GUIContent("Hello World",texture));
}
```
#### 2. GUIStyle
* 影响GUI控件的样式
``` C#
public GUIStyle guiStyle;
private void OnGUI()
{
    // GUIStyle
    GUI.Label(new Rect(0,0,100,20),"Hello World",guiStyle);
}
```
#### 3. 按钮控件
* 绘制按钮
``` C#
public Rect rect;
public GUIContent guiContent;
public Texture texture;
public GUIStyle guiStyle;
private void OnGUI()
{
    // 修改按钮图片
    guiStyle.normal.background = texture;
    // 绘制按钮
   GUI.Button(rect, guiContent, guiStyle);
}
```
* 普通按钮点击逻辑
``` C#
public Rect rect;
private void OnGUI()
{
    // 只有按下并抬起才算一次点击
    if(GUI.Button(rect, "按钮"))
    {
        Debug.Log("按钮被按下");
    }
}
```
* 长按按钮点击逻辑
``` C#
public Rect rect;
private void OnGUI()
{
    // 按下时一直算点击
    if(GUI.RepeatButton(rect, "按钮"))
    {
        Debug.Log("按钮被按下");
    }
}
```
#### 4. 多选框
* 绘制多选框
``` C#
public Rect rect;
private void OnGUI()
{
    // 多选框绘制
    GUI.Toggle(rect, true, "按钮");
}
```
* 接受多选框信息
``` C#
public Rect rect;
public bool curState = false;
private void OnGUI()
{
    // 接受bool值
    curState = GUI.Toggle(rect, curState, "按钮");
}
```
**注意**：当对Toggle使用Style时，使用fixedWidth与fixedHeight控制图片大小，使用Padding修改文字位置。

#### 5. 单选框
* 单选框的实现是基于多选框的。
``` C#
public int curSelIndex = 1;
private void OnGUI()
{
    // 使用多选框实现
    if (GUI.Toggle(new Rect(0,0,100,20), curSelIndex == 1, "按钮1"))
    {
        curSelIndex = 1;
    }
    if (GUI.Toggle(new Rect(0,20,100,20), curSelIndex == 2, "按钮2"))
    {
        curSelIndex = 2;
    }
    if (GUI.Toggle(new Rect(0,40,100,20), curSelIndex == 3, "按钮3"))
    {
        curSelIndex = 3;
    }
    if (GUI.Toggle(new Rect(0,60,100,20), curSelIndex == 4, "按钮4"))
    {
        curSelIndex = 4;
    }
}
```
#### 6. 输入框
* 普通输入
``` C#
public string inputStr = "";
private void OnGUI()
{
    // 接受字符串并重新赋值
   inputStr = GUI.TextField(new Rect(0, 0, 200, 40), inputStr);
}
```
* 密码输入
``` C#
public string inputStr = "";
private void OnGUI()
{
    // 接受字符串并重新赋值
   inputStr = GUI.PasswordField(new Rect(0, 0, 200, 40), inputStr,'*');
}
```
#### 7. 拖动条
``` C#
public float inputValH;
public float inputValV;
private void OnGUI()
{
    // 水平拖动条
   inputValH = GUI.HorizontalSlider(new Rect(0, 0, 100, 20), inputValH, 0, 1);
   // 垂直拖动条
   inputValV = GUI.VerticalSlider(new Rect(0, 0, 100, 20), inputValV, 0, 1);
}
```
#### 8. 图片绘制
``` C#
public Texture texture;
private void OnGUI()
{
    // 绘制图片
    GUI.DrawTexture(new Rect(0,0,100,100),texture);
}
```
#### 9. 框绘制
``` C#
private void OnGUI()
{
    // 绘制图片
    GUI.Box(new Rect(0,0,100,100),"123");
}
```
#### 10. 工具栏
* 水平工具栏
``` C#
public int selIndex = 0;
public string[] toolbars = new string[] {"选项一", "选项二", "选项三"};
private void OnGUI()
{
   selIndex = GUI.Toolbar(new Rect(0, 0, 100*toolbars.Length, 100), selIndex, toolbars);
}
```
* 网格工具栏
``` C#
public int selIndex = 0;
public string[] toolbars = new string[] {"选项一", "选项二", "选项三"};
private void OnGUI()
{
   selIndex = GUI.SelectionGrid(new Rect(0, 0, 100*2, 100*Mathf.Ceil(toolbars.Length/2f)), selIndex, toolbars,2);
}
``` 
#### 11. 分组
* 分组里，GUI的大小与位置会受到组Rect的影响
``` C#
public Rect rect = new Rect(0,0,100,100);
private void OnGUI()
{
    GUI.BeginGroup(rect);
    {
        GUI.Button(new Rect(0, 0, 50, 50), "按钮");
    }
    GUI.EndGroup();
}
```
#### 12. 滚动列表
* 滚动列表里，内容会被限制在Rect里，而viewRect则是总体的View内容大小
``` C#
public Rect rect = new Rect(0,0,100,800);
public Rect rectView = new Rect(0, 0, 100, 100);
public Vector2 view = new Vector2(0, 0);
private void OnGUI()
{
    view = GUI.BeginScrollView(rect, view, rectView);    
    for (int i = 0; i < 8; i++)   
    {        
        GUI.Button(new Rect(0, 100 * i, 100, 100), $"按钮 {i} ");
    }   
    GUI.EndScrollView();
}
```
#### 13. 窗口
* 窗口
```C#
public Rect rect = new Rect(100,100,100,100);
private void OnGUI()
{
    // 窗口ID必须唯一
    GUI.Window(1,rect,DrawWindow,"测试窗口");
}

private void DrawWindow(int id)
{
    GUI.Button(new Rect(5, 20, 50, 20), "按钮");
}
```
* 模态窗口
模态窗口位于所有窗口的最上层。当模态窗口出现时，其他窗口无法点击。
```C#
public Rect rect = new Rect(100,100,100,100);
private void OnGUI()
{
    // 窗口ID必须唯一
    GUI.ModalWindow(1,rect,DrawWindow,"测试窗口");
}

private void DrawWindow(int id)
{
    GUI.Button(new Rect(5, 20, 50, 20), "按钮");
}
```
* 拖动窗口
```C#
public Rect rect = new Rect(100,100,100,100);
private void OnGUI()
{
    // 窗口ID必须唯一
    rect = GUI.Window(1,rect,DrawWindow,"测试窗口");
}

private void DrawWindow(int id)
{
    GUI.Button(new Rect(5, 20, 50, 20), "按钮");
    // 另一种重载，使用Rect固定拖动位置
    GUI.DragWindow();
}
```

### 3. 样式
#### 1. 颜色设置
* 全局颜色
```C#
GUI.color = Color.red;
```
* 文本颜色
```C#
GUI.contentColor = Color.red;
```
* 背景颜色
```C#
GUI.backgroundColor = Color.red;
```
#### 2. 整体皮肤样式
GUISkin 是 所有GUI的Style的一个集合。
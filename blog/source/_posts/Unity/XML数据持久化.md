---
title: XML数据持久化
date: 2021-04-06 21:47:12
category:
- Unity
- C#
---

# XML数据持久化
## XML文件格式
### 1.XML是什么
* XML是一种树形结构格式
* XML文件后缀为 *.xml

### 2.注释
```xml
<!---->
<!--这里写注释信息-->
<!--
多行
注释
-->
```

### 3.固定内容
* 固定内容很重要，在XML第一行写上
```xml
<?xml version="1.0" encoding="UTF-8"?>
```
* version 代表版本
* encoding 代表编码格式

### 4.基本语法
```xml
<!-- <元素标签>元素内容</元素标签> -->
<!--xml语法是配对出现的-->
<PlayerInfo>
    <Name>角色名</Name>
    <Age>18</Age>
    <Sex>1</sex>
    <ItemList>
        <Item>
            <id>1</id>
            <sum>10</sum>
        </Item>
        <Item>
            <id>2</id>
            <sum>0</sum>
        </Item>
    </ItemList>
 </PlayerInfo>
```

### 5.基本规则
1. 每个元素都必须有关闭标签
2. 元素命名规则基本参照C#命名规则
3. XML标签大小写敏感
4. XML元素必须有根元素
5. 特殊的符号应该用实体引用

| 符号 | 作用 |
| ---- | --- |
| &It  | < 小于  |
| &gt | > 大于  |
| &amp  | & 和号  |
| &apos  | ' 单引号  |
| &quot | " 引号 | 

### 6.属性
```xml
<!--属性是在元素标签空格后，添加的内容-->
<!--注意：属性必须要用引号包裹，单引号双引号皆可-->
<Role Type="Hero">
    <Name>超人</Name>
    <Age>26</Age>
</Role>
<!--注意：如果使用属性记录信息，不需要使用元素时，可以使用如下写法-->
<Role Type="Hero" Name="超人" Age="26"/>
```

### 7.属性和元素节点的区别
* 属性和元素节点只是写法上的区别
* 可以选择自己喜欢的写法来记录数据

### 8.如何检查语法错误
1. 元素节点必须配对
2. 属性必须有引号
3. 注意命名

## 使用C#读取XML
### XML文件存放位置

* 只读不写的XML文件
> Resources或StreamingAssets文件夹下
* 动态储存的XML文件
> Application.persistentDataPath 路径下

### C#加载XML的方式
1. XmlDocument
    可以把数据加载到内存中，方便读取
2. XmlTextReader
    以流的形式加载，内存占用更少，但是单向只读，使用不方便。
3. Linq

### 使用XmlDocument读取XML
#### 1.加载XML
引用
``` C#
using system.xml;
```

1. 使用字符串加载xml
```C#
TextAsset textAsset = Resources.Load<TextAsset>("Test");
XmlDocument document = new XmlDocument();
document.LoadXml(textAsset.text);
```

2. 通过XML文件的路径加载
```C#
XmlDocument document = new XmlDocument();
document.Load(Application.streamingAssetsPath + "/Test.xml");
```

 #### 2.读取XML
 Test.xml内容
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Root>
    <name>超人</name>
    <item id="1" count="1"/>
    <firendList>
        <friend name="小明" />
        <friend name="小美" />
    </firendList>
</Root>
```
读取方法
```C#
// 获取根节点
XmlNode root = document.SelectSingleNode("Root");
// 通过根节点，获取子节点
XmlNode nodeName = document.SelectSingleNode("name");
// 通过Node.InnerText获取节点元素
print(nodeName.InnerText);
// 通过Attributes获得属性
XmlNode nodeItem = root.SelectSingleNode("item");
print(nodeItem.Attributes["id"]);
print(nodeItem.Attributes.GetNamedItem("count").Value);
// 获取一个节点下的同名节点
XmlNode firendList = root.SelectSingleNode("firendList");
XmlNodeList nodeFriends = firendList.SelectNodes("firend");
// 通过foreach遍历节点列表
foreach (XmlNode friend in nodeFriends)
{
    print(friend.Attributes("id").InnerText);
}
// 通过for循环遍历节点列表
for (int i = 0; i < nodeFriends.Count; i++)
{
    print(nodeFriends[i].Attributes("id").InnerText);
}
```

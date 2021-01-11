# 欢迎使用 MPEditor Markdown 编辑器

**MPEditor**是专注于微信公众号的编辑阅读器，利用 MPEditor 可以使用 **Markdown** 语法编写微信公众号文章，编辑完后可以复制到公众号发布平台直接发布，真正的实现即看即所得：

-   更加贴合微信 UI 标准
-   支持实时预览
-   支持同步滚动
-   支持语法高亮

> MPEditor 解决了微信公众号编辑中遇见的一些编辑问题，增加了「工（ma）程（nong）师（men）」经常遇见的代码高亮、emoji 问题。希望你会喜欢这种极（zhuang）客（bi）的体验

<header-box>使用方法</header-box>

在左侧 Markdown 编辑器中编写 Markdown 格式的内容，编辑完成后点击右上角`√`，复制内容到微信编辑器粘贴即可。

## 本编辑器支持快捷键

-   `⌘+S` or `Ctrl+S`：保存编写的内容

<header-box>什么是 Markdown</header-box>

Markdown 是一种方便记忆、书写的纯文本标记语言，用户可以使用这些标记符号以最小的输入代价生成极富表现力的文档：譬如您正在阅读的这份文档。它使用简单的符号标记不同的标题，分割不同的段落，**粗体** 、 _斜体_ 、~~delete~~ 某些文字。["info" MPEditor] 使用了 `showdown` 语法（一种 markdown 的扩展语法）

<header-box>语法</header-box>

## 1. 标题

### 标题三

#### 标题四

##### 标题五，不常用

###### 标题六，不常用

## 2. 列表样式

-   偶是个无序列表
    -   我是个二级无序列表
-   真巧啊我也是个无序列表

1. 我是个有序列表啊
2. 嗯，me too~
3. markdown so easy! 妈妈再也不用担心我的**学习**了

!> 由于微信原因，最多支持到二级列表。

## 3. 高亮代码

使用了微信原生语法高亮。

```js
// 新语法检测
import $ from 'jQuery';
$(document).on('click', () => {
    let that = this;
    console.log(that);
});

var aceEditor = new ace.editor('#id');

$(function () {
    $('div').html('I am a div.');
    $('div').html('I am a long long long long long long long long long long long long long string.');
});
```

上面是 `JavaScript`，下面是 `php`：

```php
echo 'hello,world'
```

## 4. 链接和图片

-   MPEditor：https://github.com/ksky521/mpeditor
-   demo: [点击查看 demo](https://github.com/ksky521/mpeditor/blob/master/static/demo.md)

下面是个「三水清」的微信公众号二维码，欢迎扫描关注：

![关注三水清](https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p.jpg)

换个小点的头像

![关注三水清](https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p.jpg =120x120)

## 5. 表格样式

下面是个普通的表格
| 公众号 | id | 备注 |
|:-----|-----|:------:|
| 三水清 | sanshuiqing123 | 作者很帅 |
| 博客 | http://js8.in | 程序媛鼓励师 |

支持另外一种语法：
公众号 | id/网址 | 备注
------------ | ---------- | ------
三水清 | sanshuiqing123 | 作者很帅
博客 | http://js8.in | 程序媛鼓励师

## 6. 支持`span`语法样式

### 内置样色 class

<span class="green">green/success</span>
<span class="info">info/blue</span>
<span class="danger">danger/red</span>
<span class="warning">warning/yellow</span>
<span class="gray">gray</span>

### 其他样式

<span style="font-size:24px;font-weight:bold;color:#ccc">自定义样式字号等</span>


## 7. 引用

> MPEditor 解决了微信公众号编辑中遇见的一些编辑问题，增加了「工（ma）程（nong）师（men）」经常遇见的代码高亮、emoji 问题。希望你会喜欢这种极（zhuang）客（bi）的体验

下面是个特殊的引用，背景是红色

!> MPEditor 解决了微信公众号编辑中遇见的一些编辑问题，增加了「工（ma）程（nong）师（men）」经常遇见的代码高亮、emoji 问题。希望你会喜欢这种极（zhuang）客（bi）的体验

### 多级引用

引用的格式是在符号 `>` 后面书写文字，文字的内容可以包含标题、链接、图片、粗体和斜体等。

一级引用如下：

> ### 一级引用示例
>
> 读一本好书，就是在和高尚的人谈话。 **——歌德**
>
> [Markdown Nice 最全功能介绍](https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg)
>
> ![这里写图片描述](https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p)

当使用多个 `>` 符号时，就会变成多级引用

二级引用如下：

> > ### 二级引用示例
> >
> > 读一本好书，就是在和高尚的人谈话。 **——歌德**
> >
> > [Markdown Nice 最全功能介绍](https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg)
> >
> > ![这里写图片描述](https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p)

三级引用如下：

> > > ### 三级引用示例
> > >
> > > 读一本好书，就是在和高尚的人谈话。 **——歌德**
> > >
> > > [Markdown Nice 最全功能介绍](https://mp.weixin.qq.com/s/lM808MxUu6tp8zU8SBu3sg)
> > >
> > > ![这里写图片描述](https://wx3.sinaimg.cn/orj360/796f423bly1gfzytdw3qhj20by0byq3p)

## 8. 分割线

--分割线--

==密封线==

## 9. 特殊组件

?> 下面是一些特殊样式，你可能用得到

#### 盒子标题

<header-box>盒子标题</header-box>

#### 主副标题样式

<header-box sub-title="01">这是标题</header-box>

<header-box sub-title="副标题">这里是主标题</header-box>

#### 底部扫码

<qrcode-box></qrcode-box>


#### 横屏滑动幻灯片
<![蓝1](https://files.mdnice.com/blue.jpg),![绿2](https://files.mdnice.com/green.jpg),![红3](https://files.mdnice.com/red.jpg)>


再一次感谢您花费时间阅读这份欢迎稿！

--EOF--

作者[@三水清](http://weibo.com/sanshuiqing)<br/>
2020 年 06 月 21 日

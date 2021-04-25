# 公众号 Markdown 编辑器

**MPEditor**是专注于微信公众号的编辑阅读器，利用 MPEditor 可以使用 **Markdown** 语法编写微信公众号文章，编辑完后可以复制到公众号发布平台直接发布，真正的实现即看即所得：

-   更加贴合微信 UI 标准
-   支持实时预览
-   支持同步滚动
-   支持语法高亮
-   自动加「参考资料」脚注

> MPEditor 解决了微信公众号编辑中遇见的一些编辑问题，增加了「工（ma）程（nong）师（men）」经常遇见的代码高亮、emoji 问题。希望你会喜欢这种极（zhuang）客（bi）的体验

<header-box>使用方法</header-box>

在左侧 Markdown 编辑器中编写 Markdown 格式的内容，编辑完成后点击右上角`√`，复制内容到微信编辑器粘贴即可。

## 本编辑器支持快捷键

-   `⌘+S` / `Ctrl+S`：保存编写的内容
-   `⌘+B` / `Ctrl+B`：加粗
-   `⌘+I` / `Ctrl+I`：斜体
-   `⌘+'` / `Ctrl+'`：引用
-   `⌘+U` / `Ctrl+U`：删除线,
-   `⌘+P` / `Ctrl+P`：快速插入图片,
-   `⌘+H` / `Ctrl+H`：`header-box`语法，（往后看）
-   `⌘+K` / `Ctrl+K`：快速链接

<header-box>什么是 Markdown</header-box>

Markdown 是一种方便记忆、书写的纯文本标记语言，用户可以使用这些标记符号以最小的输入代价生成极富表现力的文档：譬如您正在阅读的这份文档。它使用简单的符号标记不同的标题，分割不同的段落，**粗体** 、 _斜体_ 、~~delete~~ 某些文字。<span class="info">MPEditor</span> 使用了 [markdown-it](https://github.com/markdown-it/markdown-it 'markdown-it')转换语法，[CodeMirror](https://codemirror.net 'CodeMirror')来做编辑器

<header-box>语法</header-box>

## 1. 标题
标题样式使用`#`来创建，分别有六种标题样式：

### 标题三

#### 标题四

##### 标题五，不常用

###### 标题六，不常用

## 2. 列表样式
列表支持有序列表和无需列表。

-   偶是个无序列表
    -   我是个二级无序列表
-   真巧啊我也是个无序列表

1. 我是个有序列表啊
2. 嗯，me too~
3. markdown so easy! 妈妈再也不用担心我的**学习**了

!> 由于微信原因，最多支持到二级列表。

## 3. 高亮代码

使用了微信原生语法高亮，复制代码到微信编辑器中自动替换为微信的语法高亮。

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

## 4. 链接

链接样式使用`![]()`方式编写如下面：

-   MPEditor：https://github.com/ksky521/mpeditor
-   demo: [点击查看 demo](https://github.com/ksky521/mpeditor/blob/master/static/demo.md)

另外还支持[脚注语法](https://github.com "Github")，滑到页面底部会看到参考资料。

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

宽度过长的表格可以滚动，可在自定义主题中调节宽度：

| 姓名       | 年龄 |         工作 |      邮箱       |    手机     |
| :--------- | :--: | -----------: | :-------------: | :---------: |
| 小可爱     |  18  |     吃可爱多 | lovely@test.com | 18812345678 |
| 小小勇敢   |  20  |   爬棵勇敢树 | brave@test.com  | 17712345678 |
| 小小小机智 |  22  | 看一本机智书 | smart@test.com  | 16612345678 |


## 6. 图片格式

图片支持简单的样式，例如下面的：

![关注三水清](https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg)

还支持在`()`中填写图片的尺寸，例如换个小点的头像：

![关注三水清](https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg  =120x120)

另外还支持`<image-flow>`标签语法，添加图片横屏滑动幻灯片（灵感来自MarkdownNice）

<image-flow images="https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkx1YibJjvrLPk4lvuv78spVzucdibRuDGLYqFe5ib1ZbAYbj0UoSrv4dww/640.jpeg,https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkbZ8lcG8TyYoiaga2vBatzWnxvyg3a1EJ36k9OjLS84ewXsUgq4ic9owg/640.jpeg,https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkiazYw2XlUKNicLoNzvyJbDSp46cTlMvjgsboibG7drKY8z1psvNzg4uUQ/640.jpeg">左右滑动展示更多</image-flow>

这是个竖向滑动的

<image-flow vertical images="https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkx1YibJjvrLPk4lvuv78spVzucdibRuDGLYqFe5ib1ZbAYbj0UoSrv4dww/640.jpeg,https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkbZ8lcG8TyYoiaga2vBatzWnxvyg3a1EJ36k9OjLS84ewXsUgq4ic9owg/640.jpeg,https://wximg.yiban.io/img_proxy?src=http://mmbiz.qpic.cn/mmbiz_jpg/yqVAqoZvDibGYNY6cUEiayxW9z2LhUwibmkiazYw2XlUKNicLoNzvyJbDSp46cTlMvjgsboibG7drKY8z1psvNzg4uUQ/640.jpeg">上下滑动展示更多</image-flow>
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
> [网站](https://js8.in)
>
> ![这里写图片描述](https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg)

当使用多个 `>` 符号时，就会变成多级引用

二级引用如下：

> > ### 二级引用示例
> >
> > 读一本好书，就是在和高尚的人谈话。 **——歌德**
> >
> > [网站](https://js8.in)
> >
> > ![这里写图片描述](https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg)

三级引用如下：

> > > ### 三级引用示例
> > >
> > > 读一本好书，就是在和高尚的人谈话。 **——歌德**
> > >
> > > [网站](https://js8.in)
> > >
> > > ![这里写图片描述](https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg)

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


## 10. 支持html

例如我们内置样色 `class`：

<span class="green">green/success</span>
<span class="info">info/blue</span>
<span class="danger">danger/red</span>
<span class="warning">warning/yellow</span>
<span class="gray">gray</span>

### 其他样式

<span style="font-size:24px;font-weight:bold;color:#ccc">自定义样式字号等</span>

再一次感谢您花费时间阅读这份欢迎稿！

--EOF--

作者[@三水清](http://weibo.com/sanshuiqing)<br/>
2021 年 01 月 12 日

<center>
    <p style="font-size:12px">下面是个「三水清」的微信公众号二维码，欢迎扫描关注：</p>
    <img src="https://raw.githubusercontent.com/ksky521/mpeditor/master/static/qrcode-ssq.jpg" width="200px"/>
</center>

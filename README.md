# chrome_extends

写的一些谷歌扩展，就写着玩玩  
参考文档：  
[1.掘金文章](https://juejin.im/post/5e8ea783f265da47f60eae7e#heading-9) 文章里面也有参考文章  
[2.manifest](https://developer.chrome.com/extensions/manifest)  
[3.w3cschool](https://www.w3cschool.cn/kesyi/kesyi-m5uo24rx.html)  
[4.chrome 插件网](https://huajiakeji.com/dev/2019-01/1784.html)

### 1.darkmodev2

网页的强制暗黑模式

1. 特色功能：

-   支持动态加载的网页  
    某些网页可能存在 下滑加载更多，本扩展支持对动态创建的元素，也会加载样式
-   **支持自动识别系统所处的暗色主题 （默认打开）** <span style="color:#E05749">重磅消息！！！ 2.1.1 支持 跟随系统颜色主题变化</span>  
    前提是 浏览器支持，如果不支持会在工具框中提示,目前高版本 chromium 内核的浏览器都支持

    window 进入暗黑模式：设置->个性化->颜色->选择默认应用模式  
    macos 系统进入暗黑模式：额没用过苹果电脑 555，[百度搜索链接](http://zhongce.sina.com.cn/article/view/31432/)  
    请先确认打开识别功能  
    ![](https://ftp.bmp.ovh/imgs/2020/06/d0a15f822c6ad4c8.png)

    原理 ： window.matchMedia('(prefers-color-scheme: dark)') 方法检测媒体查询

2. 已知 bug

-   某些页面里的视频在暗黑模式下，无法观看，一片黑，已知的网站有 B 站 视频播放页，微博网页端  
    微博网页端 视频黑屏原因已经找到，已解决

-   360 搜索结果换页之后，切换按钮不见了，原因在于 360 换页的逻辑是重新加载 body 下的所有元素

**注意事项**：

-   页面加载完成后，才会显示切换的按钮
-   由于本扩展 采用的是一股脑的把所有 div,section,nav 元素添加 dark-mode 类， 所以样式上 可能有点怪怪的，望谅解
-   开启自动识别系统暗色 主题后，如果网速过慢，页面加载速度过慢，会出现部分 没有采用暗色的情况

### 2. 滚动截屏

1. 功能

-   截取全屏
-   滚动页面选择 截取的范围

**思路:**
开始截取后,在background.js 内 通过api  chrome.tabs.captureVisibleTab 保存浏览器可视范围内的图像,再通知 content 滚动页面,最后处理 边界值.

**bug**:无法解决,实现的时候发现,通过 chrome 浏览器 提供的 api: chrome.tabs.captureVisibleTab 截取到的视图宽高 和页面 client 的宽高不一致,导致了 边界处理 和图片的拼接有一些问题,个人暂时无法解决  555555

#### 安装方法

1. 浏览器打开开发者模式 将 dist 下对应扩展的 crx 文件拖入浏览器
2. 第一种方法不行的话，解压 dist 下对应扩展的 zip 文件，浏览器点击加载已解压的扩展程序（同样要打开开发者模式）

# chrome_extends
写的一些谷歌扩展，就写着玩玩  
参考文档：  
[1.掘金文章](https://juejin.im/post/5e8ea783f265da47f60eae7e#heading-9)文章里面也有参考文章  
[2.manifest](https://developer.chrome.com/extensions/manifest)  
[3.w3cschool](https://www.w3cschool.cn/kesyi/kesyi-m5uo24rx.html)  
[4.chrome 插件网](https://huajiakeji.com/dev/2019-01/1784.html)  

### 1.darkmodev2
网页的强制暗黑模式
1. 特色功能：  
- 支持动态加载的网页  
某些网页可能存在 下滑加载更多，本扩展支持对动态加载的元素，加载样式
- 支持自动识别系统所处的暗色主题  （默认关闭）  
前提是 浏览器支持，如果不支持会在工具框中提示,一般chromium内核的浏览器都支持  
原理 ： window.matchMedia('(prefers-color-scheme: dark)') 方法检测媒体查询

2. 已知bug  
某些页面里的视频在暗黑模式下，无法观看，一片黑，正在排除，也欢迎小伙伴提出你的看法


### 2. 滚动截屏
目前构思的是，一个支持 网页截全屏和滚动截屏的扩展，不知道能不能做出了。。。。555








#### 安装方法
1. 浏览器打开开发者模式 将 dist 下对应扩展的crx 文件拖入浏览器
2. 第一种方法不行的话，解压dist 下对应扩展的zip 文件，浏览器点击加载已解压的扩展程序（同样要打开开发者模式）

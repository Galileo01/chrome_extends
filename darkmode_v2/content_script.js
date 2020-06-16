$(function () {
    const switchBtn = $('<div class="switch">日间</div>');
    let mode = 'day'; //模式
    document.body.appendChild(switchBtn[0]);
    // $(document.body).prepend(switchBtn);//添加到 body 的最前面
    let preLength = 0; //记录之前 的个数

    //发送消息，更改popup.html 的文字
    chrome.runtime.sendMessage({ loaded: true }, function (res) {
        console.log(res);
    });
    console.log('loaded');

    //切换到 暗黑模式
    const toDarkMode = () => {
        const divs = $('div');
        preLength = divs.length;
        const navs = $('nav');
        const sections = $('section'); // section 用的少
        const uls = $('ul');
        const tds = $('td');
        console.log(divs.length);
        divs.addClass('dark-mode');
        navs.addClass('dark-mode');
        sections.addClass('dark-mode');
        uls.addClass('dark-mode');
        tds.addClass('dark-mode');
        //单独适配 微博网页端 video 上方使用div 遮罩层工具栏的   造成的 视频 一篇黑的 问题
        if (window.location.href.includes('weibo')) {
            const masks = $('.wbv-pop-layer');
            if (masks.length > 0) {
                masks.removeClass('dark-mode');
            }
        }
        document.body.classList.add('body-dark');
        switchBtn.html('夜间').removeClass('dark-mode');
    };
    //恢复原始的样式
    const restore = () => {
        const divs = $('div');
        preLength = divs.length;
        const navs = $('nav');
        const sections = $('section'); // section 用的少
        const uls = $('ul');
        const tds = $('td');
        divs.removeClass('dark-mode');
        navs.removeClass('dark-mode');
        sections.removeClass('dark-mode');
        uls.removeClass('dark-mode');
        tds.removeClass('dark-mode');
        document.body.classList.remove('body-dark');
        switchBtn.html('日间').removeClass('dark-mode');
    };

    //监听点击事件 ，，改变 主题
    switchBtn.on('click', function () {
        if (mode === 'day') {
            toDarkMode();
            mode = 'night';
        } else {
            restore();
            mode = 'day';
        }
    });

    // 节流throttle代码（定时器）：
    var throttle = function (func, delay) {
        var timer = null;
        return function () {
            var context = this;
            var args = arguments;
            if (!timer) {
                timer = setTimeout(function () {
                    func.apply(context, args);
                    timer = null;
                }, delay);
            }
        };
    };

    //监听 页面的下滑 加载更多 ，，使用 节流 函数， 减少处理函数的调用次数，优化性能
    window.addEventListener(
        'scroll',
        throttle(() => {
            const divs = $('div');
            const Length = divs.length;
            if (Length > preLength && mode === 'night') {
                //只对没有 dark-mode 的元素 div 添加 类名
                divs.each((index, ele) => {
                    if (!ele.classList.contains('dark-mode')) {
                        ele.classList.add('dark-mode');
                    }
                });
                switchBtn.removeClass('dark-mode');
                console.log('load more');
            }
            console.log('scroll handle');
        }, 1000)
    );

    // 进入页面,判断 浏览器是否支持 媒体查询'(prefers-color-scheme: dark) 即 暗黑主题
    const colorSchemeQuery = matchMedia('(prefers-color-scheme: dark)');

    if (colorSchemeQuery.media === '(prefers-color-scheme: dark)') {
        //获取 扩展 的全局变量 ,检测是否要自动识别
        chrome.storage.sync.get('isAuto', function ({ isAuto }) {
            if (isAuto && colorSchemeQuery.matches) {
                //如果选择了是并且系统 已经开启了 暗黑模式
                toDarkMode();
                mode = 'night';
            }
        });

        //监听 系统主题的变化 ,跟随主题
        colorSchemeQuery.addListener(function () {
            chrome.storage.sync.get('isAuto', function ({ isAuto }) {
                console.log(isAuto);
                if (isAuto) {
                    if (colorSchemeQuery.matches) {
                        toDarkMode();
                    } else restore();
                }
            });
        });
    } else {
        console.log('当前浏览器不支持跟随系统暗黑模式');
        //更改 扩展的全局数据
        chrome.storage.sync.set({ isSupported: false });
    }
});

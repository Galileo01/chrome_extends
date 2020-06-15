$(function () {
    const switchBtn = $('<div class="switch">日间</div>');
    let mode = 'day'; //模式
    document.body.appendChild(switchBtn[0]);
    let preLength = 0; //记录之前 的个数

    //发送消息，更改popup.html 的文字
    chrome.runtime.sendMessage({ loaded: true }, function (res) {
        console.log(res);
    });
    console.log('loaded');

    //监听点击事件 ，，改变 主题
    switchBtn.on('click', function () {
        const divs = $('div');
        preLength = divs.length;
        const navs = $('nav');
        const sections = $('section'); // section 用的少
        const uls = $('ul');
        const tds = $('td');
        console.log(divs.length);
        if (mode === 'day') {
            divs.addClass('dark-mode');
            navs.addClass('dark-mode');
            sections.addClass('dark-mode');
            uls.addClass('dark-mode');
            tds.addClass('dark-mode');
            switchBtn.html('夜间').removeClass('dark-mode');
            mode = 'night';
        } else {
            divs.removeClass('dark-mode');
            navs.removeClass('dark-mode');
            sections.removeClass('dark-mode');
            uls.removeClass('dark-mode');
            tds.removeClass('dark-mode');
            switchBtn.html('日间').removeClass('dark-mode');
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
            console.log(isAuto);
            if (isAuto && colorSchemeQuery.matches) {
                //如果选择了是并且系统 已经开启了 暗黑模式
                const divs = $('div');
                preLength = divs.length;
                const navs = $('nav');
                const sections = $('section'); // section 用的少
                const uls = $('ul');
                console.log(divs.length);
                divs.addClass('dark-mode');
                navs.addClass('dark-mode');
                sections.addClass('dark-mode');
                uls.addClass('dark-mode');
                switchBtn.html('夜间').removeClass('dark-mode');
                mode = 'night';
            }
        });
    } else {
        console.log('当前浏览器不支持跟随系统暗黑模式');
        //更改 扩展的全局数据
        chrome.storage.sync.set({ isSupported: false });
    }
    //由于 background.js 背景页的环境只有一个，所有的 content共享一个backround
    //绑定标签页切换事件处理函数，重置 扩展的全局属性loaded
    document.addEventListener('visibilitychange', () => {});
});

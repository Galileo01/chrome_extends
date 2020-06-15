const input = document.querySelector('.isAuto');

const label = document.querySelector('.label');
let _isSupported = true;

input.addEventListener('click', () => {
    if (_isSupported) chrome.storage.sync.set({ isAuto: input.checked });
});

//每次打开popup.html，取出 全局的扩展数据，保持最新
chrome.storage.sync.get('isAuto', function ({ isAuto }) {
    input.checked = isAuto;
});

//判断isSupported ,检测浏览器是否支持 媒体查询
chrome.storage.sync.get('isSupported', function ({ isSupported }) {
    if (!isSupported) {
        _isSupported = isSupported;
        label.innerHTML = '识别系统暗黑模式(当前浏览器不支持)';
        label.classList.add('red');
    }
});

//接受来自 content 的消息，改变loadText
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request, sender, sendResponse);

    if (request.loaded) {
        //来自 content的 页面加载完毕的信息
        loadText.innerHTML = '页面加载完毕';
        loadText.classList.remove('loading');
        loadText.classList.add('load-finish');
    }
    sendResponse('popup received'); //必须回复 消息，不然 此消息通道就会 关闭
});

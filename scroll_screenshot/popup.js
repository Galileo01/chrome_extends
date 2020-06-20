const scrollshotBtn = document.querySelector('.scrollshot');
const fullshowBtn = document.querySelector('.fullshot');
const cancelBtn = document.querySelector('.cancel');

scrollshotBtn.addEventListener('click', () => {
    //向当前  活动标签 发送 消息，进行滚动截屏
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { act: 'scrollshot' }, (res) => {
            console.log(res.res);
        });
    });
});

//截取全屏
fullshowBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { act: 'fullshot' }, (res) => {
            console.log(res.res);
        });
    });
});

//取消截屏，隐藏 遮罩层
cancelBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { act: 'cancel' }, (res) => {
            console.log(res.res);
        });
    });
});

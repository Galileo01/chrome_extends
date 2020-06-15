//设置 扩展 的全局变量
chrome.storage.sync.set({ isAuto: false });
chrome.storage.sync.set({ loaded: false });
chrome.storage.sync.set({ isSupported: true });
//接受 扩展内 其他页面的  消息发送
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request, sender);
    if (request.loaded) {
        //来自 content的 页面加载完毕的信息
        chrome.storage.sync.set({ loaded: true });
    }
    sendResponse('background received'); //必须回复 消息，不然 此消息通道就会 关闭
});

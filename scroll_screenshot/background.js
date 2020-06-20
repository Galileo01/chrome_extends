var capture = {
    canvas: document.createElement('canvas'),
    yPos: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    tabId: 0,
    isInitial: false, //标记是否已经 初始化，每次截完屏重置
    preOffsetY: 0,
    //通知页面进行滚动
    scrollPage(y) {
        const self = this;
        chrome.tabs.sendMessage(
            self.tabId,
            { act: 'scrollPage', y },
            self.onScrollDone
        );
    },
    //滚动完成后，进行看可视区域的 捕获
    onScrollDone(resMsg) {
        // console.log('onScrollDone', resMsg.res);
        setTimeout(function () {
            capture.captureVisibleBlock(resMsg.pageOffsetY);
        }, 500);
    },
    //开始捕获
    startCapture() {
        this.yPos = 0;
        this.scrollPage(-1 * this.scrollHeight);
    },
    //保存页面 尺寸
    onResponseVisibleSize(pageSize) {
        console.log(pageSize);

        capture.scrollWidth = pageSize.scrollWidth;
        capture.scrollHeight = pageSize.scrollHeight;
        capture.clientWidth = pageSize.clientWidth;
        capture.clientHeight = pageSize.clientHeight;
        capture.canvas.height = pageSize.scrollHeight + 300; // FIXME: chrome  captureVisibleTab 捕获 的视图宽高 和 clientWidth 不一致？？？
        //开始 捕获
        capture.startCapture();
    },
    captureVisibleBlock(pageOffsetY) {
        const self = this;
        const width = self.clientWidth;
        const height = self.clientHeight;
        const scroll = pageOffsetY - capture.preOffsetY; //计算 滚动的距离

        chrome.tabs.captureVisibleTab(null, function (img) {
            var blockImg = new Image();
            var canvas = self.canvas;

            if (
                pageOffsetY + capture.clientHeight + 4 >=
                capture.scrollHeight
            ) {
                blockImg.onload = function () {
                    var ctx = canvas.getContext('2d');
                    var y =
                        capture.clientHeight -
                        (capture.scrollHeight % capture.clientHeight);

                    console.log(
                        'capture.scrollHeight % capture.clientHeight:',
                        capture.scrollHeight % capture.clientHeight,
                        'scroll:',
                        scroll,
                        'y:',
                        y,
                        '  capture.yPos :',
                        capture.yPos,
                        'capture.clientHeight - scroll:',
                        capture.clientHeight - scroll
                    );

                    ctx.drawImage(
                        blockImg,
                        0,
                        capture.yPos - y + 120, // - capture.clientHeight  FIXME: 始终解决不了的 bug
                        blockImg.width,
                        blockImg.height
                    );

                    capture.saveImg();
                    capture.isInitial = false; //重置标记
                    //发送消息，通知 content 截取完成
                    chrome.tabs.sendMessage(
                        self.tabId,
                        { act: 'finish shot' },
                        (res) => res
                    );
                };
            } else {
                blockImg.onload = function () {
                    var ctx = canvas.getContext('2d');
                    // MARK: 为什么 captureVisibleTab 捕获 的视图宽度和 clientWidth 不一致？？？
                    if (!capture.isInitial) {
                        //初始化canvas的宽度
                        capture.canvas.width = blockImg.width;
                        capture.isInitial = true;
                    }
                    ctx.drawImage(blockImg, 0, capture.yPos);

                    // capture.yPos += capture.clientHeight;
                    console.log(
                        'scroll:',
                        scroll,
                        'yPos:',
                        capture.yPos,
                        'pageOffsetY:',
                        pageOffsetY
                    );
                    console.log('666');
                    // capture.saveImg();

                    if (capture.yPos === 0) {
                        capture.yPos += capture.clientHeight;
                    } else capture.yPos += scroll;

                    capture.preOffsetY = pageOffsetY;
                    capture.scrollPage(capture.clientHeight);
                };
            }

            blockImg.src = img;
        });
    },
    //保存图片
    saveImg() {
        var canvas = capture.canvas;
        const a = document.createElement('a');
        a.download = 'screen.png';
        a.href = canvas.toDataURL('image/jpeg');
        a.click();
        console.log('download img');
    },
};

//接收来自 content 的消息，获取页面尺寸
chrome.runtime.onMessage.addListener(function (
    { type, pageSize },
    sender,
    sendResponse
) {
    if (type === 'shot') {
        //获取当前的标签id
        chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
        ) {
            capture.tabId = tabs[0].id; //
            capture.onResponseVisibleSize(pageSize);
        });
        sendResponse('make a blockImg');
    }
});

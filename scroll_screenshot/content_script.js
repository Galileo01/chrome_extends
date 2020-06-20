const mask = document.createElement('div');
mask.classList.add('screenshot');
const buttonShot = document.createElement('button');
const buttonCan = document.createElement('button');
mask.classList.add('mask');
buttonShot.className = 'primary';
buttonShot.innerText = '开始截取';
buttonCan.innerText = '取消';
buttonCan.className = 'danger';
const clientWidth = window.innerWidth; //获取 窗口的宽度
const windowHeight = getWindowHeight(); //视口高度

//NOTE:获取视口总高度
function getWindowHeight() {
    var windowHeight = 0; //判断文档的 渲染模式
    if (document.compatMode == 'CSS1Compat') {
        //标准模式
        windowHeight = document.documentElement.clientHeight;
    } else {
        //混杂模式
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

let shotObj = {
    isMaskShow: false, //遮罩层是否显示
    preX: 0,
    preY: 0,
};

//MARK:创建 代理对象， 绑定 view层和model 层
shotObj = new Proxy(shotObj, {
    set(target, prop, val) {
        //如果事对 isMaskShow 的更改 马上同步到 试图从上 ，模仿框架思想
        if (prop === 'isMaskShow') {
            if (val) mask.style.display = 'block';
            else mask.style.display = 'none';

            // console.log(val);
        }
        target[prop] = val;
        console.log('set', prop, val);
    },
});

//通过 滚动来选取 需要截取的 部分
const chooseHeight = () => {
    shotObj.isMaskShow = false;
    const pageSize = {
        scrollHeight: window.pageYOffset + windowHeight, //传入 需要截取 的高度
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth,
        clientHeight: windowHeight,
    };
    chrome.runtime.sendMessage(
        {
            type: 'shot', //类型是 截屏
            pageSize,
        },
        (response) => {
            console.log(response);
        }
    );
};

//MARK:事件绑定
//绑定 处理函数，开始截屏
buttonShot.addEventListener('click', chooseHeight);
//绑定 处理函数， 退出 范围的选择，
buttonCan.addEventListener('click', () => (shotObj.isMaskShow = false));

mask.style.display = 'none'; //初始隐藏 遮罩层

mask.append(buttonShot, buttonCan);
document.body.appendChild(mask);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //处理来自 pop 的消息
    if (message.act === 'scrollshot') {
        // 滚动截屏
        sendResponse({ res: 'scrollshoting' });
        shotObj.preX = window.pageXOffset;
        shotObj.preY = window.pageYOffset;
        shotObj.isMaskShow = true;
    } else if (message.act === 'fullshot') {
        //全屏截取
        sendResponse({ res: 'fullshoting' });
        shotObj.preX = window.pageXOffset;
        shotObj.preY = window.pageYOffset;
        const pageSize = {
            scrollHeight: document.documentElement.scrollHeight, //文档 总体高度
            scrollWidth: document.documentElement.scrollWidth, //文档宽度
            clientWidth,
            clientHeight: windowHeight,
        };
        chrome.runtime.sendMessage(
            {
                type: 'shot', //类型是 截屏
                pageSize,
            },
            (response) => {
                console.log(response);
            }
        );
    } else if (message.act === 'cancel') {
        shotObj.isMaskShow = false;
        sendResponse({ res: 'cancel sussuss' });
    }

    //处理来自 background 的消息
    else if (message.act === 'fetchPageSize') {
        const pageSize = {
            scrollHeight: document.documentElement.scrollHeight,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth,
            clientHeight: windowHeight,
        };
        sendResponse(pageSize);
    } else if (message.act === 'scrollPage') {
        window.scrollBy(0, message.y);
        console.log('scroll', message.y, 'in content');
        console.log('pageOffset', window.pageYOffset);

        sendResponse({
            res: ' make a scroll',
            pageOffsetY: window.pageYOffset,
        });
    }

    //截屏完成后页面回到最开始的位置
    else if (message.act === 'finish shot') {
        console.log(shotObj);

        window.scrollTo(shotObj.preX, shotObj.preY);
        sendResponse({});
    }
});

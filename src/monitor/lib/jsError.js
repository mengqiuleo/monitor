// *  本文件监听 js、promise、resource 异常
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'

export function injectJsError() {
  //* 监控js异常 + 监控资源加载异常
  window.addEventListener('error', function(event){ //event:错误事件对象，该对象上有所有相关信息，可以打印出来看一下
    let lastEvent = getLastEvent() //最后一个交互事件
    // lastEvent 这个对象中有一个path属性，path属性值：body div#container div.content input

    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({//*资源加载错误
        kind: 'stability',//稳定性指标
        type: 'error',//resource
        errorType: 'resourceError',
        filename: event.target.src || event.target.href,//加载失败的资源
        tagName: event.target.tagName,//标签名
        timeStamp: formatTime(event.timeStamp),//时间
        selector: getSelector(event.path || event.target),//选择器
      })
    } else { //* js错误
      tracker.send({ //定义日志格式
        kind: 'stability', //监控指标的大类(这里的意思是稳定性指标)
        type: 'error', //小类型 这是一个错误
        errorType: 'jsError', //JS执行错误
        url: '', //访问哪个路径 报错了
        message: event.message, //报错信息
        filename: event.filename, //哪个文件报错了
        position: `${event.lineno}: ${event.colno}`, //报错位置：行列
        stack: getLines(event.error.stack), //报错堆栈，getLines函数处理格式
        selector: lastEvent ? getSelector(lastEvent.path) : '', //代表最后一个操作的元素, 即事件类型('click','pointerdown', 'touchstart', 'mousedown', 'keydown', 'mouseover')
      }) //将 log 发送到 阿里云日志监控
    }
  }, true) //true代表在捕获阶段调用,false代表在冒泡阶段捕获,使用true或false都可以

  //* 捕获 promise 异常: 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
  window.addEventListener('unhandledrejection', function (event) {
    let lastEvent = getLastEvent();
    let message = '';
    let line = 0;
    let column = 0;
    let file = '';
    let stack = '';
    if (typeof event.reason === 'string') {
        message = event.reason;
    } else if (typeof event.reason === 'object') {
        message = event.reason.message;
    }
    let reason = event.reason;
    if (typeof reason === 'object') { //这里又是处理字符串堆栈信息
        if (reason.stack) {
            var matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
            if (matchResult) {
                file = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];
            }
            stack = getLines(reason.stack);
        }
    }
    tracker.send({//未捕获的promise错误
        kind: 'stability',//稳定性指标
        type: 'error',//jsError
        errorType: 'promiseError',//unhandledrejection
        message: message,//标签名
        filename: file,
        position: line + ':' + column,//行列
        stack,
        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
    })
  }, true);// true代表在捕获阶段调用,false代表在冒泡阶段捕获,使用true或false都可以
}

function getLines(stack) {
  if (!stack) {
      return '';
  }
  return stack.split('\n').slice(1).map(item => item.replace(/^\s+at\s+/g, '')).join('^');
}
//上报当前错误的IP地址, 发送给服务器
//我们发送给阿里云的日志服务
// http://${project}.${host}/logstores/${logstore}/track 是固定的上报路径

let host = 'cn-beijing.log.aliyuncs.com'; //主机名
let project = 'zhufengmonitor'; //项目名
let logstore = 'zhufengmonitor-store'; //存储名
var userAgent = require('user-agent')
function getExtraData() { //传递一些额外的无关紧要的数据
  return {
    title: document.title,
    url: location.url,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name //用户信息：比如浏览器版本，电脑版本
  };
}

class SendTracker {
  constructor(){
    this.url = `http://${project}.${host}/logstores/${logstore}/track` //上报的路径
    this.xhr = new XMLHttpRequest()
  }
  send(data = {},  callback){
    let extraData = getExtraData()
    let log = {...extraData, ...data}
    for (let key in log) { //阿里云的要求：传递的日志对象的key不能是一个数字
      if (typeof log[key] === 'number') {
          log[key] = "" + log[key];
      }
    }
    this.xhr.open('POST', this.url, true)
    let body = JSON.stringify({
        __logs__: [log]
    });
    //这些 请求头都是要求按规定写的，阿里云日志监控规定的
    this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);
    this.xhr.onload = function () {
      if ((this.status >= 200 && this.status <= 300) || this.status == 304) {
          callback && callback();
      }
    }
    this.xhr.onerror = function (error) {
      console.log('error', error);
    }
    this.xhr.send(body)
  }
}

export default new SendTracker()
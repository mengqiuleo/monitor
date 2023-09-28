//* 监控接口错误
import tracker from '../utils/tracker'
export function injectXHR(){
  let XMLHttpRequest = window.XMLHttpRequest
  let oldOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, async){
    if (!url.match(/logstores/) && !url.match(/sockjs/)) { //这里是处理：不对阿里云的日志系统监控
      this.logData = {
        method, url, async
      }
    }
    return oldOpen.apply(this, arguments)
  }
  let oldSend = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function(body){
    if(this.logData){
      let startTime = Date.now()
      let handler = (type) => (event) => {
        let duration = Date.now() - startTime //持续时间
        let status = this.status;
        let statusText = this.statusText;
        tracker.send({//未捕获的promise错误
          kind: 'stability',//稳定性指标
          type: 'xhr',//xhr
          eventType: type,//load error abort
          pathname: this.logData.url,//接口的url地址
          status: status + "-" + statusText,
          duration: "" + duration,//接口耗时
          response: this.response ? JSON.stringify(this.response) : "",
          params: body || ''
        })
      }
      this.addEventListener('load', handler('load'), false);
      this.addEventListener('error', handler('error'), false);
      this.addEventListener('abort', handler('abort'), false);
    }
    return oldSend.apply(this, arguments)
  }
}
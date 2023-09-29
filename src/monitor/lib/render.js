//* 监控渲染时间(FCP,LCP,FMP...)

import onload from "../utils/onload";
import tracker from "../utils/tracker";

/**
 * PerformanceObserver.observe方法用于观察传入的参数中指定的性能条目类型的集合。
 * 当记录一个指定类型的性能条目时，性能监测对象的回调函数将会被调用
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/observe
 */
export function timing() {
  let FMP, LCP;
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect();
  }).observe({ entryTypes: ["element"] });

  new PerformanceObserver((entryList, observer) => {
    const perfEntries = entryList.getEntries();
    const lastEntry = perfEntries[perfEntries.length - 1];
    LCP = lastEntry;
    observer.disconnect();
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  onload(function () {
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
      } = performance.timing;
      tracker.send({
        kind: "experience",
        type: "timing",
        connectTime: connectEnd - connectStart, //TCP连接耗时
        ttfbTime: responseStart - requestStart, //ttfb
        responseTime: responseEnd - responseStart, //Response响应耗时
        parseDOMTime: loadEventStart - domLoading, //DOM解析渲染耗时
        domContentLoadedTime:
          domContentLoadedEventEnd - domContentLoadedEventStart, //DOMContentLoaded事件回调耗时
        timeToInteractive: domInteractive - fetchStart, //首次可交互时间
        loadTime: loadEventStart - fetchStart, //完整的加载时间
      });
    }, 3000);
  });
}

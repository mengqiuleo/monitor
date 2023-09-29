//* 监控加载时间

import onload from '../utils/onload';
import tracker from '../utils/tracker';

export function timing() {
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
                loadEventStart } = performance.timing;
            tracker.send({
                kind: 'experience',
                type: 'timing',
                connectTime: connectEnd - connectStart,//TCP连接耗时
                ttfbTime: responseStart - requestStart,//ttfb
                responseTime: responseEnd - responseStart,//Response响应耗时
                parseDOMTime: loadEventStart - domLoading,//DOM解析渲染耗时
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,//DOMContentLoaded事件回调耗时
                timeToInteractive: domInteractive - fetchStart,//首次可交互时间
                loadTime: loadEventStart - fetchStart//完整的加载时间
            });

        }, 3000);
    });
}
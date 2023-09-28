// * 专门控制触发白屏监控的时间点
export default function (callback) {
  if (document.readyState === 'complete') {
      callback();
  } else {
      window.addEventListener('load', callback);
  }
};

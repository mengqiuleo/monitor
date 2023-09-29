//* 监控白屏错误
import tracker from '../utils/tracker'
import onload from '../utils/onload';
/**
 * elementsFromPoint方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素
 * var elements = document.elementsFromPoint(x, y);
 * 返回一个包含 element 对象的数组。
 */
function getSelector(element) {
  var selector;
  if (element.id) {
      selector = `#${element.id}`;
  } else if (element.className && typeof element.className === 'string') {
      selector = '.' + element.className.split(' ').filter(function (item) { return !!item }).join('.');
  } else {
      selector = element.nodeName.toLowerCase();
  }
  return selector;
}
export function blankScreen() {
  const wrapperSelectors = ['body', 'html', '#container', '.content']; //如果通过elementsFromPoint获得的元素是这些，说明是没用的元素
  let emptyPoints = 0;
  function isWrapper(element) {
      let selector = getSelector(element);
      if (wrapperSelectors.indexOf(selector) >= 0) {
          emptyPoints++;
      }
  }
  onload(function () {
      let xElements, yElements;

      for (let i = 1; i <= 9; i++) {
          xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
          yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
          isWrapper(xElements[0]);
          isWrapper(yElements[0]);
      }
      if (emptyPoints >= 0) { //出现空白点emptyPoints，证明为白屏
          let centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
          tracker.send({
              kind: 'stability',
              type: 'blank',
              emptyPoints: "" + emptyPoints,
              screen: window.screen.width + "x" + window.screen.height,
              viewPoint: window.innerWidth + 'x' + window.innerHeight,
              selector: getSelector(centerElements[0]),
          })
      }
  });
}
//screen.width  屏幕的宽度   screen.height 屏幕的高度
//window.innerWidth 去除工具条与滚动条的窗口宽度 window.innerHeight 去除工具条与滚动条的窗口高度
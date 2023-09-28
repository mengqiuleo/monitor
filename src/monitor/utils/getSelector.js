function getSelector(path){
  return path.reverse().filter(function (element) {
    return element !== window && element !== document;
  }).map(function (element) {
    var selector;
    if (element.id) {
        selector = `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
        selector = '.' + element.className.split(' ').filter(function (item) { return !!item }).join('.');
    } else {
        selector = element.nodeName;
    }
    return selector;
  }).join(' ');
}

export default function (path){
  if(Array.isArray(path)){
    return getSelector(path)
  } else {
    var paths = [];
    var element = path;
    while (element) {
      paths.push(element);
      element = element.parentNode;
    }
    return getSelector(paths);
  }
}
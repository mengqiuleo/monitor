//* 该文件夹实现对错误的监控
import { injectJsError } from './lib/jsError';
import { injectXHR } from './lib/xhr'
injectJsError();
injectXHR() //接口异常
/**
 * 接口异常如何监听的：我们发送请求使用xhr,我们重写了xhr的open和send方法
 */
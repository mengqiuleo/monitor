//* 该文件夹实现对错误的监控
import { injectJsError } from './lib/jsError';
import { injectXHR } from './lib/xhr'
import { blankScreen } from './lib/blankSCreen'
import { timing } from '../monitor/lib/timing '
timing()
// injectJsError();
// injectXHR() //接口异常
// blankScreen() //监控白屏不能往这写：因为这个脚本最后会插在头部，那是页面肯定是白的
/**
 * 接口异常如何监听的：我们发送请求使用xhr,我们重写了xhr的open和send方法
 */
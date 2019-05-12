// 异步串行
const {AsyncSeriesWaterfallHook} = require('tapable');

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(['name'])
    };
  }

  tap() {
    this.hooks.arch.tapAsync('node', (name, cb) => {
      setTimeout(() => {
        console.log('node tapAsync: ', name);
        // 如果回调的第一个参数是 null 或者 cb 的参数为空，表示没有错误
        // 第二个参数是传递给下边的数据
        // 如果回调的第一个参数不是 null，参数可以为错误信息
        cb(null, 'node data');
      }, 1000);
    });
    this.hooks.arch.tapAsync('react', (data, cb) => {
      setTimeout(() => {
        console.log('react tapAsync: ', data);
        cb();
      }, 1000);
    });
    this.hooks.arch.tapAsync('typescript', (data, cb) => {
      setTimeout(() => {
        console.log('typescript tapAsync: ', data);
        cb();
      }, 1000);
    });
  }

  start() {
    this.hooks.arch.callAsync('mark', function () {
      console.log('end');
    });
  }

}

let l = new Lesson();
l.tap();
l.start();


let {SyncWaterfallHook} = require('tapable');

// SyncWaterfallHook 可以在下一个方法中获取到上一个方法的返回值
class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(['name', 'age'])
    };
  }

  tap() {
    this.hooks.arch.tap('node', (name, age) => {
      console.log('node tap: ', name, age);
      return ['node 学习的还不错', name, age];
    });
    // 这里的参数就是上一个方法的返回值
    this.hooks.arch.tap('react', ([data, name, age]) => {
      console.log('react tap: ', data, name, age);
    });
  }

  start() {
    this.hooks.arch.call('mark', 18);
  }

}

let l = new Lesson();
l.tap();
l.start();

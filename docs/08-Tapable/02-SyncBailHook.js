let {SyncBailHook} = require('tapable');

// 如果某一个事件我们没有达到我们的预期，可以通过 return 停止
class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncBailHook(['name', 'age'])
    };
  }

  tap() {
    this.hooks.arch.tap('node', (name, age) => {
      console.log('node tap: ', name, age);
      // return '学习困难，想要停止';
      return undefined;
    });
    this.hooks.arch.tap('react', (name, age) => {
      console.log('react tap: ', name, age);
    });
  }

  start() {
    this.hooks.arch.call('mark', 18);
  }

}

let l = new Lesson();
l.tap();
l.start();

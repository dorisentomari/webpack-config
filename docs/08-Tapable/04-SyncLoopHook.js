let {SyncLoopHook} = require('tapable');

// SyncLoopHook 遇到某个不返回 undefined 的函数会多次执行
class Lesson {
  constructor() {
    this.index = 0;
    this.hooks = {
      arch: new SyncLoopHook(['name', 'age'])
    };
  }

  tap() {
    this.hooks.arch.tap('node', (name, age) => {
      console.log('node tap: ', name, age);
      return ++this.index === 3 ? undefined : '继续执行';
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

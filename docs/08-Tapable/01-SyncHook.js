let {SyncHook} = require('tapable');

class Lesson {
  constructor() {
    this.hooks = {
      // 这里的参数是为了和后边注册时的参数对应起来
      // 如果只有一个参数，那么参数名就可以随意填写
      // 但是尽量与调用时对应起来，这样读起来更方便
      arch: new SyncHook(['name', 'age'])
    };
  }

  // 注册监听函数
  tap() {
    this.hooks.arch.tap('node', (name, age) => {
      console.log('node tap: ', name, age);
    });
    this.hooks.arch.tap('react', (name, age) => {
      console.log('react tap: ', name, age);
    });
  }

  // 启动
  start() {
    // 原理就是，注册的时候先把 node 和 react 事件注册
    // 等到启动的时候，就会依次执行注册好的方法
    this.hooks.arch.call('mark', 18);
  }

}

let l = new Lesson();
// 注册
l.tap();
// 启动
l.start();

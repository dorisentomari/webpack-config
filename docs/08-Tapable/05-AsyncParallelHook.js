const {AsyncParallelHook} = require('tapable');

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name'])
    };
  }

  tap() {
    this.hooks.arch.tapAsync('node', (name, cb) => {
      setTimeout(() => {
        console.log('node tapAsync: ', name);
        cb();
      }, 1000);
    });
    this.hooks.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react tapAsync: ', name);
        cb();
      }, 1000);
    });
  }

  start() {
    this.hooks.arch.callAsync('mark', function (res) {
      console.log('end');
    });
  }

}

let l = new Lesson();
l.tap();
l.start();

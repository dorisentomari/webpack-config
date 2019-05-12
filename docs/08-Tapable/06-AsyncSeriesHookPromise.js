// 异步串行
const {AsyncSeriesHook} = require('tapable');

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(['name'])
    };
  }

  tap() {
    this.hooks.arch.tapPromise('node', (name) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('node tapAsync: ', name);
          resolve();
        }, 1000);
      });
    });
    this.hooks.arch.tapPromise('react', (name) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('react tapAsync: ', name);
          resolve();
        }, 1000);
      });
    });
  }

  start() {
    this.hooks.arch.promise('mark').then(function () {
      console.log('end');
    });
  }

}

let l = new Lesson();
l.tap();
l.start();

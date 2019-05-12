const {AsyncParallelHook} = require('tapable');

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name'])
    };
  }

  tap() {
    this.hooks.arch.tapPromise('node', (name, cb) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('node hook: ', name);
          resolve();
        }, 1000);
      });
    });
    this.hooks.arch.tapPromise('react', (name, cb) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('react hook: ', name);
          resolve();
        }, 1000);
      });
    });
  }

  start() {
    this.hooks.arch.promise('mark').then(res => {
      console.log('end');
    });
  }

}

let l = new Lesson();
l.tap();
l.start();

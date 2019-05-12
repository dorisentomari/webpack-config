class AsyncSeriesHook {

  constructor() {
    this.tasks = [];
  }

  tapAsync(eventName, task) {
    this.tasks.push(task);
  }

  callAsync(...args) {
    let index = 0;
    let finalCallback = args.pop();
    let next = () => {
      if (this.tasks.length === index) {
        return finalCallback();
      }
      let task = this.tasks[index++];
      task(...args, next);
    };
    next();
  }

}

let hook = new AsyncSeriesHook(['name']);

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node hook: ', name);
    cb();
  }, 1000);
});

hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    console.log('react hook: ', name);
    cb();
  }, 1000);
});

hook.callAsync('mark', () => {
  console.log('end');
});


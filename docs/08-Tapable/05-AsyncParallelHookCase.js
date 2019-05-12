class AsyncParallelHook {

  constructor() {
    this.tasks = [];
  }

  tapAsync(eventName, task) {
    this.tasks.push(task);
  }

  callAsync(...args) {
    let finalCallback = args.pop();

    let index = 0;

    let done = () => {
      index++;
      if (index === this.tasks.length) {
        finalCallback();
      }
    };

    this.tasks.forEach(task => {
      task(...args, done);
    });

  }

}

let hook = new AsyncParallelHook(['name']);

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


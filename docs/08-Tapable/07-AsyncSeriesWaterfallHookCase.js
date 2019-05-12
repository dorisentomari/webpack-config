// AsyncSeriesWaterfallHookCase


class AsyncSeriesWaterfallHookCase {

  constructor() {
    this.tasks = [];
  }

  tapAsync(eventName, task) {
    this.tasks.push(task);
  }

  callAsync(...args) {
    let index = 0;
    let finalCallback = args.pop();
    let next = (error, data) => {
      let task = this.tasks[index];
      if (!task) {
        return finalCallback();
      }
      if (index === 0) {
        task(...args, next);
      } else {
        task(data, next);
      }
      index++;
    };
    next();
  }

}

let hook = new AsyncSeriesWaterfallHookCase(['name']);

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node hook: ', name);
    cb(null, 'node data');
  }, 1000);
});

hook.tapAsync('react', (data, cb) => {
  setTimeout(() => {
    console.log('react hook: ', data);
    cb(null, data);
  }, 1000);
});

hook.tapAsync('typescript', (data, cb) => {
  setTimeout(() => {
    console.log('typescript hook: ', data);
    cb();
  }, 1000);
});

hook.callAsync('mark', () => {
  console.log('end');
});


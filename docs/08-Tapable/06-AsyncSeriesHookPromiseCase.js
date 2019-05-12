class AsyncSeriesHook {

  constructor() {
    this.tasks = [];
  }

  tapPromise(eventName, task) {
    this.tasks.push(task);
  }

  promise(...args) {
    let [first, ...others] = this.tasks;
    let ret = first(...args);
    return others.reduce((prev, curr) => {
      return prev.then(() => curr(...args));
    }, ret);
  }

}

let hook = new AsyncSeriesHook(['name']);

hook.tapPromise('node', (name) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('node hook: ', name);
      resolve();
    }, 1000);
  });
});

hook.tapPromise('react', (name) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('react hook: ', name);
      resolve();
    }, 1000);
  });
});

hook.promise('mark').then(() => {
  console.log('end');
});


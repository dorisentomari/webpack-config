class AsyncParallelHook {

  constructor() {
    this.tasks = [];
  }

  tapPromise(eventName, task) {
    this.tasks.push(task);
  }

  promise(...args) {
    let tasks = this.tasks.map(task => task(...args));
    return Promise.all(tasks);
  }
}

let hook = new AsyncParallelHook(['name']);

hook.tapPromise('node', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('node hook: ', name);
      resolve();
    }, 1000);
  });
});

hook.tapPromise('react', (name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('react hook: ', name);
      resolve();
    }, 1000);
  });
});

hook.promise('mark').then(() => {
  console.log('end');
});


// AsyncParallelBailHook，调用了 reject 就不再往后执行，带保险的异步并发钩子

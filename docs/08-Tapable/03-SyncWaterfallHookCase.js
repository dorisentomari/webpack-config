class SyncWaterfallHook {

  constructor() {
    this.tasks = [];
  }

  tap(eventName, task) {
    this.tasks.push(task);
  }

  call(...args) {
    let [first, ...others] = this.tasks;

    let ret = first(...args);

    // 上一个函数的返回值，就是下一个函数的参数
    // 就是说， ret 是第一个函数的返回值，那么就是第二个函数，就是 curr 的参数
    others.reduce((prev, curr) => {
      return curr(prev);
    }, ret);

  }

}

let hook = new SyncWaterfallHook(['name', 'age']);

hook.tap('node', (name, age) => {
  console.log('node hook: ', name, age);
  return ['node 学习的还不错', name, age];
});

hook.tap('react', ([data, name, age]) => {
  console.log('react hook: ', data, name, age);
  return ['react 有一些困难', name, age];
});

hook.tap('typescript', ([data, name, age]) => {
  console.log('typescript hook: ', data, name, age);
});

hook.call('mark', 18);


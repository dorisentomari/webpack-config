class SyncLoopHook {

  constructor() {
    this.tasks = [];
  }

  tap(eventName, task) {
    this.tasks.push(task);
  }

  call(...args) {
    this.tasks.forEach(task => {
      let ret;
      do {
        ret = task(...args);
      } while(ret !== undefined);
    });

  }
}

let hook = new SyncLoopHook(['name', 'age']);

let total = 0;

hook.tap('node', (name, age) => {
  console.log('node hook: ', name, age);
  return ++total === 3 ? undefined : 'node 学习的还不错';
});

hook.tap('react', data => {
  console.log('react hook: ', data);
});

hook.tap('typescript', data => {
  console.log('typescript hook: ', data);
});

hook.call('mark', 18);


class SyncHook {

  constructor() {
    this.tasks = [];
  }

  tap(eventName, task) {
    this.tasks.push(task);
  }

  call(...args) {
    this.tasks.forEach(task => task(...args));
  }

}

let hook = new SyncHook(['name', 'age']);

hook.tap('node', (name, age) => {
  console.log('node hook: ', name, age);
});

hook.tap('react', (name, age) => {
  console.log('react hook: ', name, age);
});

hook.call('mark', 18);


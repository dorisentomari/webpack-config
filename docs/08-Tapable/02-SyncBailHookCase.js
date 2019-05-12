class SyncBailHook {

  constructor() {
    this.tasks = [];
  }

  tap(eventName, task) {
    this.tasks.push(task);
  }

  call(...args) {
    // 表示当前函数的返回值
    let ret;
    // 表示先执行第一个
    let index = 0;
    do {
      ret = this.tasks[index++](...args);
      console.log('index: ', index);
    } while(ret === undefined && index < this.tasks.length);
  }

}

let hook = new SyncBailHook(['name', 'age']);

hook.tap('node', (name, age) => {
  console.log('node hook: ', name, age);
  return '学习困难，想要停止';
});

hook.tap('react', (name, age) => {
  console.log('react hook: ', name, age);
});

hook.call('mark', 18);


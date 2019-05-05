class Log {
  constructor() {
    console.log('log');
    console.log(new Error('this is error'));
  }
}

let log = new Log();

class AsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('AsyncPlugin', (compilation, cb) => {
      setTimeout(() => {
        console.log('tapAsync 文件发射，等待 2 秒');
        cb();
      }, 2000);
    });
    compiler.hooks.emit.tapPromise('AsyncPlugin', (compilation) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('tapPromise 文件发射，等待 2 秒');
          resolve();
        }, 2000);
      });
    });
  }
}

module.exports = AsyncPlugin;

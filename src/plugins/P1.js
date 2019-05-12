class P1 {
  apply(compiler) {
    console.log('P1 start');
    compiler.hooks.afterPlugins.tap('emit', () => {
      console.log('P1 emit event');
    });
  }
}

module.exports = P1;

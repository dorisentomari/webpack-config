class P {
  apply(compiler) {
    console.log('P start');
    compiler.hooks.emit.tap('emit', () => {
      console.log('P emit event');
    });
  }
}

module.exports = P;

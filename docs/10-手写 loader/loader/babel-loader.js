const babel = require('@babel/core');
const loaderUtils = require('loader-utils');

function loader(source) {
  console.log(Object.keys(this));
  // 这个 options 就是 webpack 配置里的 options
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop(),
  }, (err, result) => {
    console.log(JSON.stringify(result));
    cb(err, result.code, result.map);
  });
  return source;
}

module.exports = loader;

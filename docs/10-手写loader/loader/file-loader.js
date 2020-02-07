let loaderUtils = require('loader-utils');
// 根据图片生成一个 md5，存在 dist 目录下，还会返回当前的路径

function loader(source) {
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source});
  this.emitFile(filename, source);
  // file-loader 需要返回一个路径
  return `module.exports = '${filename}'`;
}

loader.raw = true;

module.exports = loader;


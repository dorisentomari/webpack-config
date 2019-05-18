const fs = require('fs');
let loaderUtils = require('loader-utils');
let validateOptions = require('schema-utils');

function loader(source) {
  // 使用缓存
  this.cacheable && this.cacheable();
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  let schame = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  };
  validateOptions(schame, options, 'banner-loader');
  if (options.filename) {
    // 自动添加文件依赖
    this.addDependency(options.filename);
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`);
    });
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
  return source;
}

module.exports = loader;

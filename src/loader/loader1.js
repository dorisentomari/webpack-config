const loaderUtils = require('loader-utils');

function loader(source) {
  let options = loaderUtils.getOptions(this);
  console.log(options);
  return source;
}

// loader.pitch = function () {
//   console.log('loader1 pitch');
// };
//
// loader.normal = function () {
//   console.log('loader1 normal');
// };

module.exports = loader;


/*
* loader 有一个 pitch 和 normal 两部分
* 首先是 pitch loader3,loader2,loader1
* 然后 normal 阶段
* pitch 阶段依次执行，如果 loader2 的 pitch 有返回值，那么 loader1 将不再在执行，直接返回 normal 的 loader2
* 每一个 loader 只做一件事，方便在不同的场景链式调用
* 每一个 loader 都是一个模块
* loader 必须是无状态的，确保 loader 在不同的模块下不保存状态
* */

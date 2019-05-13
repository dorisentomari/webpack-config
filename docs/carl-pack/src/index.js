/**
 * 找到当前执行名的路径，拿到 webpack.config.js
 */

const path = require('path');

const Compiler = require('./lib/Compiler');

// config 是我们的配置文件
let config = require(path.resolve('webpack.config.js'));

let compiler = new Compiler(config);

compiler.hooks.entryOption.call();

// 标识运行编译代码
compiler.run();

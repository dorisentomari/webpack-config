const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  // source-map，源码映射，单独生成一份soucemap 文件，出错后，会标识出错误的列和行，特点是大而全
  // eval-soure-map，不会产生单独的文件，但是会显示行和列
  // cheap-module-source-map，不会产生列，是一个单独的映射文件，可以保留用来调试
  // cheap-module-eval-source-map 不会产生文件，会集成在打包后的文件里，不会产生行和列
  devtool: 'source-map',
  watch: true,
  // 监控的属性
  watchOptions: {
    // 每秒监控 1000 次，是否需要打包
    poll: 1000,
    // 防抖，500ms 内输入的内容只打包一次，500ms 后没有再输入内容，开始打包
    aggregateTimeout: 500,
    // 不需要进行监控的目录
    ignored:  /node_modules/
  },
  devServer: {
    host: 'localhost',
    port: 8757,
    progress: false,
    contentBase: './dist',
    compress: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

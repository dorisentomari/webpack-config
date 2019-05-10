const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    // 扩展名
    extensions: ['.js', '.css', '.json'],
    // 入口文件的名字
    // mainFiles: [],
    // 入口的字段，从包的 package.json 里查找
    mainFields: ['style', 'main'],
    // 配置别名
    alias: {
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  }
};

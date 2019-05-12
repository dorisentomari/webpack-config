const path = require('path');
const Webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    // 打包后的文件名
    filename: '[name]_dll.js',
    path: path.resolve(__dirname, 'dist'),
    // 指定打包后的模块最终返回的值用哪个变量接收
    library: '_dll_[name]',
    // 打包时采用的模块的方式，默认是 var
    libraryTarget: 'window'
  },
  plugins: [
    new Webpack.DllPlugin({
      // 这个 name 需要和 library 的值相同
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve('src'),
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};

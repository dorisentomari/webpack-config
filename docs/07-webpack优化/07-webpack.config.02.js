const path = require('path');

const Webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
const AddAssetPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    // 让 webpack 打包的时候，检查一下 manifest.json 里的包是否已经打包过
    // 如果打包过，那么就不再打包，直接使用
    new Webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname, 'dist', 'manifest.json'))
    }),
    // 添加资源插件，把打包好的 dll 文件引入到 HTML 页面中
    // 这个插件的顺序必须是在 HTMLPlugin 之后
    new AddAssetPlugin({
      filepath: path.resolve(__dirname, 'dist', 'react.dll.js')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve('src'),
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};

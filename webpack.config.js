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
  devServer: {
    // 代理跨域
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {'^/api' : ''}
    //   }
    // },
    // 前端模拟数据
    before (app) {
      app.get('/user', (req, res) => {
        res.json({name: 'carl'});
      });
    },
    // 有服务端，不想用代理，在服务端开启服务，端口用服务端的端口

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

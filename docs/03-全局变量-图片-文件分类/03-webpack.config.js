const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
// 抽离所有的 css 代码，生成 css 文件
const MiniCSSExtraPlugin = require('mini-css-extract-plugin');
// 优化打包的 css 代码
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 优化打包后的 JS 代码
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.[hash:8].js",
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    host: 'localhost',
    port: 8757,
    progress: false,
    contentBase: './dist',
    compress: true
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'eslint-loader',
      //     options: {
      //       enforce: 'pre'
      //     }
      //   },
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpeg|jpg|png|gif|bmp)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 2 * 1024,
            outputPath: 'img/',
            publicPath: 'http://www.static.yourdomain.com/static/'
          }
        }
      },
      {
        test: /\.html$/,
        loader: ['html-withimg-loader']
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: './src/index.html',
      filename: 'index.html',
      title: 'webpack 打包的模板',
    }),
    new MiniCSSExtraPlugin({
      filename: 'css/main.css'
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  }
};

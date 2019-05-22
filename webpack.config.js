const path = require('path');
// const DonePlugin = require('./src/plugins/DonePlugin');
// const AsyncPlugin = require('./src/plugins/AsyncPlugin');
const FileListPlugin = require('./src/plugins/FileListPlugin');
const InlineSourcePlugin = require('./src/plugins/InlineSourcePlugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const UploadQiniuPlugin = require('./src/plugins/UploadQiniuPlugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'main.css'
    }),
    new HTMLPlugin({
      template: './public/index.html'
    })
  ]
};

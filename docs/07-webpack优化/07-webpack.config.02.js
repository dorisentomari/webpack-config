const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new Webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname, 'dist', 'manifest.json'))
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

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
    new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    noParse: /jquery/,
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

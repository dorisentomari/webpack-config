const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');

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
    new HappyPack({
      id: 'js',
      use: ['babel-loader']
    })
  ],
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve('src'),
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    contentBase: './dist'
  }
};

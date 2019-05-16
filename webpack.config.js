const path = require('path');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  resolveLoader: {
    // alias: {
    //   loader1: path.resolve(__dirname, './src/loaders', 'loader1.js')
    // },
    modules: ['node_modules', path.resolve(__dirname, './src/loaders')]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        // use: {
        //   loader: 'loader1',
        //   options: {
        //     name: 'mark'
        //   }
        // }
        // loader 顺序, pre, normal, inline, post
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

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
    modules: ['node_modules', path.resolve(__dirname, './src/loader')]
  },
  devtool: 'source-map',
  // watch: true,
  module: {
    rules: [
      // {
      //   test: /\.js$/,
        // use: {
        //   loader: 'loader1',
        //   options: {
        //     name: 'mark'
        //   }
        // }
        // loader 顺序, pre, normal, inline, post
        // use: {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['@babel/preset-env']
        //   }
        // }
      // }
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: 'banner-loader',
      //     options: {
      //       text: 'hello, banner-loader',
      //       filename: path.resolve(__dirname, 'src/banner-template.txt')
      //     }
      //   }
      // },
      {
        test: /\.jpg$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024
          }
        }
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
        // use: 'less-loader'
      }
    ]
  }
};

const path = require('path');
const P = require('./src/plugins/P');
const P1 = require('./src/plugins/P1');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, './src/loader', 'style-loader.js'),
          path.resolve(__dirname, './src/loader', 'less-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new P(),
    new P1()
  ]
};

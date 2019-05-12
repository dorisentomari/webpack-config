const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const Webpack = require('webpack');

// 压缩代码等
module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new Webpack.DefinePlugin({
      DEV: `'prod'`,
      FLAG: `'true'`,
      EXPRESSION: `1 + 1`
    })
  ],
});

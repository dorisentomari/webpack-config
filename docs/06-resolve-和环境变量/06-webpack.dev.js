const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const Webpack = require('webpack');

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new Webpack.DefinePlugin({
      DEV: `'dev'`,
      FLAG: `'true'`,
      EXPRESSION: `1 + 1`
    })
  ],
});

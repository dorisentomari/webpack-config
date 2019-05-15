const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.[hash:8].js",
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    // 指定 IP
    host: 'localhost',
    // 指定服务的端口
    port: 8757,
    // 是否开启打包时进度条的显示
    progress: true,
    // 指向某个目录为静态服务文件夹
    contentBase: './dist',
    // 是否开启 gzip 压缩
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader',
          'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader',
          'stylus-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top'
            }
          },
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      // 引入的模板的路径
      template: './src/index.html',
      // 生成的 HTML 的文件名
      filename: 'index.html',
      // 生成的 HTML 文件的 title 标签的内容
      title: 'webpack 打包的模板',
      // 在引入的文件后边添加哈希字符串，避免缓存
      hash: true,
      // 压缩
      minify: {
        // 压缩代码，去掉所有的空白
        collapseWhitespace: true,
        // 去掉注释
        removeComments: true,
        // 去掉冗余的属性
        removeRedundantAttributes: true,
        // 如果 script 标签上有 type='text/javascript'，就去掉这个属性
        removeScriptTypeAttributes: true,
        // 如果 link 标签上有 type='text/css'，就去掉这个属性
        removeStyleLinkTypeAttributes: true,
        // 去掉标签上属性值的引号
        removeAttributeQuotes: true
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#4285f4'
      }
    })
  ]
};

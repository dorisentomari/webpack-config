# 1. 删除某个目录

+ 我们每次打包之前，就想要删掉原来打包的目录里的文件，我们可以使用一个插件 `clean-webpack-plugin`，注意版本，不同的版本使用方法是不一样的

+ 直接在 plugins 里添加即可

+ 1.x 使用，`new CleanWebpackPlugin([path.resolve(__dirname, 'dist')])`

+ 2.x 使用 `new CleanWebpackPlugin()`

# 2. 多页面配置

+ 多个页面，就要有多个入口，多个 HTML 模板，同样要有多个出口

+ 我们看一下 webpack 如何配置多个页面

```javascript
module.exports = {
  entry: {
    home: path.resolve(__dirname, 'src/index.js'),
    other: path.resolve(__dirname, 'src/other.js'),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLPlugin({
      template: './src/index.html',
      filename: 'home.html',
      chunks: ['home']
    }),
    new HTMLPlugin({
      template: './src/index.html',
      filename: 'other.html',
      chunks: ['other']
    })
  ]
}
```

+ 解释一下
  + 多个 js 入口，entry 需要为一个对象，不同的 key 对应不同的代码 chunk，注意不是页面
  + 多个 js 出口，出口就不能写死，需要使用变量的形式，使用 `[name].js`，这里的 name 对应入口里的 key
  + 因为有多个页面，每个页面可能有不同的模板内容，所以我们使用多个 HTMLPlugin，同时打包出的 HTML 文件名也不能一样，每个页面需要使用到的代码块也不一样，所以需要给每一个页面配置一个 chunks，因为页面可能会需要多个代码块，所以 chunks 是一个数组，每一个元素是入口里的 key，这里需要一一对应，不然是不生效的

# 3. source-map

+ source-map 的作用是为了映射源码，因为 webpack 会把源码进行编译打包，最后生成的代码看起来比较难懂，如果代码报错了，那么我们可以使用 source-map 进行映射到源码， 查看具体是哪里报错

```javascript
module.exports = {
  devtools: 'source-map'
}
```

+ devtools 的值可以有多个
  + source-map，源码映射，单独生成一份soucemap 文件，出错后，会标识出错误的列和行，特点是大而全
  + eval-soure-map，不会产生单独的文件，但是会显示行和列
  + cheap-module-source-map，不会产生列，是一个单独的映射文件，可以保留用来调试
  + cheap-module-eval-source-map 不会产生文件，会集成在打包后的文件里，不会产生行和列

# 4. watch 打包监控

+ 我们想要每次修改完代码后都会进行一次打包，所以我们可以进行监控配置

```javascript
module.exports = {
  watch: true,
  // 监控的属性
  watchOptions: {
    // 每秒监控 1000 次，是否需要打包
    poll: 1000,
    // 防抖，500ms 内输入的内容只打包一次，500ms 后没有再输入内容，开始打包
    aggregateTimeout: 500,
    // 不需要进行监控的目录
    ignored:  /node_modules/
  }
}
```

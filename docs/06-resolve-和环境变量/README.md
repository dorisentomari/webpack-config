# 1. resolve 模块处理解析

+ alias，配置某个模块的别名，以 bootstrap 为例，我们使用 `import 'bootstrap';` 就直接在 alias 里找到对应的路径进行引用

+ extensions，配置文件的扩展名，如果引入的模块没有扩展名，会依次从 extensions 里查找，webpack 自动补全扩展名

+ mainFields，配置入口字段，这个是第三方模块在 package.json 里配置好的，我们直接拿来使用就好

+ modules，引用模块的路径


```javascript
module.exports = {
  resolve: {
    modules: [path.resolve('node_modules')],
    // 扩展名
    extensions: ['.js', '.css', '.json'],
    // 入口文件的名字
    // mainFiles: [],
    // 入口的字段，从包的 package.json 里查找
    mainFields: ['style', 'main'],
    // 配置别名
    alias: {
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  }
};
```

# 2. 环境变量

+ 比如在开发时需要区分开发，上线，测试环境等，我们可以设置全局的变量，用来区分

+ 我们使用 DefinePlugin 来定义变量，这个对象的 key 就是我们全局变量，value 是一个表达式，所以如果我们要使用字符串，需要双重字符串嵌套，`"'DEV'"`，如果我们想写表达式，可以 `1 + 1`，这里不是字符串，webpack 在解析之后，会执行表达式，最终得到的结果是 2

```javascript
module.exports = {
  plugins: [
    new Webpack.DefinePlugin({
      DEV: `'dev'`,
      FLAG: `'true'`,
      EXPRESSION: `1 + 1`
    })
  ]
};
```

# 3. webpack-merge

+ 这个模块的功能是为了合并不同的 webpack 配置，功能类似于 Object.assign(obj1, obj2,...)

+ 所以我们可以配置一些基本的功能 webpack.base.js，比如入口文件和出口文件等，然后根据开发环境，区分合并的 webpack 配置

+ 如果是开发模式，我们就合并 base 和 dev，如果是生产模式，就合并 base 和 prod

+ 这里的 base 不是必须的，仅仅是为了复用代码，减少重复的工作量

+  完整的代码可以查看 06-webpack.*.js

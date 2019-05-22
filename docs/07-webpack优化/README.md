```javascript
import jquery from 'jquery';
import moment from 'moment';

// 手动引入
import 'moment/locale/zh-cn';

// 设置语言
moment.locale('zh-cn');

console.log(jquery);


let time = moment().endOf('day').fromNow();

console.log(time);
```

# 1. noParse

+ 这个配置的意思是，如果你确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖

+ 就比如我们使用的 jQuery，就不需要其他的任何依赖，我们可以单独使用

+ 像 bootstrap 的 js 就不行，因为他需要依赖 jQuery

```javascript
// 不去解析 jquery 中的依赖库
module.exports = {
  module: {
    noParse: /jquery/
  }
};
```

+ 完整的代码可以查看 07-webpack.config.01.js

# 2. 忽略 IgnorePlugin

+ 假如一个库非常的大， 有很多的模块，但是我们只需要引入其中的一部分功能，我们可以采用这个配置项

+ 这个意思就是忽略所有匹配到的模块

```javascript
module.exports = {
  plugins: [
    new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
```

+ 完整的代码可以查看 07-webpack.config.01.js

# 3. [DLL 动态链接库(Dynamic link library)](https://zh.wikipedia.org/wiki/%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E5%BA%93)

> 动态链接库（英语：Dynamic-link library，缩写为DLL）是微软公司在微软视窗操作系统中实现共享函数库概念的一种实现方式。这些库函数的扩展名是.DLL、.OCX（包含ActiveX控制的库）或者.DRV（旧式的系统驱动程序）。

> 所谓动态链接，就是把一些经常会共享的代码（静态链接的OBJ程序库）制作成DLL档，当可执行文件调用到DLL档内的函数时，Windows操作系统才会把DLL档加载存储器内，DLL档本身的结构就是可执行档，当程序有需求时函数才进行链接。透过动态链接方式，存储器浪费的情形将可大幅降低。静态链接库则是直接链接到可执行文件。

> DLL的文件格式与视窗EXE文件一样——也就是说，等同于32位视窗的可移植执行文件（PE）和16位视窗的New Executable（NE）。作为EXE格式，DLL可以包括源代码、数据和资源的多种组合。

> 在更广泛的意义上说，任何同样文件格式的计算机文件都可以称作资源DLL。这样的DLL的例子有扩展名为ICL的图标库、扩展名为FON和FOT的字体文件。

+ .dll 后缀的文件成为动态链接库，在一个动态链接库红可以包含给其他模块调用的函数和数据

+ 把基础模块独立打包到单独的动态链接库

+ 把需要导入的模块在动态链接库里的时候，模块不能再次被打包，而是去动态链接库里获取 dll-plugin

## 3.1 创建 dll

+ 创建时我们需要用到 Webpack 的一个类，DllPlugin，用来打包出一个个的动态链接库

+ 我们采用 dll 仅仅是为了打包生成 dll，所以不需要配置 template，devServer 等之类的配置项

+ entry，由于我们可能会打包出多个 dll，所以我们的 entry 需要为一个对象，每一个 key 都代表打包生成的一个 dll
  + 比如我们配置的是 `entry: { react: ['react', 'react-dom'] }`，那么 这个 dll 就是 react 相关的，所打包的库是 react 和 react-dom

+ output，输出的一些配置
  + path，打包后生成的文件所在的目录，我们打包的目录是在 dist 下
  + filename，输出的 dll 的文件名，我们这里输出的文件名是 react_dll.js
  + library，dll 会导出一个全部变量，这个变量挂载在 window 对象上边，全局变量的名字是 `_dll_react`
  + libraryTarget，打包时采用的模块的方式，这里最终生成的是 `window["_dll_react"]`

```javascript
// webpack.config.dll.js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_dll.js',
    library: '_dll_[name]',
    libraryTarget: 'window'
  }
};
```

+ 使用插件打包 dll，这里我们需要配置 name 和 path
  + name 是指 output 里的 library 的值，这两个字段的值必须一样，否则引用的时候会出现找不到变量
  + path，这个是输出一个 json 文件，用来告诉 webpack，这个 dll 已经打包好，json 文件里有所打包的模块的记录

```javascript
// webpack.config.dll.js
module.exports = {
  plugins: [
    new Webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
};
```

+ 此时我们的 dll 就创建好了，合并前边的代码，写在 webpack.react.js 里，在 package.json 里配置一条打包命令 `"dll": "webpack --config webpack.react.js"`

```javascript
const path = require('path');
const Webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    react: ['react', 'react-dom']
  },
  output: {
    // 打包后的文件名
    filename: '[name]_dll.js',
    path: path.resolve(__dirname, 'dist'),
    // 指定打包后的模块最终返回的值用哪个变量接收
    library: '_dll_[name]',
    // 打包时采用的模块的方式，默认是 var
    libraryTarget: 'window'
  },
  plugins: [
    new Webpack.DllPlugin({
      // 这个 name 需要和 library 的值相同
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ],
  module: {
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
```

## 3.2 使用 dll

+ 我们要知道，打包生成 dll 之后，还需要引用，这里引用的就是刚才打包好的 dist 目录下的 react_dll.js

+ 我们修改 webpack.config.js 里的配置，这里的配置比较简单，直接引用创建 dll 时的 json 文件就可以了

+ 这里的 manifest.json 必须是创建 dll 时 plugins 里定义的 path，因为 webpack 不直接引用 react_dll.js，webpack 引用的是 manifest.json，从 manifest.json 里解析找到对应的 react_dll.js

```javascript
module.exports = {
  plugins: [
    new Webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname, 'dist', 'manifest.json'))
    })
  ]
};
```

## 3.3 注意

+ 我们需要在 index.html 模板中手动引入这个 dll 文件，不然是不会引用这个 dll 文件的

+ 完整的代码可以查看 07-webpack.config.02.js


## 3.4 library 和 libraryTarget
+ output.library 配置的是导出库的名称，通常和 libraryTarget 放在一起使用
+ output.libraryTarget 配置的是以何种方式导出库

## 3.5 关于 libraryTarget 的方式
+ 实际上就是导出的方式不一样，导入的方式也不一样

## 3.5.1 `var` 默认配置

+ `var` 默认配置，编写的库将通过 var 被赋值给通过 library 指定的变量
+ lib_code 其中 lib_code 代指导出库的代码内容，是有返回值的一个自执行函数

```javascript
// webpack 输出的代码
var _dll_react = (function(modules) {})({
  a: function () {},
  b: function () {},
  c: function () {},
});

// 使用库的方法
_dll_react.doSomething();
// 如果 output.library 为空值，那么就直接输出
```

### 3.5.2 `commonjs`

+  `commonjs`，编写的库将通过 CommonJS 规范导出

```javascript
// webpack 输出的代码
exports["_dll_react"] = (function(modules) {})({
  a: function () {},
  b: function () {},
  c: function () {},
});

// 使用库的方法
require('library-name-in-npm')['libraryName'].doSomething();
// 其中 library-name-in-npm 是指模块发布到 npm 代码仓库时的名称
```

### 3.5.3 `commonjs2`

+ `commonjs2`，编写的库将通过 CommonJS2 规范导出，这个时候配置 output.library 没有意义，因为模块直接导出，没有导出变量

```javascript
// webpack 输出的代码
module.exports = (function(modules) {})({
  a: function () {},
  b: function () {},
  c: function () {},
});

// 使用库的方法
require('library-name-in-npm')['libraryName'].doSomething();
// 其中 library-name-in-npm 是指模块发布到 npm 代码仓库时的名称
```

### 3.5.4 this

+  this，编写的库将通过 this 被赋值给通过 library 指定的名称

```javascript
// webpack 输出的代码
this["_dll_react"] = (function(modules) {})({
  a: function () {},
  b: function () {},
  c: function () {},
});

// 使用库的方法
this['_dll_react'].doSomething();
```

### 3.5.5 global 和 window

+ global 和 window，编写的库将通过 window 被赋值给通过 library 指定的名称，实际上就是把库挂载到 window 对象上

```javascript
// webpack 输出的代码
window["_dll_react"] = (function(modules) {})({
  a: function () {},
  b: function () {},
  c: function () {},
});

// 使用库的方法
window['_dll_react'].doSomething();
```

## 3.6 写一个 lib 为例解释 libraryTarget

+ lib.js

```javascript
function getName () {
  return 'hello, webpack';
}

exports.getName = getName;
```

+ webpack.config.lib.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/lib.js',
  output: {
    path: path.resolve(__dirname, 'lib_dll'),
    // 输出动态链接库的文件名称
    filename: 'bundle.js',
    // 导出变量的名称
    // 全部变量的名字，其他会从此变量上获取到里边的模块
    library: 'lib',
    libraryTarget: ''
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    })
  ]
};
```

### 3.6.1 var 模式

```javascript
// bundle.js
var lib = (function () {})();

// 可以直接使用
lib.getName();
```

### 3.6.2 commonjs 模式

```javascript
// bundle.js
exports["lib"] = (function () {})();

// 由于浏览器不能识别 exports，所以要在 node 里进行引入使用
let bundle = require('../lib_dll/bundle');
console.log(bundle.lib.getName());
```

### 3.6.3 commonjs2 模式

```javascript
// bundle.js
module.exports = (function () {})();

// 由于浏览器不能识别 module，所以要在 node 里进行引入使用
let bundle = require('../lib_dll/bundle');
console.log(bundle.getName());
```

### 3.6.4 this、window 和 global 模式

```javascript
// bundle.js
this["lib"] = (function () {})();
window["lib"] = (function () {})();
globalThis["lib"] = (function () {})();

// 可以直接使用
console.log(this.lib.getName());
console.log(window.lib.getName());
console.log(globalThis.lib.getName());
```

# 4. happypack 多线程打包

+ 有时候我们想要打包速度更快一些，我们可以开启多线程，同时打包 css 或 js 等资源，我们可以使用 happypack

+ 修改 webpack 的配置，注意，这里的 happypack 配置时的 id 必须要和 rule 里的对应，这样 happypack 才会知道对应关系。并且使用在 happypack 里配置好的对应的 loader

```javascript
// 打包时采用多线程打包，提高打包速度
const HappyPack = require('happypack');

module.exports = {
  plugins: [
    new HappyPack({
      id: 'js',
      use: ['babel-loader']
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve('src'),
        exclude: /node_modules/
      }
    ]
  }
};
```

+ 完整的代码可以查看 07-webpack.config.happypack.js

# 5. webpack 自带的优化

## 5.1 tree shaking

+ tree shaking 是摇晃，把我们没有使用的代码摇下来，不进行打包

+ 必须要依赖于 import 语法，不能使用 require 语法

## 5.2 scope hosting 作用域提升

+ scope hosting 是提升作用域，自动省略可以简化的代码

+ 具体看实例

```javascript
// 我们写的代码
let a = 1;
let b = 2;
let c = 3;
let d = a + b + c;
console.log(d);

// webpack 打包后的代码
console.log(6);
```

# 6. 切割代码

+ 多页面里，不同的页面需要不同的代码，所以要对代码进行切割

+ 公共的代码，都可以进行切割

+ common 是分割我们自己写的代码，vendor 是我们使用的第三方库的代码
  + minSize 是指代码的最小体积
  + minChunks 是指重复多少次，我们这设定为最少使用两次
  + priority 是权重，或者叫优先级，比如 jquery 我们引用了好多次，但是 jquery 是第三方库，所以我们可以把第三方库的打包优先级提高，打包完 jquery，然后再打包我们自己写的代码

```javascript
module.exports = {
  entry: {
    index: './src/index.js',
    other: './src/other.js'
  },
  optimization: {
    // 分割代码块
    splitChunks: {
      // 缓存
      cacheGroups:{
        // 公共的代码
        common: {
          minSize: 0,
          minChunks: 2,
          chunks: "initial",
          priority: 1
        },
        vendor: {
          test: /node_modules/,
          minSize: 0,
          minChunks: 2,
          chunks: "initial",
          priority: 2
        }
      }
    }
  }
};
```

# 7. 懒加载

+ 懒加载主要采用的是 import() 语法，这个语法是高级语法，需要采用 babel 编译 @babel/plugin-syntax-dynamic-import

+ import() 语法的原理就是 jsonp，需要的时候引入一个 js 文件

```javascript
let button = document.createElement('button');

button.innerHTML = 'click';

button.addEventListener('click', () => {
  console.log('click');
  // 实现懒加载
  import('./source.js').then(res => {
    console.log(res);
  })
});

document.body.appendChild(button);
```

# 8. 热更新

+ 热更新目的不是说热重启服务，而是我们的代码修改后，不要刷新整个页面，而是说刷新修改的部分代码

+ 这样可以利于开发时其他数据的保留，不用每次都做重复的操作

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    // 打印更新的模块路径
    new Webpack.NamedModulesPlugin(),
    // 热更新插件
    new Webpack.HotModuleReplacementPlugin()
  ]
};
```
+ 同时我们还需要在页面里做修改，主要是 module.hot，这个是给 webpack 使用的，在修改了之后，可以再次引入这个模块，同时页面刷新局部

```javascript
import source from './source';

console.log(source);

if (module.hot) {
  module.hot.accept('./source.js', (res) => {
    console.log('文件更新');
    console.log(res);
    require('./source');
  });
}
```


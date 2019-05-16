# 1. loader

+ [loader官网链接](https://webpack.docschina.org/api/loaders/)，有一些内容比较难以理解，所以建议直接看官网文档

+ [如何开发一个 Webpack Loader](http://www.alloyteam.com/2016/01/webpack-loader-1/)

+ webpack 只能处理 js 的模块，如果要处理其他类型的文件，需要使用 loader 进行转换

+ loader 是 webpack 中一个重要的概念，它是指用来将一段代码转换成另一段代码的 webpack 加载器

+ loader 的执行顺序是从下往上，从右到左

+ loader 本质上是获取到源代码，把源代码进行处理，然后把处理后的代码返回给下一个 loader，下一个 loader 的参数就是上一个 loader 的返回值

+ 配置 webpack 解析 loader 的路径，可以配置别名，通过别名的属性获取 loader，也可以直接通过 modules 配置获取 loader

```javascript
module.exports = {
  resolveLoader: {
    // alias: {
    //   loader1: path.resolve(__dirname, './src/loaders', 'loader1.js')
    // },
    modules: ['node_modules', path.resolve(__dirname, './src/loaders')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'loader1'
      }
    ]
  }
};
```


# 2. 最简单的 loader

+ loader1.js，实际上这就是一个最简单的 loader，这个 loader 的功能就是输出一个字符串 loader1，再输出源代码，然后把 source 返回

```javascript
// src/loaders/loader1.js
function loader(source) {
  console.log(source);
  console.log('loader1');
  return source;
}

module.exports = loader;
```

+ 我们直接打包就可以看到在命令行输出了源代码和 `loader1`，这就说明我们的 loader 已经成功执行了

+ 我们再创建 loader2 和 loader3，同样进行配置，可以看到，控制台同样输出了源代码和 `loader2`，`loader3`

```javascript
// src/loaders/loader2.js
function loader(source) {
  console.log(source);
  console.log('loader2');
  return source;
}

module.exports = loader;

// src/loaders/loader3.js
function loader(source) {
  console.log(source);
  console.log('loader3');
  return source;
}

module.exports = loader;
```

+ 我们可以看到控制台输出的顺序，依次是 loader1，loader2，loader3，这也说明了我们的 loader 是从右往左执行的

+ 此时我们运行打包后的 js 文件，发现文件可以正常运行

+ 查看 bundle.js 文件的源代码，我们可以看到最后 `"./src/index.js"` 的方法函数里的内容，不再是由 eval 函数执行的，而是纯粹的 `console.log(1);`

# 3. loader 的 options

+ 有时候我们自己写的 loader，需要用户做一些配置满足他的需求， use 有一个 options 的配置项，在这里进行配置，是给 loader 使用的，而不是给 webpack 使用的

+ 所以我们可以把参数配置在 options 里，这样 loader 方法就可以拿到 loader 的配置数据信息

+ 我们需要使用 loader-utils 这个库，一个工具模块库，用来做 loader 的工具方法

+ 在 webpack 中对 loader1 进行配置

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'loader1',
          options: {
            name: 'mark'
          }
        }
      }
    ]
  }
};
```

+ 在 loader1 中使用

```javascript
const loaderUtils = require('loader-utils');

function loader(source) {
  let options = loaderUtils.getOptions(this);
  console.log(options);
  return source;
}

module.exports = loader;
```

+ 当我们再次进行打包，就可以在控制台看到 `{ name: 'mark' }` 这个配置项，当我们拿到配置信息后，就可以根据配置信息进行不同的处理

# 4. loader 中的同步和异步

+ 同步的 loader，如果 loader 处理的数据量非常小，换句话说就是需要处理的代码量少，模块少，且模块小，最重要的是没有依赖其他的库，我们就可以直接采用同步的 loader，这样处理起来更加方便，就像上边我们写的简单的 loader 一样

+ 但是，我们的源代码可能有成百上千个文件，需要很多种 loader，并且每一种 loader 需要处理的数据量非常大，而且 loader 还需要依赖其他的库，那么我们就需要采用异步的处理方式


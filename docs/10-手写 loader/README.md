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

+ 当我们再次进行打包，就可以在控制台看到 `{ name: 'mark' }` 这个配置项，这是因为 load-utils 这个库，已经帮助我们获取到了 loader 配置项里的数据

+ 我们直接在 loader 里加第二个参数是不行的，所以我们必须使用这个库，当我们拿到配置信息后，就可以根据配置信息进行不同的处理

# 4. loader 中的同步和异步

+ 同步的 loader，如果 loader 处理的数据量非常小，换句话说就是需要处理的代码量少，模块少，且模块小，最重要的是没有依赖其他的库，我们就可以直接采用同步的 loader，这样处理起来更加方便，就像上边我们写的简单的 loader 一样

+ 但是，我们的源代码可能有成百上千个文件，需要很多种 loader，并且每一种 loader 需要处理的数据量非常大，而且 loader 还需要依赖其他的库，那么我们就需要采用异步的处理方式

+ 在 loader 的内部，有一个 this，这个 this 有很多属性，可以帮助我们操作 loader
  + this.cacheable()，表示是否开启缓存，默认开启，如果要关闭缓存，直接 this.cacheable(false); 即可
  + this.async(); 这是一个异步的操作，如果我们有异步操作，可以使用 this.async();
  + this.addDependency(); 表示是否要把某个文件添加为依赖，这样这个文件更新的时候，webpack 就会热加载

# 5. banner-loader 的实现

+ banner-loader 就是在打包生成的代码文件最开始的地方，添加一些 banner 说明，比如一些辅助性的说明内容，作者，版本等，当然这些要作为注释出现在代码文件中

+ 我们先配置 webpack 的 rule，这里的 options 表明了一些我们需要的字段信息
  + filename 表示我们采用一个文件作为 banner 信息模板，这样我们修改的时候，只需要修改模板文件，而不需要修改 webpack 文件
  + text 表示如果没有 filename，那么就用 text 字段的信息

+ webpack.config.js

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'banner-loader',
          options: {
            text: 'hello, banner-loader',
            filename: path.resolve(__dirname, 'src/banner-template.txt')
          }
        }
      },
    ]
  }
};
```

+ banner-loader.js

```javascript
const fs = require('fs');
let loaderUtils = require('loader-utils');
let validateOptions = require('schema-utils');

function loader(source) {
  // 使用缓存
  this.cacheable && this.cacheable();
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  let schame = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  };
  validateOptions(schame, options, 'banner-loader');
  if (options.filename) {
    // 自动添加文件依赖
    this.addDependency(options.filename);
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/${source}`);
    });
  } else {
    cb(null, `/**${options.text}**/${source}`);
  }
  return source;
}

module.exports = loader;
```

+ 原理就是通过 loader-utils 这个库获取到 webpack 的配置信息，然后通过 fs 读取到模板文件，或者是直接使用 options 里的 banner 信息。调用 this.async(); 异步方法，把 banner 信息添加到 source 的前边

+ 这里采用了 schema-utils 这个库，主要是用来校验 options 里的配置是否与我们校验的符合。如果直接想要自己校验，那么也可以直接写校验方法

+ this.addDependency 的目的就是把作为模板的文件也作为热更新的模块进行监听

+ this.async() 的用法就是在异步操作的回调里边，直接调用 cb，然后把最终的代码信息作为参数传递

# 6. file-loader 的实现

+ file-loader 就是加载文件资源比如图片字体等，原理就是把文件转成 Buffer，获取到文件的 md5 名字，然后发射文件，最终把文件作为一个模块返回

+ webpack.config.js

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: 'file-loader'
        }
      },
    ]
  }
};
```

+ file-loader.js

```javascript
let loaderUtils = require('loader-utils');
// 根据图片生成一个 md5，存在 dist 目录下，还会返回当前的路径

function loader(source) {
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {content: source});
  this.emitFile(filename, source);
  // file-loader 需要返回一个路径
  return `module.exports = '${filename}'`;
}

loader.raw = true;

module.exports = loader;
```

# 6. url-loader 的实现

+ file-loader 的功能仅仅是把文件作为模块导入，但是我们还想，如果文件体积很小，那么就可以直接转换成 base64 格式，所以我们在 filer-loader 的基础上，增加这样的功能，叫做 url-loader

+ webpack.config.js

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 200 * 1024
          }
        }
      },
    ]
  }
};
```

+ url-loader.js

```javascript
let loaderUtils = require('loader-utils');
let mime = require('mime');

function loader(source) {
  let {limit} = loaderUtils.getOptions(this);
  if (limit && limit > source.length) {
    return `module.exports = 'data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}'`;
  }
  return require('./file-loader').call(this, source);
}

loader.raw = true;

module.exports = loader;
```

# 7. less-loader 的实现

```javascript
let less = require('less');

function loader (source) {
  let css = '';

  less.render(source, (err, c) => {
    console.log(c);
    css = c.css;
  });

  css = css.replace(/\n/g, '\\n');

  return css;
}

module.exports = loader;
```

# 8. style-loader 的实现

```javascript
function loader(source) {
  let style = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `;
  return style;
}

module.exports = loader;
```


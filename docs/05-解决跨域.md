# 1. 跨域

+ 配置服务，我们需要先创建一个 src/server.js，用来开启我们的服务

```javascript
const express = require('express');

let app = express();
const PORT = 3000;

app.get('/user', (req, res) => {
  res.json({name: 'carl'});
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`the server is running at http://localhost:${PORT}`);
  }
});
```

+ 同时我们需要在客户端发起 ajax 请求，客户端的请求先设置为统一以 `/api` 开头，方便我们在 webpack 里配置代理。一定要知道，我们可以不使用 `/api` ，但是我们为了做代理，可以使用 `/api`。如果我们不使用代理，那么就就可以不使用 `/api`

+ 修改 src/index.js

```javascript
let xhr = new XMLHttpRequest();

xhr.open('GET', '/api/user', true);

xhr.onload = function () {
  console.log(xhr.response);
};

xhr.send();
```

## 1.1 代理跨域

+ 客户端访问服务端，是会引起跨域问题的。但是服务端去访问另外一个服务端，这样是没有跨域问题的，所以我们可以采用 webpack 的服务代理我们的请求到真实的服务，这样就可以解决跨域问题

+ 在 webpack.config.js 里配置 devServer

```javascript
module.exports = {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {'^/api' : ''}
    }
  }
};
```

+ 这里的 proxy 就是为了做代理，`/api` 的意思是，给以 `/api` 开头的配置一个代理，代理的服务就是 target，但是我们可以看到，server.js 里的接口是没有以 `/api` 开头的，但是我们客户端以 `/api` 开头了，所以就是我们在 webpack 里代理的时候，需要把 `/api` 去掉，这样请求的就是正确的接口地址
  
+ 所以我们使用 pathRewrite 重写了接口地址，把 `/api` 替换为空字符串，这样就可以请求到数据

## 1.2 使用 webpack 模拟数据

+ webpack 开启的服务是基于 express 的，所以我们可以使用 webpack 自己的服务，来写接口，这样就不需要使用 `/api` 代理了

+ 在 webpack.config.js 里配置 devServer，before 里的 app 参数，实际上就是 express 里的 app，这个 before 就是一个钩子函数，还有其他的钩子函数，在这里不做细讲

```javascript
module.exports = {
  proxy: {
    // 前端模拟数据
    before (app) {
      app.get('/user', (req, res) => {
        res.json({name: 'carl'});
      });
    }
  }
};
```

+ 然后把 src/index.js 里的 `xhr.open('GET', '/api/user', true);` 改成 `xhr.open('GET', '/user', true);`，因为我们已经不需要跨域了，所以就不再使用代理。

+ 这样实际上是前端自己开启了一个服务，这个服务是模拟的，数据都是前端定义的，所以这样操作跨域，会带来一个问题，就是如果服务端的数据结构与前端模拟的数据结构不一样，那么前后端联调的时候就非常麻烦，所以不推荐使用

## 1.3 把 webpack 的服务建立在后端服务上

+ 把 webpack 的服务建立在后端的服务上，这个意思就是说，本来 webpack 有一个自己的客户端 server，服务端有一个自己的 server，但是客户端去请求服务端就会有跨域问题，那么为了解决跨域，我们直接就把 webpack 的服务搭建在服务端

+ 但是这样就会有一个问题，就是如果后端不是 Node.js 怎么办，所以这种方式就有一种局限性，后端必须是 Node.js，如果后端是 Java 或 PHP 等，那么这个方式就行不通

+ 这种方式呢，比较简单， 直接采用 webpack 定义好的方法去使用就行了

+ 我们现在不需要修改 webpack.config.js ，我们只需要修改 src/server.js，在 /src/server.js 里引入 webpack.config.js，然后进行编译，就可以了

+ 本质上是采用了 express 中间件的模式，webpack 先把配置好的 webpack.config.js 进行处理，生成一个很复杂的对象，然后使用 webpack-dev-middleware 这个中间件，配置给 app.use 就可以了

+ 修改 src/server.js

```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../webpack.config');

let compiler = webpack(config);

let app = express();
const PORT = 3000;
app.use(webpackDevMiddleware(compiler));

app.get('/user', (req, res) => {
  res.json({name: 'carl'});
});
```

+ 完整的代码可以查看 05-webpack.config.js
  
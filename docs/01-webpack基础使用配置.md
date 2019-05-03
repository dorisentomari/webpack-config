# 1. 最简单的 webpack 配置，就是零配置

+ webpack 支持零配置，只有一个要求，在根目录下有一个 src 文件夹，src 文件夹下有一个 index.js 的文件，然后直接在命令行输入 npx webpack，就可以调用 webpack 进行默认打包

+ 但是，这个零配置的有这么几个默认的属性
	+ 入口文件必须是 src/index.js 文件
	+ 打包模式是生产模式，打包出来的是压缩后的代码
	+ 打包后的文件目录是 dist，文件名叫 bundle.js

+ 所以我们需要进行一些自定义配置，比如定义入口出口，开发模式，loader 配置等

# 2. 简单配置 webpack

+ 在根目录建立一个 webpack.config.js 或 webpackfile.js 的文件，修改入口出口，开发模式
	+ 开发模式是 development
	+ target 分为浏览器和 Node，这里我们采用 browser
	+ 入口文件是 src/index.js
	+ 出口目录是 /dist，出口文件是 /dist/bundle.js

+ /webpack.config.js

```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist')
  }
};
```

+ 打包后生成的代码文件，可以直接在浏览器或 Node 里运行，因为 webpack 自己实现了一套引用模块的方法，这个方法可以兼容浏览器端，也可以兼容 Node 端

+ 比如我们在 src/index.js 里边输入 `console.log('hello, webpack');`，在 dist 目录下新建一个 HTML 文件，直接加载 bundle.js 资源，就可以在浏览器的控制台里看到 hello, webpack ，这就表示，我们最基本的 webpack 已经配置成功

# 3. 配置 package.json 的 scripts 的启动命令

+ 如果我们直接在命令行输入 `npx webpack` 进行默认配置，这样不太方便，我们需要自定义命令及参数

+ 在 package.json 里添加一条命令 `"build": "webpack --config webpack.config.js --watch"`，这个就是使用 npm run build 的命令，就会调用 `webpack --config webpack.config.js --watch` 的命令，--config 参数是为了指定配置文件，配置文件的名字就是 webpack.config.js，--watch 的意思是开启监听，一旦监听到代码变动，会在多少毫秒内重新打包

# 4. 添加本地开发 server

+ 我们在开发的时候，并不想每次都把代码进行打包，因为直接打包生产代码的效率还是比较低的，我们希望能够快速打包，提高我们的开发效率，我们也并不关注打包后的代码具体是什么样子

+ 所以我们采用 webpack-dev-server 这个包，用来开启本地服务，把打包后的内容都放在内存里，这样不影响我们使用，也不会生成文件，打包的速度就很快

+ 我们配置一下 webpack.config.js，添加 devServer 的配置项 
	+ host，指定 IP
	+ port，指定服务的端口
	+ progress，是否开启打包时进度条的显示
	+ contentBase，指向某个目录为静态服务文件夹
	+ compress，是否开启 gzip 压缩

```javascript
module.exports = {
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
	}
}
```

+ 同时在 package.json 里添加一条启动 devServer 的命令 `"dev": "webpack-dev-server"`

+ 这样在 webpack 打包的时候，就可以开启本地服务

# 5. 添加 HTML 模板

+ 我们希望使用一个 HTML 模板，通过 webpack 的配置去生成一个 HTML 文件，比如配置 HTML 是否压缩，是否去掉注释，是否去掉标签上的引号等，我们采用 html-webpack-plugin 这个插件

+ 在 webpack 里，插件的写法都是类似的，关于 HTML 模板的具体使用，这个根据需要使用，比如不想压缩，就可以不用压缩生成的 HTML 实际上没什么大的差别，有些配置主要是为了提高浏览器的渲染效率而设置的，学习阶段可以淡化这些

```javascript
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
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
```

# 6. 引入 CSS 样式文件

+ 在 webpack 里，每一个文件都是一个模块，不管是 js 文件，html 文件，css 文件或者是字体图片文件，都是一个模块，针对不同的模块，我们需要采用不同的加载器(loader)来进行解析，解析后的代码 webpack 才能识别

+ 所以为了解析 css 代码，我们需要安装 style-loader 和 css-loader 模块，style-loader 的目的是为了把 css 样式注入到页面里，css-loader 的目的是为了解析 css 文件

+ loader 的特点就是功能单一，所以我们使用到了某个功能，我们就可以安装对应的 loader。每一个文件可能会有不同的 loader 进行解析，那么在解析的时候，针对 loader 使用的顺序是从右往左，比如 `use: ['style-loader', 'css-loader']`，那么就会先使用 css-loader，然后再使用 style-loader

+ 针对每一个 loader，都可以使用对象的形式，这样可以对每一个 loader 进行特殊的配置，比如我们要把在 html 页面里的添加了 style 标签，那么直接使用，样式是会被打包后的样式覆盖的。所以我们可以修改 options 属性，把代码插入到打包后的代码后边，这样优先级会比打包后的 css 优先级要高，所以我们使用 insertAt 属性

+ 我们修改 webpack.config.js 里的代码，记住 loader 的使用顺序是从右往左，比如 less 处理，先使用 less-loader 把 less 代码处理为 css，然后再通过 css-loader 处理，最后通过 styler-loader 处理

```javascript
module.exports = {
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
		 }
	 ]
 }
};
```

# 7. 使用 less/stylus/sass

+ 使用 less/stylus/sass，我们就需要使用对应的解释器和 loader

```javascript
module.exports = {
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
  }
}
```

+ 这样，我们就实现了 webpack 对 css 及预处理器的处理

+ 完整的代码可以查看 01-webpack.config.js

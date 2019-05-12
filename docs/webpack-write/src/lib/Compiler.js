const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;
const ejs = require('ejs');
const { SyncHook } = require('tapable');

class Compiler {
  constructor(config) {
    this.config = config;
    // 保存入口文件的路径
    this.entryId;
    // 需要保存所有的模块依赖
    this.modules = {};  // 存放所有的依赖关系
    // 入口路径
    this.entry = config.entry;
    // 工作目录，运行 npx carl-pack 时的路径
    this.root = process.cwd();
    // plugins
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      done: new SyncHook(),
      emit: new SyncHook()
    };
    // 如果传递了 plugins 参数
    let plugins = this.config.plugins;
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this);
      });
      this.hooks.afterPlugins.call();
    }
  }

  // 拿到模块的内容
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, 'utf8');
    let rules = this.config.module.rules;
    // 拿到每一个规则，处理对应的 loader
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      let { test, use } = rule;
      let len = use.length - 1;
      // 匹配到之后，说明做个模块需要这个 loader 来处理
      if (test.test(modulePath)) {
        function normalLoader() {
          let k = use[len--]
          let loader = require(use[len--]);
          content = loader(content);
          // 获取对应的 loader 函数
          if (len >= 0) {
            // 递归调用 loader 实现转换功能
            normalLoader();
          }
        }
        normalLoader();
      }
    }

    return content;
  }

  // 构建模块
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath);

    // 获取模块的名字，是一个相对路径
    let moduleName = './' + path.relative(this.root, modulePath);

    if (isEntry) {
      // 保存入口的名字
      this.entryId = moduleName;
    }

    // 解析源码，对 source 源码进行改造，返回一个依赖列表
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName));

    // 把相对路径和模块的内容对应起来
    this.modules[moduleName] = sourceCode;

    // 父模块的依赖
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false);
    })
  }

  // parse 主要依靠 AST 解析语法树
  parse(source, parentPath) {
    let ast = babylon.parse(source);
    let dependencies = [];
    traverse(ast, {
      CallExpression(p) {
        let node = p.node;
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__';
          // 取到的就是模块的引用名字
          let moduleName = node.arguments[0].value;
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js');
          moduleName = './' + path.join(parentPath, moduleName);
          dependencies.push(moduleName);
          node.arguments = [types.stringLiteral(moduleName)];
        }
      }
    });
    let sourceCode = generator(ast).code;
    return { sourceCode, dependencies };
  }

  emitFile() {
    // 用数据渲染
    // 输出到哪个目录下，输出路径
    let { output } = this.config;

    let main = path.join(output.path, output.filename);

    let templateString = this.getSource(path.join(__dirname, 'main.ejs'));

    let code = ejs.render(templateString, { entryId: this.entryId, modules: this.modules });

    this.assets = {};
    // 路径对应的代码
    this.assets[main] = code;

    fs.writeFileSync(main, this.assets[main]);
  }

  run() {
    // 编译
    this.hooks.compile.call();
    // 解析文件的依赖，执行并且创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.hooks.afterCompile.call();
    // 发射一个文件，就是打包后的文件
    this.emitFile();
    this.hooks.emit.call();
    this.hooks.done.call();
  }

}

module.exports = Compiler;

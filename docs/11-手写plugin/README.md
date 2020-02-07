# 1. webpack 插件

# 2. 加载插件的对象
+ Compiler 编译对象
  + run 开始运行
  + compile 开始编译
  + compilation 创建编译对象
  + make 创建模块对象
  + emit 发射文件
  + done 完成

+ Compilation 资源构建
  + buildModule 创建模块
  + normalModuleLoader 普通模块加载
  + succeedModule 模块加载完成
  + finishModules 所依赖的模块完成
  + seal 封装整理代码
  + opitimize 优化

+ Module Factory 模块处理
  + beforeResolver 解析前
  + afterResolver 解析后
  + parser 解析

+ Module 模块

+ Parser 模块
  + program 开始遍历
  + statement 语句
  + call 调用
  + expression 处理表达式

Template 模板
  + hash 处理 hash
  + bootstrap 启动
  + localVars 变量
  + render 渲染

# 1. Tapable

+ webpack 本质上是一种事件流的机制，它的工作流程是将各个插件串联起来，而实现这一切的核心就是 Tapable，Tapable 类似于 Node.js 的 Events 库，核心原理也是依赖于发布订阅模式

+ 异步钩子分为串行和并行，并行需要等待所有并发的异步事件，执行后再执行回调方法

+ 注册方法，分为 tap 注册， tapAsync 注册，多一个 cb，还有急事 tapPromise，注册的是 Promise

+ 调用时，call，callAsync，promise


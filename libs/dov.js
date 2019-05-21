const Dov = require('./core/Dov')
const defaultConfig = require('./default')

const { bind, extend, merge } = require('./utils')

// 工厂模式
function createInstance(defaultConfig) {

    // 1. 创建一个上下文对象
    let ctx = new Dov(defaultConfig)

    // 2. 放在请求的Promise 函数中
    let instance = bind(Dov.prototype.request, ctx)

    // 获取原型链上的所有属性
    extend(instance, Dov.prototype, ctx)

    // 获取上下文所有属性
    extend(instance, ctx)

    return instance
}
// 创建单例
let dov = createInstance(defaultConfig)
// 单例函数
dov.create = function(instanceConfig) {
    return createInstance(merge(defaultConfig,instanceConfig))
}
// 用于继承
dov.Dov = Dov
// Promise 的 all 方法
dov.all = function all(promises) {
    return Promise.all(promises)
}

module.exports = dov

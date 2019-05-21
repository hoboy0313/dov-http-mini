const utils = require('../utils')

function InterceptorManager() {
    this.handlers = []
}
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
    })
    return this.handlers.length - 1
}
InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
        this.handlers[id] = null
    }
}
InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
            fn(h)
        }
    })
}
module.exports = InterceptorManager

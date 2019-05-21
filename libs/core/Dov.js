const InterceptorManager = require('./InterceptorManager')
const dispatchRequest = require('./dispatchRequest')
const { merge, bind, forEach } = require('../utils.js')
const defaults = require('../default')

function Dov(defaultConfig) {
    this.defaults = defaultConfig
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    }
}

Dov.prototype.request = function(config) {
    if (typeof config === 'string') {
        config = merge({
            url: arguments[0]
        }, arguments[1])
    }
    config = merge(defaults, this.defaults, config)
    let promise = Promise.resolve(config)

    let chain = []

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    chain.push(dispatchRequest, undefined)
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
}

forEach(['get', 'post', 'put', 'delete', 'trace', 'options', 'head', 'connect'], function forEachMethodNoData(method) {
    Dov.prototype[method] = function(url, config) {
        return this.request(merge(config || {}, {
            method: method,
            url: url
        }))
    }
})
module.exports = Dov

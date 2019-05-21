const isArray = Array.isArray
/*
* 判断是否为 HTTP 请求
* @param url 请求的路径
* @return Boolean
*/
function isHttp(url) {
    return new RegExp(/^https?/).test(url)
}
/*
* 改变上下文函数的上下文对象
* @param fn 需要改变上下文的对象
* @param ctx 上下文对象
* @return wrap
*/
function bind(fn, ctx) {
    return function wrap() {
        let args = new Array(arguments.length)
        for (let i = 0; i < args.length; i++) {
            args[i] = arguments[i]
        }
        return fn.apply(ctx, args)
    }
}
/*
*   合并所有对象
*   @params Object 需要合并的对象
*   @return Object 合并后的对象
*/
function merge(/* obj1, obj2, obj3, ... */) {
    let result = {}

    function assignValue(val, key) {
        if (typeof result[key] === 'object' && typeof val === 'object') {
            result[key] = merge(result[key], val)
        } else {
            result[key] = val
        }
    }

    for (let i = 0, l = arguments.length; i < l ;i++) {
        forEach(arguments[i], assignValue)
    }
    return result
}
/*
*  对数组和对象自生属性进行遍历
*  @params obj 被遍历的对象
*  @params cb 每次遍历到一个属性就调用一次回调函数
*/
function forEach(obj, cb) {
    if (obj === null || typeof obj === 'undefined')
        return
    if (typeof obj !== 'object') {
        obj = [obj]
    }
    if (isArray(obj)) {
        // Iterate over array values
        for (let i = 0, l = obj.length; i < l; i++) {
            cb.call(null, obj[i], i, obj)
        }
    } else {
        // Iterate over object keys
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                cb.call(null, obj[key], key, obj)
            }
        }
    }
}
/*
*   继承所有的属性到对象上
*   @params a 需要被继承属性的对象
*   @params b 需要提供继承属性的对象
*   @params thisArg 如果属性中有函数，可以通过此参数修改上下文对象
*   @return Object 把继承完成的对象
*/
function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg)
        } else {
            a[key] = val
        }
    })
    return a
}

module.exports = {
    bind,
    merge,
    forEach,
    extend,
    isHttp
}

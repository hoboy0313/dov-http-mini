const { isHttp } = require('../utils')

module.exports = function dispatchRequest(config) {
    // 1. url 拼接。
    if (!isHttp(config.url)) {
        config.url = config.baseURL ? config.baseURL + config.url : config.url
    }

    return new Promise(function (resolve, reject) {
        wx.request({
            ...config,
            success(result) {
                resolve(result)
            },
            fail(error) {
                reject(error)
            }
        })
    })
}

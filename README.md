# Dov

> 基于 axios 体验的微信小程序请求工具，完全使用Promise，并提供了请求和响应的拦截。

## 引入到项目中

- 第一步， npm i dov-http-mini
- 第二步， 复制 dist 目录下的 dov.min.js 到项目中
- 第三步， ` import dov from './libs/dov.min.js' `


## 快速使用

```js
// http.js
import dov from './libs/dov.min.js'

dov.get('http://www.baidu.com/user').then(response => {
    console.log(response)
})
// 或者
dov.defaults.baseURL = 'http://www.baidu.com'   // 设置默认地址
dov.get('http://www.baidu.com/user').then(response => {
    console.log(response)
})
```

第二个参数可以追加参数
```js
dov.get('http://www.baidu.com/user', {
    data: {
        username: 'dov',
        password: 'asdkln211232345sa'
    }
}).then(response => {
    console.log(response)
})
```

多个请求合并
```js
function getUserInfo(){
    return dov.get('/userinfo')
}
function getUserPerssion(){
    return dov.get('/userPerssion')
}
dov.all([getUserInfo(), getUserPerssion()]).then(response => {
    console.log(response)
}).catch(error => {
    console.log(error)
})
```

## dov API

dov(config)
```js
dov({
  method: 'post',
  url: 'http://www.baidu.com/getUserInfo',
  data: {
    username: 'king',
    password: 'kingpassword'
  }
}).then(response => {
  console.log(response)
})

// 或
dov.defaults.baseURL = 'http://www.baidu.com'
dov({
  method: 'post',
  url: '/getUserInfo',
  data: {
    username: 'king',
    password: 'kingpassword'
  }
}).then(response => {
  console.log(response)
})
```
dov.(url[,config])
```js
dov('http://www.baidu.com/getUserInfo', {
  method: 'post',
  data: {
    username: 'king',
    password: 'kingpassword'
  }
}).then(response => {
  console.log(response)
})

```

小程序中定义了8种请求类型：[微信小程序请求方式](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)

- GET
- POST
- PUT
- DELETE,
- OPTIONS,
- HEAD,
- TRACE,
- CONNECT

###### dov.get(url[, config])
###### dov.post(url[, config])
###### dov.put(url[, config])
###### dov.delete(url[, config])
###### dov.options(url[, config])
###### dov.head(url[, config])
###### dov.tracce(url[, config])
###### dov.connect(url[, config])

## 创建实例
> 可能需要多个实例来操作时，可以通过 create 方法来实现。


```js
let server1 = dov.create({
    baseURL: 'https://api.baidu.com'
})
let server2 = dov.create({
    baseURL: 'https://img.baidu.com'
})

server1.get('/getUserInfo').then(response => {
    console.log(response)
})
```

### 一般的配置参数都是参照微信的
[微信小程序 request 请求参数列表](https://developers.weixin.qq.com/miniprogram/dev/api/wx.request.html)

```js
{
    baseURL: '', // 默认地址

    url: '',

    data: {},

    header: {},

    method: '',

    dataType: '',

    responseType: '',
}
```

## Interceptors

> dov 也提供了和 axios 一样的请求拦截和响应拦截，并且可以配置多个

#### request
```js
// 1.第一个 request 的拦截器
dov.interceptors.request.use(function (config) {
    config.data.header['Authorization'] = wx.getStorageSync('token')
    // ...
    return config
})
// 2.第二个 request 的拦截器，
dov.interceptors.request.use(function (config) {
    config.data.token = wx.getStorageSync('token')
    // ...
    return config
})
```


#### response
```js
// 1.第一个 response 的拦截器
dov.interceptors.response.use(function (response) {
   if (response.status === 200) {
       ...
   }
    return response
})
// 2.第二个 response 的拦截器，
dov.interceptors.response.use(function (response) {
    if (response.status === 300) {
       ...
   }
    return response
})
```

## License

MIT

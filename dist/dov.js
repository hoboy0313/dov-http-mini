(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dov"] = factory();
	else
		root["dov"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./libs/dov.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./libs/core/Dov.js":
/*!**************************!*\
  !*** ./libs/core/Dov.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./libs/core/InterceptorManager.js");

var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./libs/core/dispatchRequest.js");

var _require = __webpack_require__(/*! ../utils.js */ "./libs/utils.js"),
    merge = _require.merge,
    bind = _require.bind,
    forEach = _require.forEach;

var defaults = __webpack_require__(/*! ../default */ "./libs/default.js");

function Dov(defaultConfig) {
  this.defaults = defaultConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

Dov.prototype.request = function (config) {
  if (typeof config === 'string') {
    config = merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = merge(defaults, this.defaults, config);
  var promise = Promise.resolve(config);
  var chain = [];
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });
  chain.push(dispatchRequest, undefined);
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

forEach(['get', 'post', 'put', 'delete', 'trace', 'options', 'head', 'connect'], function forEachMethodNoData(method) {
  Dov.prototype[method] = function (url, config) {
    return this.request(merge(config || {}, {
      method: method,
      url: url
    }));
  };
});
module.exports = Dov;

/***/ }),

/***/ "./libs/core/InterceptorManager.js":
/*!*****************************************!*\
  !*** ./libs/core/InterceptorManager.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(/*! ../utils */ "./libs/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),

/***/ "./libs/core/dispatchRequest.js":
/*!**************************************!*\
  !*** ./libs/core/dispatchRequest.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = __webpack_require__(/*! ../utils */ "./libs/utils.js"),
    isHttp = _require.isHttp;

module.exports = function dispatchRequest(config) {
  // 1. url 拼接。
  if (!isHttp(config.url)) {
    config.url = config.baseURL ? config.baseURL + config.url : config.url;
  }

  return new Promise(function (resolve, reject) {
    wx.request(_objectSpread({}, config, {
      success: function success(result) {
        resolve(result);
      },
      fail: function fail(error) {
        reject(error);
      }
    }));
  });
};

/***/ }),

/***/ "./libs/default.js":
/*!*************************!*\
  !*** ./libs/default.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  url: '',
  data: {},
  header: {},
  method: 'POST',
  dataType: 'json',
  responseType: 'text'
};

/***/ }),

/***/ "./libs/dov.js":
/*!*********************!*\
  !*** ./libs/dov.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Dov = __webpack_require__(/*! ./core/Dov */ "./libs/core/Dov.js");

var defaultConfig = __webpack_require__(/*! ./default */ "./libs/default.js");

var _require = __webpack_require__(/*! ./utils */ "./libs/utils.js"),
    bind = _require.bind,
    extend = _require.extend,
    merge = _require.merge; // 工厂模式


function createInstance(defaultConfig) {
  // 1. 创建一个上下文对象
  var ctx = new Dov(defaultConfig); // 2. 放在请求的Promise 函数中

  var instance = bind(Dov.prototype.request, ctx); // 获取原型链上的所有属性

  extend(instance, Dov.prototype, ctx); // 获取上下文所有属性

  extend(instance, ctx);
  return instance;
} // 创建单例


var dov = createInstance(defaultConfig); // 单例函数

dov.create = function (instanceConfig) {
  return createInstance(merge(defaultConfig, instanceConfig));
}; // 用于继承


dov.Dov = Dov; // Promise 的 all 方法

dov.all = function all(promises) {
  return Promise.all(promises);
};

module.exports = dov;

/***/ }),

/***/ "./libs/utils.js":
/*!***********************!*\
  !*** ./libs/utils.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isArray = Array.isArray;
/*
* 判断是否为 HTTP 请求
* @param url 请求的路径
* @return Boolean
*/

function isHttp(url) {
  return new RegExp(/^https?/).test(url);
}
/*
* 改变上下文函数的上下文对象
* @param fn 需要改变上下文的对象
* @param ctx 上下文对象
* @return wrap
*/


function bind(fn, ctx) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(ctx, args);
  };
}
/*
*   合并所有对象
*   @params Object 需要合并的对象
*   @return Object 合并后的对象
*/


function merge()
/* obj1, obj2, obj3, ... */
{
  var result = {};

  function assignValue(val, key) {
    if (_typeof(result[key]) === 'object' && _typeof(val) === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}
/*
*  对数组和对象自生属性进行遍历
*  @params obj 被遍历的对象
*  @params cb 每次遍历到一个属性就调用一次回调函数
*/


function forEach(obj, cb) {
  if (obj === null || typeof obj === 'undefined') return;

  if (_typeof(obj) !== 'object') {
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      cb.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cb.call(null, obj[key], key, obj);
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
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  bind: bind,
  merge: merge,
  forEach: forEach,
  extend: extend,
  isHttp: isHttp
};

/***/ })

/******/ });
});
//# sourceMappingURL=dov.js.map
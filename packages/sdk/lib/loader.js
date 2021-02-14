"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadScript = exports.loadStyle = exports.retry = exports.load = void 0;
function load(func) {
    var cache = {};
    function fn(url, _a) {
        var _b = _a === void 0 ? { ignoreCache: false } : _a, ignoreCache = _b.ignoreCache;
        if (!ignoreCache && cache[url]) {
            return cache[url];
        }
        var _url = url;
        if (ignoreCache) {
            _url = "" + url + (url.includes('?') ? '&' : '?') + Date.now();
        }
        var p = Promise.resolve(func(_url));
        cache[url] = p;
        p.catch(function (e) {
            cache[url] = false;
            throw e;
        });
        return p;
    }
    return fn;
}
exports.load = load;
function retry(_fn, times) {
    if (times === void 0) { times = 3; }
    var fn = function (time) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _fn.apply(void 0, args).catch(function (e) {
            if (time < times) {
                return fn.apply(void 0, __spreadArrays([time + 1], args));
            }
            else {
                throw e;
            }
        });
    };
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fn.apply(void 0, __spreadArrays([0], args));
    };
}
exports.retry = retry;
exports.loadStyle = load(function (url) {
    return new Promise(function (resolve, reject) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = function () {
            resolve();
        };
        link.onerror = function (e) {
            reject(e);
            document.head.removeChild(link);
        };
        document.head.appendChild(link);
    });
});
exports.loadScript = load(function (url) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.async = false;
        script.src = url;
        script.onload = function () {
            resolve();
        };
        script.onerror = function (e) {
            reject(e);
            document.head.removeChild(script);
        };
        document.head.appendChild(script);
    });
});

"use strict";
/**
 * @file 插件加载器
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoader = void 0;
var axios_1 = require("axios");
var events_1 = require("./events");
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
var loadStyle = retry(load(function (url) {
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
}));
var loadScript = retry(load(function (url) {
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
}));
var PluginLoader = /** @class */ (function (_super) {
    __extends(PluginLoader, _super);
    function PluginLoader(_a) {
        var _b = _a === void 0 ? { baseURL: '' } : _a, baseURL = _b.baseURL;
        var _this = _super.call(this) || this;
        _this.baseURL = '';
        _this.request = axios_1.default.create();
        _this.loadByRequest = retry(load(function (url) {
            return _this.request.get(url);
        }));
        _this.plugins = {};
        _this.pending = new Map();
        _this.setLoadBaseURL(baseURL);
        return _this;
    }
    PluginLoader.prototype.setLoadBaseURL = function (baseURL) {
        if (baseURL === void 0) { baseURL = ''; }
        if (baseURL && !baseURL.endsWith('/')) {
            this.baseURL = baseURL + '/';
        }
        else {
            this.baseURL = baseURL;
        }
        this.request.defaults.baseURL = this.baseURL;
    };
    PluginLoader.prototype.loadPluginConfig = function (pluginId) {
        return this.loadByRequest(pluginId + "/plugin.json", {
            ignoreCache: true
        });
    };
    PluginLoader.prototype.loadPlugin = function (pluginId, page) {
        var _this = this;
        if (page === void 0) { page = 'main'; }
        var key = pluginId + "/" + page;
        if (this.plugins[key]) {
            return Promise.resolve(this.plugins[key]);
        }
        if (this.pending.has(key)) {
            return this.pending.get(key);
        }
        var reject;
        var pending = new Promise(function (resolve, reject) {
            reject = reject;
            _this.once(key, function (event, plu) {
                resolve(plu);
            });
        });
        this.loadPluginConfig(pluginId).then(function (_a) {
            var _b;
            var config = _a.data;
            var files = ((_b = config[page]) === null || _b === void 0 ? void 0 : _b.files) || [];
            return Promise.all(files.map(function (_filePath) {
                var extname = ((_filePath.match(/\.[^.]+$/) || [])[0] || '').toLocaleLowerCase();
                var filePath = "" + _this.baseURL + pluginId + "/" + _filePath;
                if (extname === '.js') {
                    return loadScript(filePath);
                }
                else if (extname === '.css') {
                    return loadStyle(filePath);
                }
                else {
                    return _this.loadByRequest(filePath);
                }
            }));
        }).catch(function (e) { return reject(e); });
        this.pending.set(key, pending);
        return pending;
    };
    PluginLoader.prototype.registryPlugin = function (key, plugin) {
        this.plugins[key] = plugin;
        this.emit(key, { sender: 'loader' }, plugin);
    };
    return PluginLoader;
}(events_1.Event));
exports.PluginLoader = PluginLoader;

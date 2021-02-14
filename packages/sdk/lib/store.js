"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = exports.initStore = exports.Store = exports.StoreEvent = void 0;
var axios_1 = require("axios");
var const_1 = require("./const");
var events_1 = require("./events");
var loader_1 = require("./loader");
var utils_1 = require("./utils");
var StoreEvent = /** @class */ (function () {
    function StoreEvent(_a) {
        var defaultScope = _a.defaultScope, events = _a.events;
        this.defaultScope = '';
        this.defaultScope = defaultScope;
        this.events = events || new events_1.Event();
    }
    StoreEvent.prototype._getEventName = function (name) {
        var hasScope = name.includes(':');
        return hasScope ? name : this.defaultScope + ":" + name;
    };
    StoreEvent.prototype.on = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.on(eventName, fn);
    };
    StoreEvent.prototype.off = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.off(eventName, fn);
    };
    StoreEvent.prototype.once = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.once(eventName, fn);
    };
    StoreEvent.prototype.emit = function (name) {
        var _a;
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        var eventName = this._getEventName(name);
        (_a = this.events).emit.apply(_a, __spreadArrays([eventName, {
                sender: this.defaultScope
            }], value));
    };
    StoreEvent.prototype.emitSync = function (name) {
        var _a;
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        var eventName = this._getEventName(name);
        return (_a = this.events).emitSync.apply(_a, __spreadArrays([eventName, {
                sender: this.defaultScope
            }], value));
    };
    StoreEvent.prototype.handle = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.handle(eventName, fn);
    };
    StoreEvent.prototype.handleOnce = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.handleOnce(eventName, fn);
    };
    StoreEvent.prototype.removeHandler = function (name) {
        var eventName = this._getEventName(name);
        this.events.removeHandler(eventName);
    };
    StoreEvent.prototype.invoke = function (name) {
        var _a;
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        var eventName = this._getEventName(name);
        return (_a = this.events).invoke.apply(_a, __spreadArrays([eventName, {
                sender: this.defaultScope
            }], value));
    };
    return StoreEvent;
}());
exports.StoreEvent = StoreEvent;
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(_a) {
        var _b = _a.scope, scope = _b === void 0 ? const_1.DEFAULT_STORE : _b, plugins = _a.plugins, resolvePluginConfig = _a.resolvePluginConfig, _c = _a.retry, retry = _c === void 0 ? 0 : _c;
        var _this = _super.call(this, {
            defaultScope: 'main'
        }) || this;
        _this.name = const_1.DEFAULT_STORE;
        _this.retry = 0;
        _this.plugins = new Map();
        _this.request = axios_1.default.create();
        _this.loaded = new Map();
        _this.name = scope;
        _this.retry = retry;
        _this.resolvePluginConfig = resolvePluginConfig || _this._resolvePluginConfig.bind(_this);
        _this.addPlugins(plugins);
        return _this;
    }
    Store.prototype._resolvePluginConfig = function (pluginId) {
        return this.plugins.get(pluginId);
    };
    Store.prototype.addPlugin = function (plugin) {
        this.plugins.set(plugin.id, plugin);
    };
    Store.prototype.addPlugins = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) { return _this.addPlugin(plugin); });
    };
    Store.prototype.removePlugin = function (pluginId) {
        this.plugins.delete(pluginId);
    };
    Store.prototype.loadPlugin = function (pluginId, config) {
        var _this = this;
        if (this.loaded.has(pluginId)) {
            return this.loaded.get(pluginId).promise;
        }
        var times = (config === null || config === void 0 ? void 0 : config.retry) || this.retry || 0;
        var deferred = utils_1.defer();
        this.loaded.set(pluginId, deferred);
        Promise.resolve(this.resolvePluginConfig(pluginId)).then(function (pluginConfig) {
            var files = (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.files) || [];
            return Promise.all(files.map(function (filePath) {
                var file = filePath.split('.');
                var ext = file[file.length - 1].toLocaleLowerCase();
                if (ext.startsWith('js')) {
                    return loader_1.retry(function () { return loader_1.loadScript(filePath); }, times)();
                }
                else if (ext.startsWith('css')) {
                    return loader_1.retry(function () { return loader_1.loadStyle(filePath); }, times)();
                }
                else {
                    return loader_1.retry(function () { return _this.request.get(filePath).then(function (ret) { return ret.data; }); }, times)();
                }
            }));
        }).catch(function (e) {
            deferred.reject(e);
            _this.loaded.delete(pluginId);
        });
        return deferred.promise;
    };
    Store.prototype.resolvePlugin = function (pluginId, plugin) {
        if (!this.loaded.has(pluginId)) {
            this.loaded.set(pluginId, utils_1.defer());
        }
        this.loaded.get(pluginId).resolve(plugin);
    };
    return Store;
}(StoreEvent));
exports.Store = Store;
var _window = window;
function initStore(_a) {
    var _b = _a.scope, scope = _b === void 0 ? const_1.DEFAULT_STORE : _b, rest = __rest(_a, ["scope"]);
    _window[scope] = _window[scope] || new Store(__assign({ scope: scope }, rest));
    return _window[scope];
}
exports.initStore = initStore;
function getStore(scope) {
    if (scope === void 0) { scope = const_1.DEFAULT_STORE; }
    return _window[scope];
}
exports.getStore = getStore;

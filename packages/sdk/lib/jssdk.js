"use strict";
/**
 * @file SDK全局属性
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
exports.SDKPlugin = exports.create = exports.JSSDK = void 0;
var events_1 = require("./events");
var plugin_loader_1 = require("./plugin-loader");
var const_1 = require("./const");
var SDKEvent = /** @class */ (function () {
    function SDKEvent(_a) {
        var defaultScope = _a.defaultScope, events = _a.events;
        this.defaultScope = '';
        this.defaultScope = defaultScope;
        this.events = events || new events_1.Event();
    }
    SDKEvent.prototype._getEventName = function (name) {
        var hasScope = name.includes(':');
        return hasScope ? name : this.defaultScope + ":" + name;
    };
    SDKEvent.prototype.on = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.on(eventName, fn);
    };
    SDKEvent.prototype.off = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.off(eventName, fn);
    };
    SDKEvent.prototype.once = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.once(eventName, fn);
    };
    SDKEvent.prototype.emit = function (name) {
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
    SDKEvent.prototype.handle = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.handle(eventName, fn);
    };
    SDKEvent.prototype.handleOnce = function (name, fn) {
        var eventName = this._getEventName(name);
        this.events.handleOnce(eventName, fn);
    };
    SDKEvent.prototype.removeHandler = function (name) {
        var eventName = this._getEventName(name);
        this.events.removeHandler(eventName);
    };
    SDKEvent.prototype.invoke = function (name) {
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
    return SDKEvent;
}());
var JSSDK = /** @class */ (function (_super) {
    __extends(JSSDK, _super);
    function JSSDK(_a) {
        var _b = _a === void 0 ? {
            name: const_1.DEFAULT_SCOPE
        } : _a, name = _b.name;
        var _this = _super.call(this, {
            defaultScope: 'main'
        }) || this;
        /**
         * 路由，需要在主应用设置
         */
        _this.router = {
            basename: '',
            history: {}
        };
        _this.pluginLoader = new plugin_loader_1.PluginLoader();
        _this.name = name;
        return _this;
    }
    JSSDK.prototype.setRoot = function (root, force) {
        if (this.root && !force) {
            return;
        }
        this.root = root;
    };
    JSSDK.prototype.getRoot = function () {
        return this.root;
    };
    JSSDK.prototype.setBasename = function (basename) {
        this.router.basename = basename;
    };
    JSSDK.prototype.getBasename = function () {
        return this.router.basename;
    };
    JSSDK.prototype.setLoaderBaseURL = function (baseURL) {
        this.pluginLoader.setLoadBaseURL(baseURL);
    };
    JSSDK.prototype.getLoaderBaseURL = function () {
        return this.pluginLoader.baseURL;
    };
    JSSDK.prototype.setHistory = function (history) {
        Object.assign(this.router.history, history);
    };
    JSSDK.prototype.getHistory = function () {
        return this.router.history;
    };
    JSSDK.prototype.isInMainApp = function () {
        return !!this.root;
    };
    return JSSDK;
}(SDKEvent));
exports.JSSDK = JSSDK;
var global = window;
var create = function (scope) {
    if (scope === void 0) { scope = const_1.DEFAULT_SCOPE; }
    if (global[scope]) {
        return global[scope];
    }
    global[scope] = new JSSDK({ name: scope });
    return global[scope];
};
exports.create = create;
var SDKPlugin = /** @class */ (function (_super) {
    __extends(SDKPlugin, _super);
    function SDKPlugin(_a) {
        var sdk = _a.sdk, pluginId = _a.pluginId;
        var _this = _super.call(this, {
            defaultScope: pluginId,
            events: sdk.events
        }) || this;
        _this.sdk = sdk;
        _this.pluginId = pluginId;
        _this.scope = sdk.name;
        return _this;
    }
    SDKPlugin.prototype.getBasename = function () {
        var basename = this.sdk.getBasename();
        if (basename && !basename.endsWith('/')) {
            basename = basename + '/';
        }
        return basename + this.pluginId;
    };
    SDKPlugin.prototype.getLoaderBaseURL = function () {
        if (this.sdk.isInMainApp()) {
            return this.sdk.pluginLoader.baseURL + this.pluginId + '/';
        }
        return this.sdk.pluginLoader.baseURL;
    };
    SDKPlugin.prototype.isInMainApp = function () {
        return this.sdk.isInMainApp();
    };
    SDKPlugin.prototype.registryPlugin = function (pageId, plugin) {
        this.sdk.pluginLoader.registryPlugin(this.pluginId + "/" + pageId, plugin);
    };
    SDKPlugin.prototype.getHistory = function () {
        return this.sdk.getHistory();
    };
    return SDKPlugin;
}(SDKEvent));
exports.SDKPlugin = SDKPlugin;

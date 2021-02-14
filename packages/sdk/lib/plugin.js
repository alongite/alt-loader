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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPlugin = void 0;
var const_1 = require("./const");
var store_1 = require("./store");
var StorePlugin = /** @class */ (function (_super) {
    __extends(StorePlugin, _super);
    function StorePlugin(_a) {
        var pluginId = _a.pluginId, store = _a.store;
        var _this = _super.call(this, {
            defaultScope: pluginId,
            events: store.events
        }) || this;
        _this.pluginId = pluginId;
        _this.store = store;
        _this.scope = store.name;
        return _this;
    }
    StorePlugin.prototype.registerPlugin = function (plugin) {
        this.store.resolvePlugin(this.pluginId, plugin);
    };
    return StorePlugin;
}(store_1.StoreEvent));
function initPlugin(pluginId, scope) {
    if (scope === void 0) { scope = const_1.DEFAULT_STORE; }
    var store = store_1.getStore(scope);
    if (!store) {
        console.error("Cannot find scope: " + scope + ". Did you initStore first?");
    }
    var plugin = new StorePlugin({
        pluginId: pluginId,
        store: store || new store_1.Store({ plugins: [], scope: '' + Date.now() })
    });
    var fns = [
        'on', 'once', 'off', 'emit', 'emitSync',
        'handle', 'handleOnce', 'removeHandler',
        'invoke', 'registerPlugin'
    ];
    var exportVar = {
        scope: scope,
        pluginId: pluginId,
        isRunInStore: !!store
    };
    fns.forEach(function (key) {
        exportVar[key] = plugin[key].bind(plugin);
    });
    return exportVar;
}
exports.initPlugin = initPlugin;

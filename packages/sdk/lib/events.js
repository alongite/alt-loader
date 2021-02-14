"use strict";
/**
 * @file 应用间通讯
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event() {
        this._events = {};
        this._actions = {};
    }
    Event.prototype.on = function (name, fn) {
        var cbs = this._events[name] = this._events[name] || [];
        cbs.push(fn);
    };
    Event.prototype.off = function (name, fn) {
        if (!fn) {
            this._events[name] = null;
            return;
        }
        var cbs = this._events[name] || [];
        var i = cbs.length;
        while (i--) {
            var cb = cbs[i];
            if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
            }
        }
    };
    Event.prototype.once = function (name, fn) {
        var _this = this;
        var _fn = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            fn.apply(void 0, __spreadArrays([event], args));
            _this.off(name, _fn);
        };
        _fn.fn = fn;
        this.on(name, _fn);
    };
    Event.prototype.emit = function (name, event) {
        var value = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            value[_i - 2] = arguments[_i];
        }
        (this._events[name] || []).forEach(function (fn) {
            fn.call.apply(fn, __spreadArrays([null, event], value));
        });
    };
    Event.prototype.emitSync = function (name, event) {
        var value = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            value[_i - 2] = arguments[_i];
        }
        this.emit.apply(this, __spreadArrays([name, event], value));
        return event.returnValue;
    };
    Event.prototype.handle = function (name, fn) {
        this._actions[name] = fn;
    };
    Event.prototype.handleOnce = function (name, fn) {
        var _this = this;
        var _fn = function (event) {
            var value = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                value[_i - 1] = arguments[_i];
            }
            return new Promise(function (resolve) {
                _this._actions[name] = null;
                resolve(fn.call.apply(fn, __spreadArrays([null, event], value)));
            });
        };
        this._actions[name] = _fn;
    };
    Event.prototype.removeHandler = function (name) {
        this._actions[name] = null;
    };
    Event.prototype.invoke = function (name, event) {
        var value = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            value[_i - 2] = arguments[_i];
        }
        var fn = this._actions[name];
        if (!fn) {
            return Promise.reject("\u6CA1\u6709\u6CE8\u518C\u300C" + name + "\u300D\u5BF9\u5E94\u7684\u7684\u4E8B\u4EF6\u5904\u7406\u51FD\u6570\u3002");
        }
        return Promise.resolve(fn.call.apply(fn, __spreadArrays([null, event], value)));
    };
    return Event;
}());
exports.Event = Event;

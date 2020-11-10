"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
function stringifyJSON(obj) {
    var result = JSON.stringify(obj, function (key, val) {
        if (typeof val === 'function') {
            return val + '';
        }
        return val;
    });
    return result;
}
function create(options) {
    return "window.create(" + stringifyJSON(options) + ");";
}
exports.create = create;
function update(options) {
    return "window.update(" + stringifyJSON(options) + ");";
}
exports.update = update;

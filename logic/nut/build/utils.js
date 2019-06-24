"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPromise = isPromise;
exports.isBrowser = isBrowser;
exports.isJSX = isJSX;
exports.isObject = exports.isFunction = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var isFunction = function isFunction(obj) {
  return "function" === typeof obj;
};

exports.isFunction = isFunction;

var isObject = function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === "object";
};
/**
 * is value a promise object
 * @param {*} value
 */


exports.isObject = isObject;

function isPromise(value) {
  return isObject(value) && isFunction(value.then);
}
/**
 * judge browser environment
 */


function isBrowser() {
  return typeof window !== "undefined";
}
/**
 * judge is jsx
 */


function isJSX(jsx) {
  return "type" in jsx && "key" in jsx && "ref" in jsx;
}
//# sourceMappingURL=utils.js.map
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureReady = ensureReady;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _loadable = require("./loadable");

/**
 * This help us to get initial app state data,
 * and ensure async page component is loaded before rendering
 */
function ensureReady(_x) {
  return _ensureReady.apply(this, arguments);
}

function _ensureReady() {
  _ensureReady = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(pathname) {
    var data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _loadable.Loadable.preloadReady();

          case 2:
            if ((typeof window === "undefined" ? "undefined" : (0, _typeof2["default"])(window)) !== undefined && !!document) {
              // deserialize state from 'serialize-javascript' format
              data = eval("(".concat(document.getElementById('server-app-state').textContent, ")"));
            }

            return _context.abrupt("return", Promise.resolve(data));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ensureReady.apply(this, arguments);
}
//# sourceMappingURL=ensure-ready.js.map
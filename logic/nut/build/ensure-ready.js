"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureReady = ensureReady;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reactRouterDom = require("react-router-dom");

var utils = _interopRequireWildcard(require("./utils"));

/**
 * This help us to get initial app state data,
 * and ensure async page component is loaded before rendering
 */
function ensureReady() {
  return _ensureReady.apply(this, arguments);
}

function _ensureReady() {
  _ensureReady = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var routes,
        pathname,
        data,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            routes = _args.length > 0 && _args[0] !== undefined ? _args[0] : [];
            pathname = _args.length > 1 ? _args[1] : undefined;
            _context.prev = 2;
            _context.next = 5;
            return Promise.all(routes.map(function (route) {
              var match = (0, _reactRouterDom.matchPath)(pathname || window.location.pathname, route);

              if (match && route && route.component && route.component.load) {
                return route.component.load();
              }

              return undefined;
            }));

          case 5:
            if ((typeof window === "undefined" ? "undefined" : (0, _typeof2["default"])(window)) !== undefined && !!document) {
              // deserialize state from 'serialize-javascript' format
              data = eval("(".concat(document.getElementById('server-app-state').textContent, ")"));
            }

            return _context.abrupt("return", Promise.resolve(data));

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));
  return _ensureReady.apply(this, arguments);
}
//# sourceMappingURL=ensure-ready.js.map
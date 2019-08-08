"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadInitialProps = loadInitialProps;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reactRouterDom = require("react-router-dom");

function resolve(obj) {
  return obj && obj.__esModule ? obj["default"] : obj;
}
/**
 * load page init props
 * @param {*} routes routes config
 * @param {*} path req path
 * @param {*} ctx the context passing to page getInitialProps function as param
 */


function loadInitialProps(_x, _x2, _x3) {
  return _loadInitialProps.apply(this, arguments);
}

function _loadInitialProps() {
  _loadInitialProps = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(routes, path, ctx) {
    var initialPropsPromises, isMatchedComponent;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            initialPropsPromises = [];
            isMatchedComponent = routes.find(function (route) {
              var match = (0, _reactRouterDom.matchPath)(path, route); //if matched, judge compoent and getInitialProps is existed

              if (match && route.component && (route.component.getInitialProps || route.component.load)) {
                var component = route.component;
                initialPropsPromises.push(component.load ? component.load().then(function (component) {
                  var _resolve = resolve(component),
                      getInitialProps = _resolve.getInitialProps;

                  return getInitialProps ? getInitialProps((0, _objectSpread2["default"])({
                    match: match
                  }, ctx)) : {};
                })["catch"](function (e) {
                  console.error(e);
                }) : component.getInitialProps((0, _objectSpread2["default"])({
                  match: match
                }, ctx)));
              }

              return !!match;
            });
            _context.t0 = isMatchedComponent;
            _context.next = 5;
            return Promise.all(initialPropsPromises);

          case 5:
            _context.t1 = _context.sent[0];
            return _context.abrupt("return", {
              match: _context.t0,
              initialProps: _context.t1
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadInitialProps.apply(this, arguments);
}
//# sourceMappingURL=load-initial-props.js.map
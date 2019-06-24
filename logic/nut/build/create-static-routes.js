"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticRoutes = createStaticRoutes;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

function createStaticRoutes(routesConfig) {
  var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var children = routesConfig.props.children;
  children = Array.isArray(children) ? children : [children];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;
      var props = child.props;
      var cloneProps = (0, _objectSpread2.default)({}, props);

      if (!props.children) {
        routes.push(cloneProps);
      } else {
        delete cloneProps.children;
        cloneProps.routes = [];
        routes.push(cloneProps);
        createStaticRoutes(child, cloneProps.routes);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return routes;
}
//# sourceMappingURL=create-static-routes.js.map
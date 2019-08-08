"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = routeLoadableTransform;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

/**
 * transform route loadable component for be compatible with nut
 * @param {*} LoadableComponent the react component returned by react-loadable's loadable api 
 */
function routeLoadableTransform(LoadableComponent) {
  if (!LoadableComponent) throw new ReferenceError('please pass loadable route component paramter');
  return (
    /*#__PURE__*/
    function (_React$Component) {
      (0, _inherits2["default"])(_class, _React$Component);

      function _class() {
        (0, _classCallCheck2["default"])(this, _class);
        return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(_class).apply(this, arguments));
      }

      (0, _createClass2["default"])(_class, [{
        key: "render",
        value: function render() {
          return _react["default"].createElement(LoadableComponent, this.props);
        }
      }], [{
        key: "load",
        value: function load() {
          return LoadableComponent.preload();
        }
      }]);
      return _class;
    }(_react["default"].Component)
  );
}
//# sourceMappingURL=loadable.js.map
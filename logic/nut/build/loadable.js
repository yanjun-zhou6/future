"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Loadable = Loadable;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _react = _interopRequireDefault(require("react"));

function Loadable(opts) {
  var LoadableComponent = (0, _reactLoadable["default"])(opts);
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

Object.keys(_reactLoadable["default"]).map(function (methodName) {
  Loadable[methodName] = _reactLoadable["default"][methodName];
});
//# sourceMappingURL=loadable.js.map
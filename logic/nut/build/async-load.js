"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncLoad = asyncLoad;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

/**
 * asynchronously load component
 */
function asyncLoad(_ref) {
  var _temp;

  var loader = _ref.loader,
      Placeholder = _ref.placeholder;
  var Component = null;
  return _temp =
  /*#__PURE__*/
  function (_PureComponent) {
    (0, _inherits2.default)(AsyncComponent, _PureComponent);

    function AsyncComponent() {
      var _getPrototypeOf2;

      var _this;

      (0, _classCallCheck2.default)(this, AsyncComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(AsyncComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
        Component: null
      });
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateState", function () {
        if (_this.state.Component !== Component) {
          _this.setState({
            Component: Component
          });
        }
      });
      return _this;
    }

    (0, _createClass2.default)(AsyncComponent, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        AsyncComponent.load().then(this.updateState);
      }
    }, {
      key: "render",
      value: function render() {
        var ComponentFromState = this.state.Component;

        if (ComponentFromState) {
          return _react.default.createElement(ComponentFromState, this.props);
        }

        if (Placeholder) {
          return _react.default.createElement(Placeholder, this.props);
        }

        return null;
      }
    }], [{
      key: "getInitialProps",
      value: function getInitialProps(ctx) {
        if (Component !== null) {
          return Component.getInitialProps ? Component.getInitialProps(ctx) : Promise.resolve(null);
        }
      }
    }, {
      key: "load",
      value: function load() {
        return loader().then(function (ResolvedComponent) {
          Component = ResolvedComponent.default || ResolvedComponent;
        });
      }
    }]);
    return AsyncComponent;
  }(_react.PureComponent), _temp;
}
//# sourceMappingURL=async-load.js.map
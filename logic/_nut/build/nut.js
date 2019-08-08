"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nut = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _reactRouterDom = require("react-router-dom");

var _loadInitialProps = require("./load-initial-props");

/**
 * Find page component based url path,
 * and initial component props.
 *
 * Used by client and sever.
 * on client, require finding page component and geting initial props,
 * but not on sever, initial props as parameter come in.
 */
var NutPartial =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2["default"])(NutPartial, _PureComponent);

  function NutPartial(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, NutPartial);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(NutPartial).call(this, props));
    _this.state = {
      initialProps: props.initialProps,
      previousLocation: null
    };
    return _this;
  } // only runs client


  (0, _createClass2["default"])(NutPartial, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var navigated = nextProps.location !== this.props.location;

      if (navigated) {
        window.scrollTo(0, 0); // save the location so we can render the old screen

        this.setState({
          previousLocation: this.props.location,
          initialProps: undefined
        });
        var initialProps = nextProps.initialProps,
            match = nextProps.match,
            routes = nextProps.routes,
            history = nextProps.history,
            location = nextProps.location,
            staticContext = nextProps.staticContext,
            rest = (0, _objectWithoutProperties2["default"])(nextProps, ["initialProps", "match", "routes", "history", "location", "staticContext"]);
        (0, _loadInitialProps.loadInitialProps)(this.props.routes, location.pathname, (0, _objectSpread2["default"])({
          location: nextProps.location,
          history: nextProps.history
        }, rest)).then(function (_ref) {
          var initialProps = _ref.initialProps;

          _this2.setState({
            previousLocation: null,
            initialProps: initialProps
          });
        })["catch"](function (e) {
          // @todo we should more cleverly handle errors
          console.log(e);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          previousLocation = _this$state.previousLocation,
          initialProps = _this$state.initialProps;
      var _this$props = this.props,
          location = _this$props.location,
          routes = _this$props.routes;
      return _react["default"].createElement(_reactRouterDom.Switch, null, routes.map(function (route, i) {
        return _react["default"].createElement(_reactRouterDom.Route, {
          key: "route--".concat(i),
          path: route.path,
          exact: route.exact,
          strict: route.strict,
          location: previousLocation || location,
          render: function render(props) {
            return _react["default"].createElement(route.component, (0, _objectSpread2["default"])({}, initialProps, {
              history: props.history,
              location: previousLocation || location,
              match: props.match
            }));
          }
        });
      }));
    }
  }]);
  return NutPartial;
}(_react.PureComponent);

var Nut = (0, _reactRouterDom.withRouter)(NutPartial);
exports.Nut = Nut;
//# sourceMappingURL=nut.js.map
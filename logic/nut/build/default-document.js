"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NutRoot = NutRoot;
exports.NutData = NutData;
exports.DefaultDocument = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _serializeJavascript = _interopRequireDefault(require("serialize-javascript"));

var _webpack = require("../webpack");

/**
 * default document component
 * used to create init page template
 */
var DefaultDocument =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2["default"])(DefaultDocument, _PureComponent);

  function DefaultDocument() {
    (0, _classCallCheck2["default"])(this, DefaultDocument);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DefaultDocument).apply(this, arguments));
  }

  (0, _createClass2["default"])(DefaultDocument, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          helmet = _this$props.helmet,
          assets = _this$props.assets,
          dynamicBundles = _this$props.dynamicBundles,
          initialProps = _this$props.initialProps; // get attributes from React Helmet

      var htmlAttrs = helmet.htmlAttributes.toComponent();
      var bodyAttrs = helmet.bodyAttributes.toComponent();
      var styles = dynamicBundles.filter(function (bundle) {
        return bundle.file.endsWith('.css');
      });
      var scripts = dynamicBundles.filter(function (bundle) {
        return bundle.file.endsWith('.js');
      });
      return _react["default"].createElement("html", htmlAttrs, _react["default"].createElement("head", null, _react["default"].createElement("meta", {
        httpEquiv: "X-UA-Compatible",
        content: "IE=edge"
      }), _react["default"].createElement("meta", {
        charSet: "utf-8"
      }), _react["default"].createElement("title", null, "Welcome to Nut"), _react["default"].createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), helmet.title.toComponent(), helmet.meta.toComponent(), helmet.link.toComponent(), assets.client.css && _react["default"].createElement("link", {
        rel: "stylesheet",
        href: assets.client.css
      }), styles.map(function (style) {
        return _react["default"].createElement("link", {
          href: style.file,
          rel: "stylesheet"
        });
      })), _react["default"].createElement("body", bodyAttrs, _react["default"].createElement(NutRoot, null), _react["default"].createElement(NutData, {
        initialProps: initialProps
      }), _react["default"].createElement("script", {
        type: "text/javascript",
        src: assets.client.js,
        defer: true,
        crossOrigin: "anonymous"
      }), scripts.map(function (script) {
        return _react["default"].createElement("script", {
          src: script.file
        });
      }), helmet.script.toComponent()));
    }
  }], [{
    key: "getInitialProps",
    value: function () {
      var _getInitialProps = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var assets, dynamicAssets, initialProps, renderPage, page, dynamicBundles;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                assets = _ref.assets, dynamicAssets = _ref.dynamicAssets, initialProps = _ref.initialProps, renderPage = _ref.renderPage;
                _context.next = 3;
                return renderPage();

              case 3:
                page = _context.sent;
                dynamicBundles = (0, _webpack.getBundles)(dynamicAssets, page.dynamicModules || []);
                return _context.abrupt("return", (0, _objectSpread2["default"])({
                  assets: assets,
                  dynamicAssets: dynamicAssets,
                  initialProps: initialProps,
                  dynamicBundles: dynamicBundles
                }, page));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getInitialProps(_x) {
        return _getInitialProps.apply(this, arguments);
      }

      return getInitialProps;
    }()
  }]);
  return DefaultDocument;
}(_react.PureComponent);

exports.DefaultDocument = DefaultDocument;

function NutRoot() {
  return _react["default"].createElement("div", {
    id: "root"
  }, "DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP");
}

function NutData(_ref2) {
  var initialProps = _ref2.initialProps;
  return _react["default"].createElement("script", {
    id: "server-app-state",
    type: "application/json",
    dangerouslySetInnerHTML: {
      __html: (0, _serializeJavascript["default"])((0, _objectSpread2["default"])({}, initialProps))
    }
  });
}
//# sourceMappingURL=default-document.js.map
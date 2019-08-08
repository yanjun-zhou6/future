"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _defaultDocument = require("./default-document");

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactHelmet = _interopRequireDefault(require("react-helmet"));

var _nut = require("./nut");

var utils = _interopRequireWildcard(require("./utils"));

var _loadInitialProps = require("./load-initial-props");

/**
 * rendering function on server
 *
 * match route config by req.url and find relative page Component
 * call Component.getInitProps to get page init data, so we can render
 * page to html. render Document Compoent wrapping page's html to html
 * and send it to client
 */
function render(_x) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref) {
    var req, res, routes, document, assets, customRenderer, rest, Doc, context, _ref2, match, initialProps, renderPage, reactRouterMatch, _ref4, html, docProps, doc;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            req = _ref.req, res = _ref.res, routes = _ref.routes, document = _ref.document, assets = _ref.assets, customRenderer = _ref.customRenderer, rest = (0, _objectWithoutProperties2["default"])(_ref, ["req", "res", "routes", "document", "assets", "customRenderer"]);
            Doc = document || _defaultDocument.DefaultDocument;
            context = {};
            _context2.next = 5;
            return (0, _loadInitialProps.loadInitialProps)(routes, req.path, (0, _objectSpread2["default"])({
              req: req,
              res: res
            }, rest));

          case 5:
            _ref2 = _context2.sent;
            match = _ref2.match;
            initialProps = _ref2.initialProps;

            if (match) {
              _context2.next = 11;
              break;
            }

            res.status(404);
            return _context2.abrupt("return");

          case 11:
            if (!(match.path === "**")) {
              _context2.next = 15;
              break;
            }

            res.status(404);
            _context2.next = 18;
            break;

          case 15:
            if (!(match && match.redirectTo && match.path)) {
              _context2.next = 18;
              break;
            }

            res.redirect(301, req.originalUrl.replace(match.path, match.redirectTo));
            return _context2.abrupt("return");

          case 18:
            renderPage =
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee() {
                var fn,
                    defaultRenderer,
                    renderer,
                    asyncOrSyncRender,
                    renderedContent,
                    helmet,
                    _args = arguments;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        fn = _args.length > 0 && _args[0] !== undefined ? _args[0] : modPage;

                        // By default, we keep ReactDOMServer synchronous renderToString function
                        defaultRenderer = function defaultRenderer(element) {
                          return {
                            html: _server["default"].renderToString(element)
                          };
                        };

                        renderer = customRenderer || defaultRenderer;
                        asyncOrSyncRender = renderer(_react["default"].createElement(_reactRouterDom.StaticRouter, {
                          location: req.url,
                          context: context
                        }, fn(_nut.Nut)({
                          routes: routes,
                          initialProps: initialProps
                        })));

                        if (!utils.isPromise(asyncOrSyncRender)) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 7;
                        return asyncOrSyncRender;

                      case 7:
                        _context.t0 = _context.sent;
                        _context.next = 11;
                        break;

                      case 10:
                        _context.t0 = asyncOrSyncRender;

                      case 11:
                        renderedContent = _context.t0;
                        helmet = _reactHelmet["default"].renderStatic();
                        return _context.abrupt("return", (0, _objectSpread2["default"])({
                          helmet: helmet
                        }, renderedContent));

                      case 14:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function renderPage() {
                return _ref3.apply(this, arguments);
              };
            }();

            reactRouterMatch = (0, _reactRouterDom.matchPath)(req.url, match);
            _context2.next = 22;
            return Doc.getInitialProps((0, _objectSpread2["default"])({
              req: req,
              res: res,
              assets: assets,
              renderPage: renderPage,
              initialProps: initialProps,
              match: reactRouterMatch,
              helmet: _reactHelmet["default"].renderStatic()
            }, rest));

          case 22:
            _ref4 = _context2.sent;
            html = _ref4.html;
            docProps = (0, _objectWithoutProperties2["default"])(_ref4, ["html"]);
            doc = _server["default"].renderToStaticMarkup(_react["default"].createElement(Doc, docProps));
            return _context2.abrupt("return", "<!doctype html>".concat(doc.replace("DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP", html)));

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _render.apply(this, arguments);
}

function modPage(Page) {
  return function (props) {
    return _react["default"].createElement(Page, props);
  };
}
//# sourceMappingURL=render.js.map
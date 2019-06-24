"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * Model base class
 */
var asyncActionFactry = Symbol("asyncActionFactry");

var Model =
/*#__PURE__*/
function () {
  function Model() {
    (0, _classCallCheck2["default"])(this, Model);
  }

  (0, _createClass2["default"])(Model, [{
    key: asyncActionFactry,
    value: function value(asyncFunc, namespace) {
      var that = this;
      return function () {
        var passArgument = Array.prototype.slice.call(arguments);
        return function (dispatch, getState) {
          var customDispatch = function customDispatch(action) {
            var type = action.type;
            type = /\//.test(type) ? type : "".concat(namespace, "/").concat(action.type);
            dispatch((0, _objectSpread2["default"])({}, action, {
              type: type
            }));
          };

          that.dispatch = customDispatch;
          that.getState = getState;
          return asyncFunc.apply(that, (0, _toConsumableArray2["default"])(passArgument));
        };
      };
    }
  }, {
    key: "createActions",
    value: function createActions() {
      var _this = this;

      var _this$reducers = this.reducers,
          reducers = _this$reducers === void 0 ? {} : _this$reducers,
          _this$namespace = this.namespace,
          namespace = _this$namespace === void 0 ? "app" : _this$namespace,
          _this$actions = this.actions,
          actions = _this$actions === void 0 ? {} : _this$actions;
      var normalActions = {};
      Object.keys(reducers).reduce(function (lastActions, reducerName) {
        lastActions[reducerName] = function () {
          return {
            type: "".concat(namespace, "/").concat(reducerName),
            payload: arguments[0]
          };
        };

        return lastActions;
      }, normalActions);
      var asyncActions = {};
      Object.keys(actions).reduce(function (lastActions, actionName) {
        lastActions[actionName] = _this[asyncActionFactry](actions[actionName], namespace);
        return lastActions;
      }, asyncActions);
      this.actions = (0, _objectSpread2["default"])({}, normalActions, asyncActions);
    }
  }], [{
    key: "merge",
    value: function merge(source, target) {
      var state = source.state,
          actions = source.actions,
          reducers = source.reducers;
      var tState = target.state,
          tActions = target.actions,
          tReducers = target.reducers,
          namespace = target.namespace,
          tOthers = (0, _objectWithoutProperties2["default"])(target, ["state", "actions", "reducers", "namespace"]);
      return (0, _objectSpread2["default"])({}, source, {
        state: (0, _objectSpread2["default"])({}, state, tState),
        actions: (0, _objectSpread2["default"])({}, actions, tActions),
        reducers: (0, _objectSpread2["default"])({}, reducers, tReducers)
      }, tOthers);
    }
  }]);
  return Model;
}();

exports.Model = Model;
(0, _defineProperty2["default"])(Model, "getInstance", function (clazz) {
  var instance = new clazz();
  instance.createActions();
  return instance;
});
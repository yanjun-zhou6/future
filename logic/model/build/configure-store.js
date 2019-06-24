"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushModel = pushModel;
exports.configModel = configModel;
exports.createStore = createStore;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _model = require("./model");

var reducerMap = {};

function createReducer(initialState, handlers) {
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
/**
 * push model and create reducer to reducer map
 */


function pushModel(model) {
  var _model$namespace = model.namespace,
      namespace = _model$namespace === void 0 ? "app" : _model$namespace,
      reducers = model.reducers,
      _model$state = model.state,
      state = _model$state === void 0 ? {} : _model$state;
  var renameReducers = {};
  Object.keys(reducers || {}).reduce(function (lastRenameReducers, currentValue) {
    lastRenameReducers["".concat(namespace, "/").concat(currentValue)] = reducers[currentValue];
    return lastRenameReducers;
  }, renameReducers);
  reducerMap[namespace] = createReducer(state, renameReducers);
}
/**
 * create Store with collect reducer map
 */


function createStore() {
  var param = arguments[0]; //if paramter is webpackContext function, config models and return create store function

  if (param.name === "webpackContext") {
    configModel(param);
    return function (preloadedState) {
      return (0, _redux.createStore)((0, _redux.combineReducers)(reducerMap), preloadedState, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk["default"]), process.env.BUILD_TARGET === "client" ? window.devToolsExtension ? window.devToolsExtension() : function (f) {
        return f;
      } : function (f) {
        return f;
      }));
    };
  } //if no webpackContext function, create and return store


  return (0, _redux.createStore)((0, _redux.combineReducers)(reducerMap), param, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk["default"]), process.env.BUILD_TARGET === "client" ? window.devToolsExtension ? window.devToolsExtension() : function (f) {
    return f;
  } : function (f) {
    return f;
  }));
}
/**
 * config an directory contains all model files for collecting these models
 * and create reducer per model, into reducer map.
 */


function configModel(requireModels) {
  requireModels.keys().forEach(function (filename) {
    pushModel(requireModels(filename)["default"]);
  });
}
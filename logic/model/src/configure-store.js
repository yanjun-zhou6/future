import {
  applyMiddleware,
  compose,
  createStore as reduxCreateStore
} from "redux";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import { Model } from "./model";

const reducerMap = {};

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
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
  const { namespace = "app", reducers, state = {} } = model;
  const renameReducers = {};
  Object.keys(reducers || {}).reduce((lastRenameReducers, currentValue) => {
    lastRenameReducers[`${namespace}/${currentValue}`] = reducers[currentValue];
    return lastRenameReducers;
  }, renameReducers);

  reducerMap[namespace] = createReducer(state, renameReducers);
}

/**
 * create Store with collect reducer map
 */
function createStore() {
  const param = arguments[0];
  //if paramter is webpackContext function, config models and return create store function
  if (param.name === "webpackContext") {
    configModel(param);
    return preloadedState => {
      return reduxCreateStore(
        combineReducers(reducerMap),
        preloadedState,
        compose(
          applyMiddleware(thunk),
          process.env.BUILD_TARGET === "client"
            ? window.devToolsExtension
              ? window.devToolsExtension()
              : f => f
            : f => f
        )
      );
    };
  }
  //if no webpackContext function, create and return store
  return reduxCreateStore(
    combineReducers(reducerMap),
    param,
    compose(
      applyMiddleware(thunk),
      process.env.BUILD_TARGET === "client"
        ? window.devToolsExtension
          ? window.devToolsExtension()
          : f => f
        : f => f
    )
  );
}

/**
 * config an directory contains all model files for collecting these models
 * and create reducer per model, into reducer map.
 */
function configModel(requireModels) {
  requireModels.keys().forEach(filename => {
    pushModel(requireModels(filename).default);
  });
}

export { pushModel, configModel, createStore };

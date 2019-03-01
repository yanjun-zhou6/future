import App, { configureStore, staticRoutes } from "./App";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router";
import { RouteDataLoader } from "utils/hoc/route-data-loader";
import createBrowserHistory from "history/createBrowserHistory";

const store = configureStore.createStore(window.__PRELOADED_STATE__);
export const history = new createBrowserHistory();

export default function root() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <RouteDataLoader routes={staticRoutes} store={store}>
          <App />
        </RouteDataLoader>
      </Router>
    </Provider>
  );
}

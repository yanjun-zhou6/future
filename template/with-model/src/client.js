import React from "react";
import { hydrate } from "react-dom";
import { ensureReady, Nut } from "@geetemp/nut";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import routes from "./routes";
import createStore from "./create-store";

const store = createStore(
  eval(`(${document.getElementById("server-store-state").textContent})`)
);

const history = new createBrowserHistory();

function Root({ initialProps }) {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Nut initialProps={initialProps} routes={routes} store={store} />
      </Router>
    </Provider>
  );
}

ensureReady(routes).then(initialProps => {
  return hydrate(
    <Root initialProps={initialProps} />,
    document.getElementById("root")
  );
});

if (module.hot) {
  module.hot.accept();
}

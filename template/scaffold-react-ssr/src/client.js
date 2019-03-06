import React from "react";
import { hydrate } from "react-dom";
import { ensureReady, Nut } from "nut";
import routes from "./routes";
import { Router } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";

export const history = new createBrowserHistory();

ensureReady(routes).then(initialProps =>
  hydrate(
    <Router history={history}>
      <Nut initialProps={initialProps} routes={routes} abc="asd" />
    </Router>,
    document.getElementById("root")
  )
);

if (module.hot) {
  module.hot.accept();
}

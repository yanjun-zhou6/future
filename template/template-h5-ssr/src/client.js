import React from "react";
import { hydrate } from "react-dom";
import { ensureReady, Nut } from "@geetemp/nut";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import routes from "./routes";
import "assets/styles/global.scss";
import InitAppData from "utils/hoc/init-app-data";
import { WXLoader } from "utils/hoc/wx-router-loader";

import createStore from "./create-store";

const store = createStore(
  eval(`(${document.getElementById("server-store-state").textContent})`)
);

export const history = new createBrowserHistory();
// var attachFastClick = require('fastclick');
// // attachFastClick(window.document.body);
// if ('addEventListener' in window.document) {
//   window.document.addEventListener('DOMContentLoaded', function() {
//     console.log("dds", window.FastClick, document.body)
//     attachFastClick.attach(window.document.body);
//   }, false)
// }

function Root({ initialProps }) {
  return (
    <Provider store={store}>
      <InitAppData>
        <Router history={history}>
          <WXLoader routes={routes}>
            <Nut initialProps={initialProps} routes={routes} store={store} />
          </WXLoader>
        </Router>
      </InitAppData>
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

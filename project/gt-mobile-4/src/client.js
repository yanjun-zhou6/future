import React from "react";
import { hydrate } from "react-dom";
import { ensureReady, Nut } from "nut";
import routes from "./routes";
import { BrowserRouter } from "react-router-dom";

ensureReady(routes).then(initialProps =>
  hydrate(
    <BrowserRouter>
      <Nut initialProps={initialProps} routes={routes} />
    </BrowserRouter>,
    document.getElementById("root")
  )
);

if (module.hot) {
  module.hot.accept();
}

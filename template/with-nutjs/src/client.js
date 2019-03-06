import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ensureReady, Nut } from "nut";
import "./client.css";
import routes from "./routes";

ensureReady(routes).then(initialProps =>
  hydrate(
    <BrowserRouter>
      <Nut initialProps={initialProps} routes={routes} abc="asd" />
    </BrowserRouter>,
    document.getElementById("root")
  )
);

if (module.hot) {
  module.hot.accept();
}

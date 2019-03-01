import React from "react";
import { hydrate } from "react-dom";
import root from "./root";

const render = Component => {
  hydrate(<Component />, document.getElementById("root"));
};

render(root);

if (module.hot) {
  module.hot.accept("./root", () => {
    render(require("./root").default);
  });
}

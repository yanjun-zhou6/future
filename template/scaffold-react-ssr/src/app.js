import React from "react";
import { renderRoutes } from "react-router-config";
import configureStore from "store";
import routes from "routes";
import "assets/styles/global.scss";
import createStaticRoutes from "utils/createStaticRoutes";

const requireModels = require.context("./store/reducers", false, /\.js$/);
requireModels.keys().forEach(filename => {
  configureStore.pushModel(requireModels(filename).default);
});

let staticRoutes = createStaticRoutes(routes());
const App = () => <React.Fragment>{renderRoutes(staticRoutes)}</React.Fragment>;

export default App;
export { configureStore, staticRoutes };

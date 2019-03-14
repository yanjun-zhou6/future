import configureStore from "store";

const requireModels = require.context("./store/reducers", false, /\.js$/);
requireModels.keys().forEach(filename => {
  configureStore.pushModel(requireModels(filename).default);
});

export default configureStore;

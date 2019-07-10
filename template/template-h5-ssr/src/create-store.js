import { createStore } from "@geetemp/model";
export default createStore(require.context("./models", false, /\.js$/));

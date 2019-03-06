import React from "react";
import { asyncLoad } from "nut";
import { Switch, Route } from "react-router-dom";

export default (
  <Switch>
    <Route
      path="/"
      exact
      component={asyncLoad({
        loader: () => import("./Home"),
        placeholder: () => <p>加载中...</p>
      })}
    />
    <Route
      path="/about/:id?/:rr?"
      exact
      component={asyncLoad({
        loader: () => import("./About"),
        placeholder: () => <p>加载中...</p>
      })}
    />
  </Switch>
);

import React from "react";
import { Switch, Route } from "react-router-dom";
import { createStaticRoutes, asyncLoad } from "@geetemp/nut";
import ErrorPage from "pages/500";
import NotFoundPage from "pages/404";

import Home from "pages/home";

export default createStaticRoutes(
  <Switch>
    <Route path="/" exact component={Home} />

    <Route
      path="/tictactoe"
      component={asyncLoad({
        loader: () => import("pages/tic-tac-toe"),
        placeholder: () => <p>加载中...</p>
      })}
    />
    <Route path="/500" component={ErrorPage} />
    <Route component={NotFoundPage} />
  </Switch>
);

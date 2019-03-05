import React from "react";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "pages/404";
import ErrorPage from "pages/500";
import Index from "pages/Index";
import TicTacToe from "pages/tic-tac-toe";
import TicTacToeChild from "pages/tic-tac-toe-child";

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Index} />
    <Route path="/tictactoe" component={TicTacToe} />
    <Route path="/500" component={ErrorPage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default Routes;

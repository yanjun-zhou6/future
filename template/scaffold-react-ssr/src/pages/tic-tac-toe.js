import React, { Component } from "react";
import Board from "components/board";
import { Link } from "react-router-dom";
import "./tic-tac-toe.scss";

export default class TicTacToe extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { histories: [{ squares: Array(9).fill("X", 7, 9) }] };
  }

  render() {
    const { histories } = this.props;
    const current = (histories && histories[0]) || [];

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} />
          <Link to="/">home -》</Link>
        </div>
      </div>
    );
  }
}

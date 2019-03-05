import React, { Component } from "react";
import Board from "components/board";
import "./tic-tac-toe.scss";

export default class TicTacToe extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { history: [{ squares: Array(9).fill("X", 7, 9) }] };
  }

  render() {
    const { history } = this.props;
    const current = history[0];

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} />
        </div>
      </div>
    );
  }
}

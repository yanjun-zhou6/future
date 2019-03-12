import React, { Component } from "react";
import logo from "assets/imgs/logo.svg";
import "./home.scss";
import { Button } from "gee-ui-mobile";
import { Link } from "react-router-dom";

class Home extends Component {
  static async getInitialProps({ req, res, match, history, location, ...ctx }) {
    return { whatever: "stuff" };
  }

  render() {
    const { whatever } = this.props;
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to scaffold-react-ssr2 see</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/Home.js</code> or{" "}
          <code>src/Tictactoe.js</code>and save to reload.
        </p>
        <p>{whatever}</p>
        <Button>hello</Button>
        <Link to="/tictactoe">Tictactoe -></Link>
      </div>
    );
  }
}

export default Home;

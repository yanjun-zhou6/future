import React, {Component} from 'react';
import logo from './react.svg';
import {Link} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './Loading';
import './Home.css';

const LoadableExample = Loadable ({
  loader: () => import ('./Example'),
  loading: Loading,
});

class Home extends Component {
  static async getInitialProps({req, res, match, history, location, ...ctx}) {
    return {whatever: 'stuff'};
  }

  render () {
    const {whatever} = this.props;
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Nut</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/Home.js</code> or{' '}
          <code>src/About.js</code>and save to reload.
        </p>
        <LoadableExample />
        <p>{whatever}</p>
        <Link to="/about">About -></Link>
      </div>
    );
  }
}

export default Home;

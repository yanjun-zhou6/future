import React from 'react';
import Loadable from 'react-loadable';
import Loading from './Loading';

const LoadableNested = Loadable ({
  loader: () => import ('./ExampleNested'),
  loading: Loading,
});

export default class Example extends React.Component {
  state = {
    Nestd: false,
  };

  render () {
    return (
      <div>
        <h1>Hello from a loadable component</h1>
        {this.state.Nestd && <LoadableNested />}
        <button
          onClick={() => {
            this.setState ({Nestd: true});
          }}
        >
          click me
        </button>
      </div>
    );
  }
}

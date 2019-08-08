import ReactLoadable from 'react-loadable';
import React from 'react';

export function Loadable (opts) {
  const LoadableComponent = ReactLoadable (opts);

  return class extends React.Component {
    static load () {
      return LoadableComponent.preload ();
    }

    render () {
      return <LoadableComponent {...this.props} />;
    }
  };
}

Object.keys (ReactLoadable).map (methodName => {
  Loadable[methodName] = ReactLoadable[methodName];
});
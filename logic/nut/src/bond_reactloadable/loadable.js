import React from 'react';

/**
 * transform route loadable component for be compatible with nut
 * @param {*} LoadableComponent the react component returned by react-loadable's loadable api 
 */
export default function routeLoadableTransform (LoadableComponent) {
  if (!LoadableComponent)
    throw new ReferenceError ('please pass loadable route component paramter');
  return class extends React.Component {
    static load () {
      return LoadableComponent.preload ();
    }

    render () {
      return <LoadableComponent {...this.props} />;
    }
  };
}

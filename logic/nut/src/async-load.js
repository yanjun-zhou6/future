import React, { PureComponent } from "react";

/**
 * asynchronously load component
 */
export function asyncLoad({ loader, placeholder: Placeholder }) {
  let Component = null;
  return class AsyncComponent extends PureComponent {
    state = {
      Component: null
    };

    static getInitialProps(ctx) {
      if (Component !== null) {
        return Component.getInitialProps
          ? Component.getInitialProps(ctx)
          : Promise.resolve(null);
      }
    }

    static load() {
      return loader().then(ResolvedComponent => {
        Component = ResolvedComponent.default || ResolvedComponent;
      });
    }

    componentWillMount() {
      AsyncComponent.load().then(this.updateState);
    }

    updateState = () => {
      if (this.state.Component !== Component) {
        this.setState({
          Component
        });
      }
    };

    render() {
      const { Component: ComponentFromState } = this.state;

      if (ComponentFromState) {
        return <ComponentFromState {...this.props} />;
      }

      if (Placeholder) {
        return <Placeholder {...this.props} />;
      }

      return null;
    }
  };
}

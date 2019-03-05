import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import loadInitialProps from "./load-initial-props";

/**
 * Find page component based url path,
 * and initial component props.
 *
 * Used by client and sever.
 * on client, require finding page component and geting initial props,
 * but not on sever, initial props as parameter come in.
 */
class NutPartial extends PureComponent {
  state = {
    initialProps: props.initialProps,
    previousLocation: null
  };

  static getDerivedStateFromProps(props, state) {
    //if location change
    if (props.location !== state.location) {
      window.scrollTo(0, 0);
      // save the location so we can render the old screen
      state.previousLocation = props.location;
      state.initialProps = undefined;

      const {
        initialProps,
        match,
        routes,
        history,
        location,
        staticContext,
        ...rest
      } = props;

      loadInitialProps(routes, location.pathname, {
        location,
        history,
        match,
        rest
      })
        .then(({ initialProps }) => {
          state.initialProps = initialProps;
          state.previousLocation = null;
        })
        .catch(e => {
          // @todo we should more cleverly handle errors
          console.error(e);
        });
      state.location = props.location;
    }
  }

  render() {
    const { previousLocation, initialProps } = this.state;
    const { routes, location } = this.props;
    return (
      <Switch>
        {routes.map((route, i) => (
          <Route
            key={`route--${i}`}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            location={previousLocation || location}
            render={props => {
              React.createElement(route.component, {
                ...initialProps,
                history: props.history,
                location: previousLocation || location,
                match: props.match
              });
            }}
          />
        ))}
      </Switch>
    );
  }
}

export const Nut = withRouter(NutPartial);

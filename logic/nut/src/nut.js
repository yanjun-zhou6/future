import React, { PureComponent } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { loadInitialProps } from "./load-initial-props";
import { createStaticRoutes } from "./create-static-routes";
import * as utils from "./utils";

/**
 * Find page component based url path,
 * and initial component props.
 *
 * Used by client and sever.
 * on client, require finding page component and geting initial props,
 * but not on sever, initial props as parameter come in.
 */
class NutPartial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initialProps: props.initialProps,
      previousLocation: null
    };
    this.routes = utils.isJSX(props.routes)
      ? createStaticRoutes(props.routes)
      : props.routes;
  }

  // only runs client
  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      // save the location so we can render the old screen
      this.setState({
        previousLocation: this.props.location,
        initialProps: undefined
      });

      const {
        initialProps,
        match,
        routes,
        history,
        location,
        staticContext,
        ...rest
      } = nextProps;

      loadInitialProps(this.routes, location.pathname, {
        location: nextProps.location,
        history: nextProps.history,
        ...rest
      })
        .then(({ initialProps }) => {
          this.setState({ previousLocation: null, initialProps });
        })
        .catch(e => {
          // @todo we should more cleverly handle errors
          console.log(e);
        });
    }
  }

  render() {
    const { previousLocation, initialProps } = this.state;
    const { location } = this.props;
    return (
      <Switch>
        {this.routes.map((route, i) => (
          <Route
            key={`route--${i}`}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            location={previousLocation || location}
            render={props =>
              React.createElement(route.component, {
                ...initialProps,
                history: props.history,
                location: previousLocation || location,
                match: props.match
              })
            }
          />
        ))}
      </Switch>
    );
  }
}

export const Nut = withRouter(NutPartial);

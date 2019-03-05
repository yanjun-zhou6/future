import { matchPath } from "react-router-dom";

/**
 * load page init props
 * @param {*} routes routes config
 * @param {*} path req path
 * @param {*} ctx the context passing to page getInitialProps function as param
 */
export async function loadInitialProps(routes, path, ctx) {
  const initialPropsPromises = [];

  const isMatchedComponent = routes.find(route => {
    const match = matchPath(path, route);
    //if matched, judge compoent and getInitialProps is existed
    if (match && route.Component && route.Component.getInitialProps) {
      const Component = route.Component;
      initialPropsPromises.push(Component.getInitialProps({ match, ...ctx }));
    }

    return !!match;
  });

  return {
    match: isMatchedComponent,
    initialProps: (await Promise.all(initialPropsPromises))[0]
  };
}

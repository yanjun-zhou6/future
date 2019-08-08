import {matchPath} from 'react-router-dom';

function resolve (obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

/**
 * load page init props
 * @param {*} routes routes config
 * @param {*} path req path
 * @param {*} ctx the context passing to page getInitialProps function as param
 */
export async function loadInitialProps (routes, path, ctx) {
  const initialPropsPromises = [];

  const isMatchedComponent = routes.find (route => {
    const match = matchPath (path, route);
    //if matched, judge compoent and getInitialProps is existed
    if (
      match &&
      route.component &&
      (route.component.getInitialProps || route.component.load)
    ) {
      const component = route.component;
      initialPropsPromises.push (
        component.load
          ? component
              .load ()
              .then (component => {
                const {getInitialProps} = resolve (component);
                return getInitialProps ? getInitialProps ({match, ...ctx}) : {};
              })
              .catch (e => {
                console.error (e);
              })
          : component.getInitialProps ({match, ...ctx})
      );
    }

    return !!match;
  });

  return {
    match: isMatchedComponent,
    initialProps: (await Promise.all (initialPropsPromises))[0],
  };
}

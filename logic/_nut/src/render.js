import React from 'react';
import {matchPath, StaticRouter} from 'react-router-dom';
import {DefaultDocument} from './default-document';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import {Nut} from './nut';
import * as utils from './utils';
import {loadInitialProps} from './load-initial-props';
import {Loadable} from './loadable';

/**
 * rendering function on server
 *
 * match route config by req.url and find relative page Component
 * call Component.getInitProps to get page init data, so we can render
 * page to html. render Document Compoent wrapping page's html to html
 * and send it to client
 */
export async function render({
  req,
  res,
  routes,
  document,
  assets,
  dynamicAssets,
  customRenderer,
  ...rest
}) {
  const Doc = document || DefaultDocument;
  const context = {};
  const {match, initialProps} = await loadInitialProps (routes, req.path, {
    req,
    res,
    ...rest,
  });

  if (!match) {
    res.status (404);
    return;
  }

  if (match.path === '**') {
    res.status (404);
  } else if (match && match.redirectTo && match.path) {
    res.redirect (301, req.originalUrl.replace (match.path, match.redirectTo));
    return;
  }

  const renderPage = async (fn = modPage) => {
    const dynamicModules = [];
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = element => ({
      html: ReactDOMServer.renderToString (element),
    });
    const renderer = customRenderer || defaultRenderer;
    const asyncOrSyncRender = renderer (
      <StaticRouter location={req.url} context={context}>
        <Loadable.Capture
          report={moduleName => dynamicModules.push (moduleName)}
        >
          {fn (Nut) ({routes, initialProps})}
        </Loadable.Capture>
      </StaticRouter>
    );

    const renderedContent = utils.isPromise (asyncOrSyncRender)
      ? await asyncOrSyncRender
      : asyncOrSyncRender;
    const helmet = Helmet.renderStatic ();

    return {helmet, ...renderedContent, dynamicModules};
  };

  const reactRouterMatch = matchPath (req.url, match);

  const {html, ...docProps} = await Doc.getInitialProps ({
    req,
    res,
    assets,
    dynamicAssets,
    renderPage,
    initialProps,
    match: reactRouterMatch,
    helmet: Helmet.renderStatic (),
    ...rest,
  });

  const doc = ReactDOMServer.renderToStaticMarkup (<Doc {...docProps} />);
  return `<!doctype html>${doc.replace ('DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP', html)}`;
}

function modPage (Page) {
  return props => <Page {...props} />;
}

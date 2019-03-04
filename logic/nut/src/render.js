import { matchPath, StaticRouter } from "react-router-dom";
import DefaultDocument from "./default-document";
import Helmet from "react-helmet";
import Nut from "./nut";
import * as utils from './utils';
import loadInitialProps from "./load-Init-props";

/**
 * rendering function on server
 *
 * match route config by req.url and find relative page Component
 * call Component.getInitProps to get page init data, so we can render
 * page to html. render Document Compoent wrapping page's html to html
 * and send it to client
 */
function render({ req, res, routes, Document, assets, customRenderer, ...rest }) {
  const Doc = Document || DefaultDocument;
  const context = {};

  const { matched, initialProps } = loadInitialProps(routes, req.url, {
    req,
    res,
    ...rest
  });

  if (!matched) {
    res.status(404);
    return;
  }

  if (match.path === "**") {
    res.status(404);
  } else if (match && match.redirectTo && match.path) {
    res.redirect(301, req.originalUrl.replace(match.path, match.redirectTo));
    return;
  }

  const renderPage = async (fn = modPage) => {
    // By default, we keep ReactDOMServer synchronous renderToString function
    const defaultRenderer = (element) => ({ html: ReactDOMServer.renderToString(element) });
    const renderer = customRenderer || defaultRenderer;
    const asyncOrSyncRender = renderer(
      <StaticRouter location={req.url} context={context}>
        {fn(Nut)({ routes, initialProps })}
      </StaticRouter>
    );

    const renderedContent = utils.isPromise(asyncOrSyncRender) ? await asyncOrSyncRender : asyncOrSyncRender;
    const helmet = Helmet.renderStatic();

    return { helmet, ...renderedContent };
  };

  const docProps = await Doc.getInitialProps({
    req,
    res,
    assets,
    renderPage,
    initialProps,
    helmet: Helmet.renderStatic(),
    ...rest
  });
}

function modPage(Page){
  return (...props)=><Page {...props}></Page>
}

export default render;

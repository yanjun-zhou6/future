import React, {PureComponent} from 'react';
import serialize from 'serialize-javascript';
import {getBundles} from 'react-loadable/webpack';
import Loadable from 'react-loadable';

/**
 * bond react-loadable document component
 * used to create init page template
 */
export default class BoundReactLoadableDocument extends PureComponent {
  static async getInitialProps({
    assets,
    dynamicAssets,
    initialProps,
    renderPage,
  }) {
    const dynamicModules = [];
    const page = await renderPage (Page => {
      return props => (
        <Loadable.Capture
          report={moduleName => dynamicModules.push (moduleName)}
        >
          <Page {...props} />
        </Loadable.Capture>
      );
    });
    const dynamicBundles = getBundles (dynamicAssets, dynamicModules);
    return {assets, initialProps, dynamicBundles, ...page};
  }

  render () {
    const {helmet, assets, dynamicBundles, initialProps} = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent ();
    const bodyAttrs = helmet.bodyAttributes.toComponent ();

    let styles = dynamicBundles.filter (bundle =>
      bundle.file.endsWith ('.css')
    );
    let scripts = dynamicBundles.filter (bundle =>
      bundle.file.endsWith ('.js')
    );
    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Welcome to Nut</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent ()}
          {helmet.meta.toComponent ()}
          {helmet.link.toComponent ()}
          {assets.client.css &&
            <link rel="stylesheet" href={assets.client.css} />}
          {styles.map (style => (
            <link rel="stylesheet" href={style.publicPath} />
          ))}
          <link rel="preload" as="script" href={assets.client.js} />
          {scripts.map (script => (
            <link rel="preload" as="script" href={script.publicPath} />
          ))}
        </head>
        <body {...bodyAttrs}>
          <NutRoot />
          <NutData initialProps={initialProps} />
          <script src={assets.client.js} type="text/javascript" />
          {scripts.map (script => (
            <script src={script.publicPath} type="text/javascript" />
          ))}
          <script>{`window.main();`}</script>
          {helmet.script.toComponent ()}
        </body>
      </html>
    );
  }
}

export function NutRoot () {
  return <div id="root">DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP</div>;
}

export function NutData({initialProps}) {
  return (
    <script
      id="server-app-state"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: serialize ({...initialProps}),
      }}
    />
  );
}

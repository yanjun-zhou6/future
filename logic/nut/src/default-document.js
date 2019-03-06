import React, { PureComponent } from "react";
import serialize from "serialize-javascript";

/**
 * default document component
 * used to create init page template
 */
export class DefaultDocument extends PureComponent {
  static async getInitialProps({ assets, initialProps, renderPage }) {
    const page = await renderPage();
    return { assets, initialProps, ...page };
  }

  render() {
    const { helmet, assets, initialProps } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Welcome to Nut</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
        </head>
        <body {...bodyAttrs}>
          <NutRoot />
          <NutData initialProps={initialProps} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}

export function NutRoot() {
  return <div id="root">DO_NOT_DELETE_THIS_YOU_WILL_BREAK_YOUR_APP</div>;
}

export function NutData({ initialProps }) {
  return (
    <script
      id="server-app-state"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: serialize({ ...initialProps })
      }}
    />
  );
}

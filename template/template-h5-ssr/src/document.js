import React, { PureComponent } from "react";
import { Provider } from "react-redux";
import { NutRoot, NutData } from "@geetemp/nut";
import serialize from "serialize-javascript";

export default class DefaultDocument extends PureComponent {
  static async getInitialProps({ assets, initialProps, renderPage, store }) {
    const page = await renderPage(App => props => (
      <Provider store={store}>
        <App {...props} />
      </Provider>
    ));
    const storeState = store.getState();
    return { assets, initialProps, storeState, ...page };
  }
  render() {
    const { helmet, assets, initialProps, storeState } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs} data-scale="true">
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>h5-模板</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
          />
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
          <SetStoreState storeState={storeState} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
          {helmet.script.toComponent()}
          <script src="//at.alicdn.com/t/font_1072682_h58go2731hg.js" />
          <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js" />
          <script
            defer
            src="https://hm.baidu.com/hm.js?4a71d7e0c5af427089e4fa0c7f77c79c"
            language="JavaScript"
          />
        </body>
      </html>
    );
  }
}

function SetStoreState({ storeState }) {
  return (
    <script
      id="server-store-state"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: serialize({ ...storeState })
      }}
    />
  );
}

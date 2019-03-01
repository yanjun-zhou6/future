import App, { configureStore, staticRoutes } from "./app";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import proxy from "http-proxy-middleware";
import { Provider } from "react-redux";
import fs from "fs-extra";
import { matchRoutes } from "react-router-config";
import { renderToString } from "react-dom/server";

const path = require("path");

// process.env.NODE_ENV
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const emptyState = configureStore.createStore().getState();

const server = express();
server.configProxy = configProxy;
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .configProxy()
  .get("/*", (req, res) => {
    const { url } = req;
    const branch = matchRoutes(staticRoutes, url);
    const context = {};
    const promises = branch.map(({ route, match }) => {
      const { component } = route;
      return component.getInitialProps
        ? component
            .getInitialProps({
              pathname: match.url,
              query: match.params,
              req,
              res
            })
            .then(res => {
              return {
                pageSpace: component.namespace || component.name,
                res
              };
            })
            .catch(res => {
              if (res.code === 404) {
                context.url = "/404";
              } else if (res.code === 500) {
                context.url = "/500";
              }
            })
        : Promise.resolve(null);
    });

    Promise.all(promises)
      .then(initPageDatas => {
        const initState = JSON.parse(JSON.stringify(emptyState));
        for (const initPageData of initPageDatas) {
          if (initPageData) {
            const { pageSpace } = initPageData,
              pageState = initState[pageSpace];
            initState[pageSpace] = { ...pageState, ...initPageData.res };
          }
        }
        render(configureStore.createStore(initState));
      })
      .catch(e => {
        console.error("error", e);
        res.redirect("/500");
      });

    function render(store) {
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter context={context} location={url}>
            <App />
          </StaticRouter>
        </Provider>
      );
      if (context.url) {
        res.redirect(context.url);
      } else {
        res.status(200).send(`<!DOCTYPE html>
          <html lang="">
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>劳务派遣公司-IT人员外包-劳务派遣外包服务-GeeTemp即派</title>
              <meta name="keywords" content="北京劳务派遣公司,IT人员外包,劳务派遣,劳务外包服务,劳务外包公司,人力资源外包,人事派遣,上海劳务派遣公司,深圳劳务派遣公司,行政外包,招聘外包公司">
              <meta name="description" content="荐客极聘网络技术（苏州）有限公司GeeTemp即派主营北京劳务派遣公司,IT人员外包,劳务派遣,劳务外包服务,劳务外包公司,人力资源外包,人事派遣,上海劳务派遣公司,深圳劳务派遣公司,行政外包,招聘外包公司"/>
              <link rel="stylesheet" href="//at.alicdn.com/t/font_784494_tlfgi1pws4.css"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              ${
                assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ""
              }
              <style>
                #for-s{
                  display:none;
                }
              </style>
              <script language="JavaScript">var _hmt = _hmt || [];</script>
            </head>
            <body>
                <h1 id="for-s"><a href="http://www.geetemp.com/">劳务派遣公司</a></h1>
                <div id="root">${markup}</div>
                ${`<script>
                window.__PRELOADED_STATE__ = ${JSON.stringify(
                  store.getState()
                ).replace(/</g, "\\u003c")}
              </script>`}
                ${
                  process.env.NODE_ENV === "production"
                    ? `<script src="${assets.client.js}" defer></script>`
                    : `<script src="${
                        assets.client.js
                      }" defer crossorigin></script>`
                }
                <script defer src="https://hm.baidu.com/hm.js?92555a2920372a2c82bc9fe81cbca596" language="JavaScript" ></script>
            </body>
          </html>`);
      }
    }
  });
//
/**
 * config request proxy
 * @param {express} server
 */
function configProxy() {
  if (process.env.NODE_ENV === "development") {
    const appDirectory = fs.realpathSync(process.cwd());
    const packageJson = fs.readJsonSync(
      path.resolve(appDirectory, "package.json")
    );
    const proxies = packageJson.proxy || {};
    for (const path of Object.keys(proxies)) {
      this.use(path, proxy(proxies[path]));
    }
  }
  return this;
}

export default server;

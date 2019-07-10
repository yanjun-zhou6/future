import express from "express";
import { render } from "@geetemp/nut";
import proxy from "http-proxy-middleware";
import routes from "./routes";
import document from "./document";
import createStore from "./create-store";
import fs from "fs-extra";
const path = require("path");
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();
server.configProxy = configProxy;
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .configProxy()
  .get("/*", async (req, res) => {
    try {
      const store = createStore();
      const html = await render({
        req,
        res,
        routes,
        assets,
        document,
        // Anything else you add here will be made available
        // within getInitialProps(ctx)
        // e.g a redux store...
        store
      });
      res.send(html);
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });

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
    const proxies = packageJson.proxy;
    for (const path of Object.keys(proxies)) {
      this.use(path, proxy(proxies[path]));
    }
  }
  return this;
}

export default server;

import express from "express";
import { render } from "@geetemp/nut";
import routes from "./routes";
import Document from "./document";
import createStore from "./create-store";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();
server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    try {
      const store = createStore();
      const html = await render({
        req,
        res,
        routes,
        assets,
        document: Document,
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

export default server;

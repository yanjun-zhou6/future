import express from 'express';
import render from '@geetemp/nut/render';
import routes from './routes';
import BoundReactLoadableDocument from '@geetemp/nut/bondRctloadableDocument';

const assets = require (process.env.RAZZLE_ASSETS_MANIFEST);
const dynamicAssets = require (process.env.RAZZLE_DYNAMIC_ASSETS_MANIFEST);
const server = express ();
server
  .disable ('x-powered-by')
  .use (express.static (process.env.RAZZLE_PUBLIC_DIR))
  .get ('/*', async (req, res) => {
    try {
      const html = await render ({
        req,
        res,
        routes,
        assets,
        document: BoundReactLoadableDocument,
        dynamicAssets,
        // Anything else you add here will be made available
        // within getInitialProps(ctx)
        // e.g a redux store...
        customThing: 'thing',
      });
      res.send (html);
    } catch (error) {
      res.status (500);
      console.log (error);
    }
  });

export default server;

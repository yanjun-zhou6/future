const nodeExternals = require ('webpack-node-externals');
const ReactLoadablePlugin = require ('react-loadable/webpack')
  .ReactLoadablePlugin;
const performancePlugin = require ('@geetemp/razzle-plugin-performance');
const paths = require ('./config/paths');
const path = require ('path');

module.exports = {
  plugins: [performancePlugin],
  modify: (config, {target, dev}, webpack) => {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@geetemp/nut': path.resolve (
    //     __dirname,
    //     '../../node_modules/@geetemp/nut/src/index.js'
    //   ),
    // };
    if (target === 'web') {
      config.plugins.push (
        new ReactLoadablePlugin ({
          filename: paths.appDynamicManifest,
        })
      );
    }

    if (target === 'node') {
      // We need to tell webpack what to bundle into our Node bundle.
      config.externals = [
        nodeExternals ({
          whitelist: [
            dev ? 'webpack/hot/poll?300' : null,
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/,
            // /nut/
            // /@babel\/runtime\/helpers/
          ].filter (x => x),
        }),
      ];
    }
    return config;
  },
};

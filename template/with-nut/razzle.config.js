const nodeExternals = require ('webpack-node-externals');
const ReactLoadablePlugin = require ('@geetemp/nut/webpack')
  .ReactLoadablePlugin;
const paths = require ('./config/paths');
const path = require ('path');
const BundleAnalyzerPlugin = require ('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  modify: (config, {target, dev}, webpack) => {
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@geetemp/nut': path.resolve (
    //     __dirname,
    //     '../../node_modules/@geetemp/nut/src/index.js'
    //   ),
    // };

    config.plugins.push (
      new ReactLoadablePlugin ({
        filename: paths.appDynamicManifest,
      })
    );

    if (!dev) {
      config.plugins.push (
        new BundleAnalyzerPlugin ({
          analyzerMode: 'disabled',
          generateStatsFile: true,
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

const MomentLocalesPlugin = require ('moment-locales-webpack-plugin');
const DuplicatePackageCheckerPlugin = require ('duplicate-package-checker-webpack-plugin');
const CompressionWebpackPlugin = require ('compression-webpack-plugin');
const BundleAnalyzerPlugin = require ('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = function myRazzlePlugin (config, env, webpack, options) {
  const {target, dev} = env;

  config.module.rules.push ({
    test: /\.(jpe?g|png|gif|svg)$/,
    loader: require.resolve ('image-webpack-loader'),
    enforce: 'pre',
  });

  if (target === 'web') {
    //code splitting @ant-design/icons
    config.module.rules.push ({
      loader: require.resolve ('webpack-ant-icon-loader'),
      enforce: 'pre',
      options: {
        chunkName: 'antd-icons',
      },
      include: [require.resolve ('@ant-design/icons/lib/dist')],
    });

    if (!dev) {
      // bundle analysis
      config.plugins.push (
        new BundleAnalyzerPlugin ({
          analyzerMode: 'disabled',
          generateStatsFile: true,
        })
      );
      // identity duplicate dependencies
      config.plugins.push (new DuplicatePackageCheckerPlugin ());

      // create gzip compress files on build
      config.plugins.push (new CompressionWebpackPlugin ({exclude: /\.map$/}));
    }
  }

  // remove moment locales extends 'zh-cn'
  config.plugins.push (
    new MomentLocalesPlugin ({
      localesToKeep: ['zh-cn'],
    })
  );

  // Do some stuff...
  return config;
};

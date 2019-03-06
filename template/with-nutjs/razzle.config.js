const nodeExternals = require("webpack-node-externals");

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    if (target === "node") {
      // We need to tell webpack what to bundle into our Node bundle.
      config.externals = [
        nodeExternals({
          whitelist: [
            dev ? "webpack/hot/poll?300" : null,
            /\.(eot|woff|woff2|ttf|otf)$/,
            /\.(svg|png|jpg|jpeg|gif|ico)$/,
            /\.(mp4|mp3|ogg|swf|webp)$/,
            /\.(css|scss|sass|sss|less)$/
            // /^gee-ui\/.*\/style/,
            // /^nut/
          ].filter(x => x)
        })
      ];
    }
    return config;
  }
};

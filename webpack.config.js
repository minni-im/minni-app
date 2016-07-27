const webpack = require("webpack");
const path = require("path");
const glob = require("glob");

const ManifestPlugin = require("webpack-manifest-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

module.exports = {
  devtool: RELEASE ? "hidden-source-map" : "cheap-module-eval-source-map",
  context: path.join(__dirname, "./app-frontend"),
  entry: {
    minni: "./app.react.js",
    plugins: glob.sync(
      path.join(__dirname, "app-frontend", "plugins", "**", "Plugin.js")
    ).concat(
      glob.sync(
        path.join(__dirname, "node_modules", "minni-*", "frontend", "Plugin.js")
      )
    ),
    vendor: [
      "react",
      "react-dom",
      "react-router",
      "react-addons-css-transition-group",
      "immutable",
      "flux",
      "flux/utils",
      "long",
      "classnames",
      "deep-extend",
      "highlight.js",
      "click-outside",
      "keymirror",
      "moment",
      "emojify",
      "lodash",
      "simple-markdown",
      "twitter-text"
    ]
  },
  output: {
    path: "./dist/public/js",
    filename: RELEASE ? "[name]-bundle.[chunkhash].min.js" : "[name]-bundle.js",
    publicPath: "/",
    pathinfo: !RELEASE
  },
  resolve: {
    alias: {
      "minni-plugins-toolkit": path.join(__dirname, "app-frontend", "libs", "PluginsToolkit.js")
    },
    fallback: path.join(__dirname, "node_modules")
  },
  resolveLoader: {
    fallback: path.join(__dirname, "node_modules")
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, "app-frontend"),
          path.join(__dirname, "public", "images", "svgs")
        ].concat(
          glob.sync(path.join(__dirname, "node_modules", "minni-composer-*"), { realpath: true })
        ),
        loader: "babel-loader",
        query: {
          babelrc: path.resolve(".babelrc")
        }
      }, {
        test: /\.json$/,
        loader: "json"
      }
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      chunks: ["minni", "plugins"],
      filename: RELEASE ? "[name]-bundle.[chunkhash].min.js" : "[name]-bundle.js",
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "minni",
      chunks: ["plugins"],
      filename: RELEASE ? "[name]-bundle.[chunkhash].min.js" : "[name]-bundle.js",
      minChunks: Infinity
    })
  ].concat(RELEASE ? [
    new ManifestPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      __DEV__: false,
      "process.env.NODE_ENV": JSON.stringify(nodeEnv)
    })
  ] : [
    new webpack.DefinePlugin({
      __DEV__: true,
      "process.env.NODE_ENV": JSON.stringify(nodeEnv)
    })
  ])
};

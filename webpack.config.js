const webpack = require("webpack");
const path = require("path");
const glob = require("glob");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

module.exports = {
  devtool: RELEASE ? "hidden-source-map" : "eval-source-map",
  context: path.join(__dirname, "./app-frontend"),
  entry: {
    minni: "./app.react.js",
    vendor: [
      "react",
      "react-dom",
      "react-router",
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
    filename: RELEASE ? "[name]-bundle.[hash].min.js" : "[name]-bundle.js",
    publicPath: "/",
    pathinfo: !RELEASE
  },
  resolve: {
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
      filename: RELEASE ? "[name]-bundle.[hash].min.js" : "[name]-bundle.js",
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      comments: RELEASE,
      minimize: RELEASE,
      debug: !RELEASE
    })
  ].concat(RELEASE ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),

    new webpack.DefinePlugin({
      __DEV__: false,
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    })
  ] : [
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ])
};

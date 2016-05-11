const webpack = require("webpack");
const path = require("path");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

module.exports = {
  devtool: RELEASE ? "hidden-source-map" : "cheap-eval-source-map",
  context: path.join(__dirname, "./app-frontend"),
  entry: {
    minni: "./app.react.js",
    vendor: [
      "react",
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
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: "babel-loader"
      }, {
        test: /\.json$/,
        loaders: "json"
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

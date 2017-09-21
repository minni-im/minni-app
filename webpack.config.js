const webpack = require("webpack");
const path = require("path");
const glob = require("glob");

const ManifestPlugin = require("webpack-manifest-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

module.exports = {
  devtool: RELEASE ? "hidden-source-map" : "cheap-module-eval-source-map",
  context: path.join(__dirname, "app-frontend"),
  entry: {
    minni: "./app.react.js",
    plugins: glob
      .sync(path.join(__dirname, "app-frontend", "plugins", "**", "Plugin.js"))
      .concat(
        glob.sync(
          path.join(__dirname, "node_modules", "@minni-im", "minni-*", "app-frontend", "Plugin.js")
        ),
        glob.sync(path.join(__dirname, "node_modules", "minni-*", "app-frontend", "Plugin.js"))
      ),
  },
  output: {
    path: path.join(__dirname, "dist", "public", "js"),
    filename: RELEASE ? "[name]-bundle.[chunkhash:8].min.js" : "[name]-bundle.js",
    publicPath: "/",
    pathinfo: !RELEASE,
  },
  resolve: {
    alias: {
      "minni-plugins-toolkit": path.resolve(__dirname, "app-frontend", "libs", "PluginsToolkit.js"),
    },
    modules: [path.resolve(__dirname, "node_modules")],
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "node_modules")],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, "app-frontend"),
          path.join(__dirname, "public", "images", "svgs"),
        ].concat(
          glob.sync(path.join(__dirname, "node_modules", "minni-composer-*", "plugin"), {
            realpath: true,
          })
        ),
        loader: "babel-loader",
        query: {
          babelrc: path.resolve(".babelrc"),
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      chunks: ["minni", "plugins"],
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "minni",
      chunks: ["plugins"],
      minChunks: Infinity,
    }),
    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // Don't generate sourcemaps for vendor bundle.
    new webpack.SourceMapDevToolPlugin({
      exclude: ["vendor.js"],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
    }),
  ].concat(
    RELEASE
      ? [
        new ManifestPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        }),
        new webpack.DefinePlugin({
          __DEV__: false,
        }),
      ]
      : [
        new webpack.DefinePlugin({
          __DEV__: true,
        }),
      ]
  ),
};

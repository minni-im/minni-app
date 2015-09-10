var fs = require("fs");
var path = require("path");

var gulp = require("gulp");
var gutil = require("gulp-util");
var plumber = require("gulp-plumber");
var lodash = require("lodash");
var less = require("gulp-less");
var runSeq = require("run-sequence");
var webpack = require("webpack");
var Autoprefixer = require("less-plugin-autoprefix");
var CleanCss = require("less-plugin-clean-css");


var argv = require("minimist")(process.argv.splice(2));
var RELEASE = !!argv.release;
var BABEL_STAGE = argv.stage;
var VERBOSE = argv.verbose;

var WEBPACK_CONFIG = {
  progress: true,
  debug: !RELEASE,
  devtool: RELEASE ? false : "eval",
  entry: {
    vendor: [
      "react",
      "moment",
      "emojify",
      "lodash"
    ],
    minni: "./app-frontend/app.react.js"
  },
  output: {
    path: "./dist/public/js",
    filename: RELEASE ? "[name]-bundle.[hash].min.js" : "[name]-bundle.js",
    publicPath: "/",
    pathinfo: !RELEASE
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: RELEASE ? "[name]-bundle.[hash].min.js" : "[name]-bundle.js",
      minChunks: Infinity
    })
  ].concat(
    RELEASE ? [
      new webpack.DefinePlugin({
        "process.env": {
          // This has effect on the react lib size
          "NODE_ENV": JSON.stringify("production")
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : [ ]
  ),
  externals: [
    //{ "react": "React" }
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json"
      },
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          optional: ["runtime", "reactCompat"],
          stage: BABEL_STAGE
        }
      }
    ]
  }
};
var webpackBuild = webpack(WEBPACK_CONFIG);
var webpackStats = function webpackStats(done) {
  var options = {
    colors: gutil.colors.supportsColor,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: true,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false
  };

  return function(err, stats) {
    if (err) {
      throw new gutil.PluginError("[webpack]", err);
    }
    if (VERBOSE) {
      gutil.log(stats.toString({
        colors: gutil.colors.supportsColor
      }));
    } else {
      gutil.log(stats.toString(options));
    }
    if (RELEASE) {
      var jsonStats = stats.toJson(
        lodash.assign({}, options, {
          colors: false,
          hash: true,
          children: false,
          version: false
        })
      );
      var hash = jsonStats.hash;
      fs.writeFileSync(
        path.join("dist", "hash.json"),
        JSON.stringify({ "hash": hash }));
      gutil.log(gutil.colors.green("hash.json"), "file written to disk");
      fs.writeFileSync(
        path.join("dist", "stats-[hash].json".replace(/\[hash\]/, hash)),
        JSON.stringify(jsonStats, null, 2));
      gutil.log(gutil.colors.green("stats-" + hash + ".json"), "file written to disk");
    }

    if (done) {
      done();
    }
  };
};

var lessPlugins = [new Autoprefixer({
  browsers: ["last 2 versions"]
})];
if (RELEASE) {
  lessPlugins.push(new CleanCss({
    advanced: true
  }));
}
gulp.task("less", function() {
  return gulp.src(["./app-frontend/stylesheets/style.less"])
    .pipe(plumber())
    .pipe(less({
      plugins: lessPlugins
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest("./dist/public/css"));
});

gulp.task("static", function() {
  return gulp.src([ "./public/**/*" ])
    .pipe(gulp.dest("./dist/public"));
});

gulp.task("webpack", function(done) {
  webpackBuild.run(webpackStats(done));
});

gulp.task("watch", function() {
  gulp.watch([ "./public/**/*" ], ["static"]);
  gulp.watch([ "./app-frontend/stylesheets/**/*.less" ], ["less"]);
  webpackBuild.watch({
    aggregateTimeout: 300
  }, webpackStats());
});

gulp.task("default", function() {
  runSeq(["static", "less", "webpack"]);
});

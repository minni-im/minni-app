const gulp = require("gulp");
const gutil = require("gulp-util");
const plumber = require("gulp-plumber");
const less = require("gulp-less");
const runSeq = require("run-sequence");
const Autoprefixer = require("less-plugin-autoprefix");
const CleanCss = require("less-plugin-clean-css");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

const STATIC_PATHS = ["./public/**/*", "!./public/images/svgs/*.js", "./assets/favicons/*"];

const lessPlugins = [
  new Autoprefixer({
    browsers: ["last 2 versions"],
  }),
];
if (RELEASE) {
  lessPlugins.push(
    new CleanCss({
      advanced: true,
      aggressiveMerging: true,
    })
  );
}

gulp.task("less", () =>
  gulp
    .src(["./assets/stylesheets/style.less", "./assets/stylesheets/chat.less"])
    .pipe(
      plumber({
        errorHandler(error) {
          gutil.log(
            gutil.colors.cyan("Plumber") + gutil.colors.red(" found unhandled error:\n"),
            error.toString()
          );
          this.emit("end");
        },
      })
    )
    .pipe(
      less({
        plugins: lessPlugins,
      })
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest("./dist/public/css"))
);

gulp.task("static", () => gulp.src(STATIC_PATHS).pipe(gulp.dest("./dist/public")));

gulp.task("watch", () => {
  gulp.watch(STATIC_PATHS, ["static"]);
  gulp.watch(["./assets/stylesheets/**/*.less"], ["less"]);
});

gulp.task("default", () => {
  runSeq(["static", "less"]);
});

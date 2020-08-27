const gulp = require("gulp");
const gutil = require("gulp-util");
const plumber = require("gulp-plumber");
const runSeq = require("run-sequence");

const nodeEnv = process.env.NODE_ENV || "development";
const RELEASE = nodeEnv === "production";

const STATIC_PATHS = [
  "./public/**/*",
  "!./public/images/svgs/*.js",
  "./assets/favicons/*",
];

gulp.task("static", () =>
  gulp.src(STATIC_PATHS).pipe(gulp.dest("./dist/public"))
);

gulp.task("watch", () => {
  gulp.watch(STATIC_PATHS, ["static"]);
  gulp.watch(["./assets/stylesheets/**/*.less"], ["less"]);
});

gulp.task("default", () => {
  runSeq(["static", "less"]);
});

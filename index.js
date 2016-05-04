require("babel-register")({
  presets: [
    "es2015"
  ],
  plugins: [
    "transform-object-rest-spread",
    "transform-class-properties"
  ]
});

require("./app-backend");

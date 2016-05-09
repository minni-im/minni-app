require("babel-register")({
  presets: [
    "es2015-node5"
  ],
  plugins: [
    "transform-object-rest-spread",
    "transform-class-properties"
  ]
});

require("./app-backend");

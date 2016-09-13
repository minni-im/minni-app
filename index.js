require("babel-register")({
  presets: [
    "node6"
  ],
  plugins: [
    "transform-object-rest-spread",
    "transform-class-properties"
  ]
});

require("./app-backend");

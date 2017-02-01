require("babel-register")({
  presets: [
    "node6"
  ],
  plugins: [
    "transform-object-rest-spread",
    "transform-class-properties",
    ["transform-builtin-extend", { globals: ["Error"] }]
  ]
});

require("./app-backend");

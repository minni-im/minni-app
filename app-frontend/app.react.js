import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router/BrowserRouter";

import Flux from "./libs/Flux";

// Patch for Immutable to have replace on OrderedMap
import "./libs/Immutable";

import * as WindowActionCreators from "./actions/WindowActionCreators";

import Minni from "./components/Minni.react";
import "./libs/PluginsToolkit";

Flux.initialize();

function filterWindowEvent(event, callback) {
  if (event.currentTarget === event.target) {
    callback();
  }
}

window.addEventListener(
  "focus",
  event => filterWindowEvent(event, () => WindowActionCreators.focus(true)),
  false
);
window.addEventListener(
  "blur",
  event => filterWindowEvent(event, () => WindowActionCreators.focus(false)),
  false
);

ReactDOM.render(
  <Router>
    <Minni pathname="" />
  </Router>,
  document.querySelector("#minni")
);

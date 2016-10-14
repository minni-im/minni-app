import React from "react";

import { sessionStart } from "../actions/AuthenticationActionCreators";

export default class RouterSessionStart extends React.Component {
  componentWillMount() {
    sessionStart();
    const appHolder = document.querySelector("#splashscreen");
    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => {
        appHolder.classList.add("splashscreen--hidden");
      }, 500);
    }, 1000);
  }
  render() { return null; }
}

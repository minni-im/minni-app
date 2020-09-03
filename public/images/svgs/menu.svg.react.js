import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M24 6H0V2h24v4zm0 4H0v4h24v-4zm0 8H0v4h24v-4z" /></svg>;
  }

}
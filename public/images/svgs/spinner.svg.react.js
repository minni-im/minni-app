import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="#fff" {...this.props}><path opacity=".25" d="M16 0a16 16 0 0 0 0 32 16 16 0 0 0 0-32m0 4a12 12 0 0 1 0 24 12 12 0 0 1 0-24" /><path d="M16 0a16 16 0 0 1 16 16h-4A12 12 0 0 0 16 4z" /></svg>;
  }

}
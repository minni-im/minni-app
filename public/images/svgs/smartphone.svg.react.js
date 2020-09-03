import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M19 2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2zm-8.5 0h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zM12 22a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5-3H7V4.976h10V19z" /></svg>;
  }

}
import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M2 0a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm20 14H2V2h20v12zm-6.599 7c0 1.6 1.744 2.625 2.599 3H6c.938-.333 2.599-1.317 2.599-3h6.802z" /></svg>;
  }

}
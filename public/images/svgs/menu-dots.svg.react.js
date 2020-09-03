import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M12 18a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0-9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0-9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" /></svg>;
  }

}
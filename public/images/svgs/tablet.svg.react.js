import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M19 24a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h14zM5 21V3h14v18H5zm6.5 1.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0z" /></svg>;
  }

}
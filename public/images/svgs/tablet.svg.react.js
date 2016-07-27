import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M414.25 430V82c0-17.674-14.326-32-32-32h-252.5c-17.673 0-32 14.326-32 32v348c0 17.673 14.327 32 32 32h252.5c17.674 0 32-14.327 32-32zm-276.5-13V95h236.5v322h-236.5zm109.75 22.749a8.501 8.501 0 0 1 17 0 8.5 8.5 0 0 1-8.5 8.5 8.5 8.5 0 0 1-8.5-8.5z" /></svg>;
  }

}
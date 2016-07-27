import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 32 32"} width={this.props.width ? this.props.width : "32"} height={this.props.height ? this.props.height : "32"} fill={this.props.fill ? this.props.fill : "#fff"} {...this.props}><path opacity=".25" d="M16 0a16 16 0 0 0 0 32 16 16 0 0 0 0-32m0 4a12 12 0 0 1 0 24 12 12 0 0 1 0-24" /><path d="M16 0a16 16 0 0 1 16 16h-4A12 12 0 0 0 16 4z" /></svg>;
  }

}
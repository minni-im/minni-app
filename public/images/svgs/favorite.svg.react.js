import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "512"} height={this.props.height ? this.props.height : "512"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M256 60.082l62.979 129.92 143.022 19.748L357.9 309.793l25.415 142.125L256 383.828l-127.315 68.09L154.1 309.793 49.999 209.75l143.022-19.748z" /></svg>;
  }

}
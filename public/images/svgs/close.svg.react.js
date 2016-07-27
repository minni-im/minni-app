import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "512"} height={this.props.height ? this.props.height : "512"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M438.393 374.595L319.757 255.977l118.621-118.629-63.783-63.741-118.6 118.618-118.62-118.603-63.768 63.73 118.639 118.631L73.622 374.625l63.73 63.768 118.65-118.659 118.65 118.644z" /></svg>;
  }

}
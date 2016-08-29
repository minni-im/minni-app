import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "24"} height={this.props.height ? this.props.height : "24"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 24 24"} {...this.props}><path d="M9 19a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v10zm4 0a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v10zm4 0a1 1 0 0 1-2 0V9a1 1 0 0 1 2 0v10zm5-17v2H2V2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2H22zm-3 4v16H5V6H3v18h18V6h-2z" /></svg>;
  }

}
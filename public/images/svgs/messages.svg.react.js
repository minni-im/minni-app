import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "512"} height={this.props.height ? this.props.height : "512"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M50 64.991v293.682h64.501v88.336l131.978-88.336H462V64.991H50zm206 218.576H121.841v-30H256v30zm135.841-60h-270v-30h270v30zm0-60h-270v-30h270v30z" /></svg>;
  }

}
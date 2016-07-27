import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M462 360v13c0 11.046-8.954 20-20 20H70c-11.046 0-20-8.954-20-20v-13h167.088c1.371 6.149 6.85 9.75 13.412 9.75h51c6.562 0 12.042-3.601 13.412-9.75H462zm-62.166-214H112.166v172h287.668V146m27.001 199H85.168V139c0-11.046 8.954-20 20-20h301.667c11.046 0 20 8.954 20 20v206z" /></svg>;
  }

}
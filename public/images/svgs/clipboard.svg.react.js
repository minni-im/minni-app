import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "24"} height={this.props.height ? this.props.height : "24"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 24 24"} {...this.props}><path d="M16 10c3.469 0 2 4 2 4s4-1.594 4 2v6H12V10h4zm.827-2H10v16h14v-8.842C24 12.766 19.989 8 16.827 8zM8 20H2V4h4l2.102 2H12l2-2h4v2.145a7.649 7.649 0 0 1 2 .754V2h-3c-1.229 0-2.18-1.084-3-2H6c-.82.916-1.771 2-3 2H0v20h8v-2zm2-18a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 18h6v-1h-6v1zm0-2h6v-1h-6v1zm0-2h6v-1h-6v1z" /></svg>;
  }

}
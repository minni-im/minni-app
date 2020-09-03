import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M0 1v16.981h4V23l7-5.019h13V1H0zm13 12H5v-1h8v1zm6-3H5V9h14v1zm0-3H5V6h14v1z" /></svg>;
  }

}
import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M16 9V5l8 7-8 7v-4H8V9h8zm-2 10v-.083A7.93 7.93 0 0 1 10 20c-4.411 0-8-3.589-8-8s3.589-8 8-8a7.93 7.93 0 0 1 4 1.083V2.838A9.957 9.957 0 0 0 10 2C4.478 2 0 6.477 0 12s4.478 10 10 10a9.957 9.957 0 0 0 4-.838V19z" /></svg>;
  }

}
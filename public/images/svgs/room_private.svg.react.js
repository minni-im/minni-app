import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M17 19h4v2h-4v-2zm4-9v2h-5v10h5v2H3V10h3V6a6 6 0 0 1 12 0v4h3zm-5 0V6c0-2.206-1.795-4-4-4S8 3.794 8 6v4h8zm1 8h4v-2h-4v2zm0-3h4v-2h-4v2z" /></svg>;
  }

}
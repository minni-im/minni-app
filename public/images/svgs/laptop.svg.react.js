import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...this.props}><path d="M22 3.2A1.2 1.2 0 0 0 20.8 2H3.2A1.2 1.2 0 0 0 2 3.2V15h20V3.2zM20 13H4V4h16v9zm2 3H2c-.197.372-2 4.582-2 4.998C0 21.52.418 22 1.002 22h21.996c.584 0 1.002-.48 1.002-1.002 0-.416-1.803-4.626-2-4.998zM9.771 21l.467-1h3.523l.467 1H9.771z" /></svg>;
  }

}
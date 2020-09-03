import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...this.props}><path d="M50.003 41.593c-12.005 0-21.736 5.804-21.736 17.809h43.475c0-12.006-9.733-17.809-21.739-17.809zM23.179 62.679h53.648v7.559H23.179zM54.63 29.77h-9.252c-1.023 0-1.85.826-1.85 1.85v.225c0 1.022.826 1.85 1.85 1.85h2.081v4.862h5.087v-4.862h2.084a1.85 1.85 0 0 0 1.849-1.85v-.225a1.85 1.85 0 0 0-1.849-1.85z" /></svg>;
  }

}
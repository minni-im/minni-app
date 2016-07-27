import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M178.184 194.321h-66.258L256.002 50l144.072 144.321h-66.256v181.323H178.184V194.321zm197.052 152.507V412H136.764v-65.172h-50V462h338.473V346.828h-50.001z" /></svg>;
  }

}
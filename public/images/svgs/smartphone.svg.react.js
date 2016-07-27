import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M334.832 50H177.168c-18.227 0-33 14.774-33 33v346c0 18.226 14.773 33 33 33h157.664c18.227 0 33-14.774 33-33V83c0-18.226-14.773-33-33-33zM238.5 80.222h37a4 4 0 0 1 0 8h-37a4 4 0 0 1 0-8zm18.502 362.834c-8.838 0-16-7.163-16-16s7.162-16 16-16c8.834 0 16 7.163 16 16s-7.166 16-16 16zm85.748-49.306H169.252v-275.5H342.75v275.5z" /></svg>;
  }

}
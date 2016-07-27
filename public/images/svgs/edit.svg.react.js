import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M142.559 400.349H50v-35h92.559v35zm241.472-288.698l-188.72 188.381-23.608 99.521 101.58-21.693L462 189.479l-77.969-77.828zm-128.2 234.145l-18.572 3.967-14.334-14.314 4.195-17.683 156.911-156.63 28.396 28.344-156.596 156.316z" /></svg>;
  }

}
import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "24"} height={this.props.height ? this.props.height : "24"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 24 24"} {...this.props}><path fill="#eee" d="M19.604 2.562l-3.346 3.137A13.214 13.214 0 0 0 12.015 5C4.446 5 0 11.551 0 11.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66C4.03 9.946 7.354 7 12.015 7c.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zM24 11.551S19.748 19 12.015 19c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364a15.309 15.309 0 0 0-3.587-2.952l1.489-1.46C22.403 9.124 24 11.551 24 11.551z" /></svg>;
  }

}
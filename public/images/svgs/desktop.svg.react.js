import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M197.607 406.655c-4.477 15.887-26.221 37.631-42.107 42.107h201c-15.343-3.965-38.143-26.765-42.107-42.107H197.607zM437 63.237H75c-13.807 0-25 11.193-25 25v268.525c0 13.808 11.193 25 25 25h362c13.807 0 25-11.192 25-25V88.237c0-13.807-11.193-25-25-25zM419.891 301H92.109l-.001-195.653 327.782-.002V301z" /></svg>;
  }

}
import ReactDom from "react-dom";
import React from "react";

export default class RootChild extends React.Component {
  componentDidMount() {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.renderChildren();
  }

  componentDidUpdate() {
    this.renderChildren();
  }

  componentWillUnmount() {
    if (!this.container) {
      return;
    }

    ReactDom.unmountComponentAtNode(this.container);
    document.body.removeChild(this.container);
    delete this.container;
  }

  renderChildren() {
    let content;

    if (this.props && (Object.keys(this.props).length > 1 || !this.props.children)) {
      content = <div {...this.props}>{this.props.children}</div>;
    } else {
      content = this.props.children;
    }
    ReactDom.render(content, this.container);
  }

  render() {
    return null;
  }
}

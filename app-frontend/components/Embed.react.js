import React from "react";
import classnames from "classnames";
import Image from "./generic/Image.react";

function EmbedWrapper(props) {
  return <div className={props.className}>
    <span className="embed-hide">&times;</span>
    {props.children}
  </div>;
}

export default class Embed extends React.Component {
  render() {
    let classNames = {
      [`embed-${this.props.type}`]: true
    };

    switch (this.props.type) {
      case "image":
        return <EmbedWrapper className={classnames("message--embed", classNames)}>
          <a href={this.props.url} target="_blank">
            <Image src={this.props.url} />
          </a>
        </EmbedWrapper>;

      default:
        return null;
    }
  }
}

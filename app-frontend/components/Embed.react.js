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
  renderThumbnail() {
    if (this.props.thumbnail) {
      const { url, width, height } = this.props.thumbnail;
      return <a href={this.props.url} target="_blank">
        <Image src={url}
          width={this.props.width}
          height={this.props.height}
          thumbnailWidth={width}
          thumbnailHeight={height}
          />
      </a>;
    }
  }

  render() {
    let classNames = {
      [`embed-${this.props.type}`]: true
    };

    switch (this.props.type) {
      case "image":
        return <EmbedWrapper className={classnames("message--embed", classNames)}>
          {this.renderThumbnail()}
        </EmbedWrapper>;

      default:
        return null;
    }
  }
}

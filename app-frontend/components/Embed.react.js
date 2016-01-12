import React from "react";
import classnames from "classnames";
import Image from "./generic/Image.react";

function EmbedWrapper(props) {
  return <div className={props.className}>
    <span className="embed-hide" title="Hide this preview">&times;</span>
    {props.children}
  </div>;
}


class OEmbed extends React.Component {
  renderTitle({ title }) {
    return <h3>{title}</h3>;
  }

  renderDescription({ description }) {
    return <p>{description}</p>;
  }

  renderAuthor({ name, url }) {
    return <div className="embed--author">
      <a href={url} target="_blank" title={name}>{name}</a>
    </div>;
  }

  renderProvider({ name, url }) {
    return <div className="embed--provider">
      <a href={url} target="_blank" title={name}>{name}</a>
    </div>;
  }

  renderThumbnail({ url, width, height }) {
    return <a href={this.props.url} target="_blank" className="embed--thumbnail">
      <Image src={url}
        width={this.props.width}
        height={this.props.height}
        thumbnailWidth={width}
        thumbnailHeight={height}
        />
    </a>;
  }

  renderHtml({ html }) {

  }

  renderMeta({ meta }) {
    return <div></div>;
  }

  render() {
    const { classNames, embed } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {embed.title ? this.renderTitle(embed) : null}
      {this.renderDescription(embed)}
      {this.renderProvider(embed.provider)}
      {this.renderThumbnail(embed.thumbnail)}
      {embed.author ? this.renderAuthor(embed.author): null}
      {embed.html ? this.renderHtml(embed) : null}
      {embed.meta ? this.renderMeta(embed) : null}
    </EmbedWrapper>;
  }
}

class ImageEmbed extends OEmbed {
  render() {
    const { classNames, embed } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {this.renderThumbnail(embed.thumbnail)}
    </EmbedWrapper>;
  }
}

export default class Embed extends React.Component {
  render() {
    const { type } = this.props;
    let classNames = {
      [`embed-${type}`]: true
    };

    switch (type) {
      case "image":
        return <ImageEmbed classNames={classNames} embed={this.props} />;

      case "audio.spotify":
      case "video.youtube":
      case "video.vine":
      case "image.flickr":
      case "image.instagram":
      case "code.github.user":
      case "code.gist":
        return <OEmbed classNames={classNames} embed={this.props} />;

      case "web.twitter":
        return <OEmbed classNames={classNames} embed={this.props} />;

      default:
        return null;
    }
  }
}

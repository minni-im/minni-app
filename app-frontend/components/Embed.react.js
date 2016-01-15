import React from "react";
import classnames from "classnames";
import Image from "./generic/Image.react";

class EmbedWrapper extends React.Component {
  render() {
    return <div className={this.props.className} {...this.props}>
      <span className="embed-hide" title="Hide this preview">&times;</span>
      {this.props.children}
    </div>;
  }
}


class OEmbed extends React.Component {
  renderTitle() {
    const { title } = this.props;
    return title ? <h3>{title}</h3> : null;
  }

  renderDescription() {
    const { description } = this.props;
    return description ? <p>{description}</p> : null;
  }

  renderAuthor(prefix = "") {
    if (!this.props.author || this.props.author && !this.props.author.name) {
      return null;
    }
    const { name, url } = this.props.author;
    return <div className="embed--author">
      {prefix} <a href={url} target="_blank" title={name}>{name}</a>
    </div>;
  }

  renderProvider() {
    if (!this.props.provider || this.props.provider && !this.props.provider.name) {
      return null;
    }
    const { name, url } = this.props.provider;
    return <div className="embed--provider">
      <a href={url} target="_blank" title={name}>{name}</a>
    </div>;
  }

  renderThumbnail(withLink = false) {
    if (!this.props.thumbnail) {
      return null;
    }
    const { url, width, height } = this.props.thumbnail;
    if (withLink) {
      return <a href={this.props.url} target="_blank" className="embed--thumbnail">
        <Image src={url}
          width={this.props.width}
          height={this.props.height}
          thumbnailWidth={width}
          thumbnailHeight={height}
        />
      </a>;
    } else {
      return <Image src={url}
        className="embed--thumbnail"
        width={this.props.width}
        height={this.props.height}
        thumbnailWidth={width}
        thumbnailHeight={height}
      />;
    }
  }

  renderHtml() {
    const { html } = this.props;
  }

  renderMeta() {
    const { meta } = this.props;
    return <div></div>;
  }

  render() {
    const { classNames, thumbnail: { width } } = this.props;
    let style = {};
    if (width) {
      style["maxWidth"] = width;
    }
    return <EmbedWrapper
      className={classnames("message--embed", classNames)}
      style={style}>
      {this.renderProvider()}
      {this.renderThumbnail(true)}
      {this.renderTitle()}
      {this.renderAuthor()}
      {this.renderDescription()}
      {this.renderHtml()}
      {this.renderMeta()}
    </EmbedWrapper>;
  }
}

class ImageEmbed extends OEmbed {
  render() {
    const { classNames } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {this.renderThumbnail(true)}
    </EmbedWrapper>;
  }
}

class BackgroundCoverEmbed extends OEmbed {
  renderThumbnail() {
    const { url, thumbnail } = this.props;
    const { url: thumbnailUrl, width } = thumbnail;
    return <a href={url}
      target="_blank"
      className="embed--thumbnail"
      style={{
        "backgroundImage": `url(${thumbnailUrl})`}}>&nbsp;</a>;
  }

  renderAuthor() {
    return super.renderAuthor("by");
  }
}

class TwitterEmbed extends OEmbed {
  renderTitle() {
    const { author, title } = this.props;
    const { name, url } = author;
    return <h3>
      <a href={url} target="_blank">{title}</a>
      <span className="embed--author">{name}</span>
    </h3>;
  }
  render() {
    const { classNames } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {this.renderProvider()}
      {this.renderThumbnail()}
      {this.renderTitle()}
      {this.renderDescription()}
    </EmbedWrapper>;
  }
}

class SpotifyEmbed extends OEmbed {
  render() {
    const { classNames } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {this.renderProvider()}
      {this.renderThumbnail()}
      {this.renderTitle()}
    </EmbedWrapper>;
  }
}

class GithubEmbed extends OEmbed {
  renderTitle() {
    const { title, provider } = this.props;
    const { url } = provider;
    return <h3><a href={url} target="_blank">{title}</a></h3>;
  }
}

class AudioEmbed extends OEmbed {
  render() {
    return <div></div>;
  }
}

class VideoEmbed extends OEmbed {
  render() {
    return <div></div>;
  }
}


export default class Embed extends React.Component {
  render() {
    const { type } = this.props;
    let classNames = {
      [`embed-${type.replace(/\./g, "-")}`]: true
    };

    switch (type) {
      case "image":
        return <ImageEmbed classNames={classNames} {...this.props} />;

      case "audio.spotify":
        return <SpotifyEmbed classNames={classNames} {...this.props} />;

      case "video.youtube":
      case "video.vine":
      case "image.flickr":
      case "image.instagram":
        return <BackgroundCoverEmbed classNames={classNames} {...this.props} />;

      case "code.github.user":
      case "code.github.repo":
      case "code.gist":
        return <GithubEmbed classNames={classNames} {...this.props} />;

      case "web.twitter":
        return <TwitterEmbed classNames={classNames} {...this.props} />;

      default:
        return null;
    }
  }
}

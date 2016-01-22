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
    return description ? <div>{description}</div> : null;
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

  renderContent() {
    return <div className="embed--content">
      {this.renderTitle()}
      {this.renderAuthor()}
      {this.renderDescription()}
      {this.renderHtml()}
      {this.renderMeta()}
    </div>;
  }

  render() {
    const { classNames, thumbnail } = this.props;
    let style = {};
    if (thumbnail && thumbnail.width) {
      style["maxWidth"] = thumbnail.width;
    }
    return <EmbedWrapper
      className={classnames("message--embed", classNames)}
      style={style}>
      {this.renderThumbnail(true)}
      {this.renderContent()}
      {this.renderProvider()}
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

  renderContent() {
    return <div className="embed--content">
      {this.renderThumbnail()}
      {this.renderTitle()}
      {this.renderDescription()}
    </div>;
  }

  render() {
    const { classNames } = this.props;
    return <EmbedWrapper className={classnames("message--embed", classNames)}>
      {this.renderContent()}
      {this.renderProvider()}
    </EmbedWrapper>;
  }
}

class SpotifyEmbed extends OEmbed {
  renderThumbnail() {
    const { url, thumbnail } = this.props;
    return <a
      href={url}
      target="_blank"
      className="embed--thumbnail"
      style={{
        "backgroundImage": `url(${thumbnail.url})`}}>
    </a>;
  }

  renderContent() {
    return <div className="embed--content">
      {this.renderTitle()}
      {this.renderDescription()}
    </div>;
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
    return <audio controls src={this.props.url}></audio>
  }
}

class VideoEmbed extends ImageEmbed {
  renderThumbnail() {
    return <video ref="video" onLoadedMetadata={this.guessSize.bind(this)} src={this.props.url} controls></video>;
  }

  guessSize(event) {
    const { video } = this.refs;
    console.log(video.videoWidth, video.videoHeight);
  }
}


export default class Embed extends React.Component {
  render() {
    const { type } = this.props;
    let classNames = {
      [`embed-${type.replace(/\./g, "-")}`]: true
    };

    switch (type) {
      case "audio":
        return <AudioEmbed classNames={classNames} {...this.props} />;

      case "video":
        return <VideoEmbed classNames={classNames} {...this.props} />;

      case "image":
        return <ImageEmbed classNames={classNames} {...this.props} />;

      case "audio.spotify":
        return <SpotifyEmbed classNames={classNames} {...this.props} />;

      case "video.youtube":
      case "video.vine":
      case "image.flickr":
      case "image.instagram":
      case "web.medium":
      case "code.codepen":
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

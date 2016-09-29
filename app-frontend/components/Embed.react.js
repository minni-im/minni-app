import React from "react";
import classnames from "classnames";
import Image from "./generic/Image.react";

function EmbedWrapper(props) {
  return (
    <div
      className={props.className}
      {...props}
      onClick={(event) => {
        if (event.altKey) {
          props.onHidePreview();
          event.preventDefault();
        }
      }}
    >
      <span
        className="embed-hide"
        title="Hide this preview (alt+click message to make it appear again)"
        onClick={props.onHidePreview}
      >&times;</span>
      {props.children}
    </div>
  );
}

EmbedWrapper.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.any,
  onHidePreview: React.PropTypes.func
};

EmbedWrapper.defaultProps = {
  onHidePreview() {}
};


class OEmbed extends React.Component {
  renderTitle() {
    const { title } = this.props;
    return title ? <h3>{title}</h3> : null;
  }

  renderDescription() {
    const { description } = this.props;
    return description ? <div className="embed--description">{description}</div> : null;
  }

  renderAuthor(prefix = "") {
    if (!this.props.author || this.props.author && !this.props.author.name) {
      return null;
    }
    const { name, url } = this.props.author;
    return (
      <div className="embed--author">
        {prefix} <a href={url} target="_blank" title={name}>{name}</a>
      </div>
    );
  }

  renderProvider() {
    if (!this.props.provider || this.props.provider && !this.props.provider.name) {
      return null;
    }
    const { name, url } = this.props.provider;
    return (
      <div className="embed--provider">
        <a href={url} target="_blank" title={name}>{name}</a>
      </div>
    );
  }

  renderThumbnail(withLink = false) {
    if (!this.props.thumbnail) {
      return null;
    }
    const { url, width, height } = this.props.thumbnail;
    if (withLink) {
      return (
        <a
          href={this.props.url}
          target="_blank"
          className="embed--thumbnail"
        >
          <Image
            src={url}
            width={this.props.width}
            height={this.props.height}
            thumbnailWidth={width}
            thumbnailHeight={height}
          />
        </a>
      );
    } else {
      return (
        <Image
          src={url}
          className="embed--thumbnail"
          width={this.props.width}
          height={this.props.height}
          thumbnailWidth={width}
          thumbnailHeight={height}
        />
      );
    }
  }

  renderHtml() {
    const { html } = this.props;
  }

  renderMeta() {
    const { meta } = this.props;
    return <div />;
  }

  renderContent() {
    return (
      <div className="embed--content">
        {this.renderTitle()}
        {this.renderAuthor()}
        {this.renderDescription()}
        {this.renderHtml()}
        {this.renderMeta()}
      </div>
    );
  }

  render() {
    const { classNames, thumbnail } = this.props;
    const style = {};
    if (thumbnail && thumbnail.width) {
      style.maxWidth = thumbnail.width;
    }
    return (
      <EmbedWrapper
        className={classnames("message--embed", classNames)}
        style={style}
        {...this.props}
      >
        {this.renderThumbnail(true)}
        {this.renderContent()}
        {this.renderProvider()}
      </EmbedWrapper>
    );
  }
}

class ImageEmbed extends OEmbed {
  render() {
    const { classNames } = this.props;
    return (
      <EmbedWrapper
        className={classnames("message--embed", classNames)}
        {...this.props}
      >
        {this.renderThumbnail(true)}
      </EmbedWrapper>
    );
  }
}

class BackgroundCoverEmbed extends OEmbed {
  renderThumbnail() {
    const { url, thumbnail, fallbackCover } = this.props;
    const { url: thumbnailUrl, width } = thumbnail;
    const style = {
      backgroundImage: `url(${thumbnailUrl})`
    };

    if (fallbackCover) {
      style.backgroundImage += `, url(${fallbackCover})`;
    }

    return (
      <a
        href={url}
        target="_blank"
        className="embed--thumbnail"
        style={style}
      >&nbsp;</a>
    );
  }

  renderAuthor() {
    return super.renderAuthor("by");
  }
}

BackgroundCoverEmbed.defaultProps = {
  fallbackCover: false
};

class TwitterEmbed extends OEmbed {
  renderTitle() {
    const { author, title } = this.props;
    const { name, url } = author;
    return (<h3>
      <a href={url} target="_blank">{title}</a>
      <span className="embed--author">{name}</span>
    </h3>);
  }

  renderContent() {
    return (
      <div className="embed--content">
        {this.renderThumbnail()}
        {this.renderTitle()}
        {this.renderDescription()}
      </div>
    );
  }

  render() {
    const { classNames } = this.props;
    return (
      <EmbedWrapper
        className={classnames("message--embed", classNames)}
        {...this.props}
      >
        {this.renderContent()}
        {this.renderProvider()}
      </EmbedWrapper>
    );
  }
}

class SpotifyEmbed extends OEmbed {
  renderThumbnail() {
    const { url, thumbnail } = this.props;
    return (
      <a
        href={url}
        target="_blank"
        className="embed--thumbnail"
        style={{
          backgroundImage: `url(${thumbnail.url})`
        }}
      />
    );
  }

  renderContent() {
    return (
      <div className="embed--content">
        {this.renderTitle()}
        {this.renderDescription()}
      </div>
    );
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
    return <audio className="embed-audio" controls src={this.props.url} />;
  }
}

class VideoEmbed extends ImageEmbed {
  renderThumbnail() {
    return (
      <video
        ref={(video) => { this.video = video; }}
        onLoadedMetadata={() => { this.guessSize(); }}
        src={this.props.url}
        controls
      />
    );
  }

  guessSize() {
    console.log(this.video.videoWidth, this.video.videoHeight);
  }
}


export default function Embed(props) {
  const { type } = props;
  const classNames = {
    [`embed-${type.replace(/\./g, "-")}`]: true
  };

  switch (type) {
    case "audio":
      return <AudioEmbed classNames={classNames} {...props} />;

    case "video":
      return <VideoEmbed classNames={classNames} {...props} />;
    case "image":
      return <ImageEmbed classNames={classNames} {...props} />;

    case "audio.spotify":
      return <SpotifyEmbed classNames={classNames} {...props} />;

    case "video.youtube":
    case "video.vine":
      return <BackgroundCoverEmbed classNames={classNames} {...props} />;

    case "image.flickr":
    case "image.instagram":
    case "web.medium":
    case "code.codepen":
      return (
        <BackgroundCoverEmbed
          classNames={classNames}
          fallbackCover="/images/svgs/no-eye.svg"
          {...props}
        />
      );

    case "code.github.user":
    case "code.github.repo":
    case "code.gist":
      return <GithubEmbed classNames={classNames} {...props} />;

    case "web.twitter":
      return <TwitterEmbed classNames={classNames} {...props} />;

    default:
      return null;
  }
}

Embed.propTypes = {
  type: React.PropTypes.string
};

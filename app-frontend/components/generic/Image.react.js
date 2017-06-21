import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Container } from "flux/utils";
import Observer from "react-intersection-observer";

import * as ImageActionCreators from "../../actions/ImageActionCreators";
import ImageStore from "../../stores/ImageStore";

import { MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from "../../Constants";

class ImageContainer extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    thumbnailWidth: PropTypes.number,
    thumbnailHeight: PropTypes.number,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: "",
  };

  static getStores() {
    return [ImageStore];
  }

  static calculateState(prevProps, nextProps) {
    const state = ImageStore.getImage(nextProps.src);
    return {
      animate: true,
      loaded: !!state,
      imageState: state,
    };
  }

  constructor(props) {
    super(props);
    this.showLightbox = this.showLightbox.bind(this);
  }

  componentDidMount() {
    if (!this.state.loaded) {
      ImageActionCreators.loadImage(this.props.src);
    }
  }

  getRatio() {
    let { width, height } = this.props;
    let widthRatio = 1;
    if (width > MAX_IMAGE_WIDTH) {
      widthRatio = MAX_IMAGE_WIDTH / width;
    }

    width = Math.round(width * widthRatio);
    height = Math.round(height * widthRatio);

    let heightRatio = 1;
    if (height > MAX_IMAGE_HEIGHT) {
      heightRatio = MAX_IMAGE_HEIGHT / height;
    }

    return Math.min(widthRatio * heightRatio, 1);
  }

  getWidth() {
    return Math.round(this.props.width * this.getRatio());
  }

  getHeight() {
    return Math.round(this.props.height * this.getRatio());
  }

  isGIF() {
    return /\.gif/i.test(this.props.src);
  }

  showLightbox(event) {
    if (event.altKey) {
      return; // We just ignore altKey which is used at upper level to hide embeds
    }
    ImageActionCreators.showLightbox(event.target.getAttribute("src"));
  }

  render() {
    const width = this.props.thumbnailWidth || this.getWidth();
    const height = this.props.thumbnailHeight || this.getHeight();
    if (!this.state.loaded) {
      return <span className="image image--loader" style={{ width, height }} />;
    }
    const props = {
      width,
      height,
      src: this.props.src,
      onClick: this.showLightbox,
    };
    const classNames = {
      "image--gif": this.isGIF(),
    };

    if (this.isGIF()) {
      return (
        <Observer
          tag="span"
          className="image"
          render={() => <span className="image--gif">► GIF</span>}
        >
          {(inView) => {
            if (inView) return <img {...props} alt="" />;
            return <div className="image--loader" style={{ width, height }} />;
          }}
        </Observer>
      );
    }
    return (
      <img className={classnames("image", classNames, this.props.className)} alt="" {...props} />
    );
  }
}

const instance = Container.create(ImageContainer, { withProps: true });
export default instance;

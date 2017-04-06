import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import { Container } from "flux/utils";

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
      animate: false,
      loaded: !!state,
      imageState: state,
    };
  }

  constructor(props) {
    super(props);
    this.showLightbox = this.showLightbox.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.updateStaticFrame();
    if (!this.state.loaded) {
      ImageActionCreators.loadImage(this.props.src);
    }
  }

  componentDidUpdate() {
    this.updateStaticFrame();
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

  updateStaticFrame() {
    if (!this.state.loaded) return;
    let image;
    if (this.canvas) {
      const drawImage = () => {
        this.canvas.getContext("2d").drawImage(image, 0, 0, this.getWidth(), this.getHeight());
      };
      image = new window.Image();
      image.src = this.props.src;
      if (image.complete) {
        drawImage();
      } else {
        image.onLoad = drawImage;
      }
    }
  }

  isGIF() {
    return /\.gif/i.test(this.props.src);
  }

  handleMouseEnter() {
    this.setState({ animate: true });
  }

  handleMouseLeave() {
    this.setState({ animate: false });
  }

  showLightbox(event) {
    if (event.altKey) {
      return;
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
      props.onMouseEnter = this.handleMouseEnter;
      props.onMouseLeave = this.handleMouseLeave;
      return (
        <span className="image">
          <span className="image--gif">► GIF</span>
          {!this.state.animate &&
            <canvas
              ref={(node) => {
                this.canvas = node;
              }}
              {...props}
            />}
          {this.state.animate && <img {...props} alt="There should be something here" />}
        </span>
      );
    }
    return <img className={classnames("image", classNames, this.props.className)} {...props} />;
  }
}

const instance = Container.create(ImageContainer, { withProps: true });
export default instance;

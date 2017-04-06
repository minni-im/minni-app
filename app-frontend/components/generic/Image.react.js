import React, { PropTypes } from "react";
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
      loaded: state,
      imageState: state,
    };
  }

  constructor(props) {
    super(props);
    this.showLightbox = this.showLightbox.bind(this);
  }

  // updateStaticFrame() {
  //   if (!this.state.loaded) { return; }
  //   ImageActionCreators.loadImage(this.props.src).then(({ image, width, height }) => {
  //     console.log({ image, width, height });
  //     // let canvas = document.createElement("canvas");
  //     // canvas.width = width;
  //     // canvas.height = height;
  //     // let ctx = canvas.getContext("2d");
  //     // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  //     // console.log(canvas);
  //     //this.setState({staticFrame: canvas.toDataURL("image/png")});
  //   });
  // }

  componentDidMount() {
    if (!this.state.loaded) {
      ImageActionCreators.loadImage(this.props.src);
    }
  }

  // componentDidUpdate() {
  //   console.log("updated");
  //   // if (this.isGIF()) {
  //   //   this.updateStaticFrame();
  //   // }
  // }

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

  // handleMouseEnter() {
  //   this.setState({ animate: true });
  // }
  //
  // handleMouseLeave() {
  //   this.setState({ animate: false });
  // }

  showLightbox(event) {
    ImageActionCreators.showLightbox(event.target.src);
    event.preventDefault();
  }

  render() {
    const width = this.props.thumbnailWidth || this.getWidth();
    const height = this.props.thumbnailHeight || this.getHeight();
    if (!this.state.loaded) {
      return <div className="image image--loader" style={{ width, height }} />;
    }
    const props = {
      width,
      height,
      src: this.props.src,
      alt: "There should be something here",
      onClick: this.showLightbox,
    };
    const classNames = {
      "image--gif": this.isGIF(),
    };

    if (this.isGIF()) {
      return (
        <span className="image">
          <span className="image--gif">► GIF</span>
          <img {...props} alt="There should be something here" />
        </span>
      );
      //   props.onMouseEnter = this.handleMouseEnter.bind(this);
      //   props.onMouseLeave = this.handleMouseLeave.bind(this);
      //   if (!this.state.animate) {
      //     return <img className="image image-static" {...props} src={this.state.staticFrame} />;
      //   }
    }
    return <img className={classnames("image", classNames, this.props.className)} {...props} />;
  }
}

const instance = Container.create(ImageContainer, { withProps: true });
export default instance;

import React from "react";
import classnames from "classnames";
import { Container } from "flux/utils";

import ImageActionCreators from "../../actions/ImageActionCreators" ;
import ImageStore from "../../stores/ImageStore";

class ImageContainer extends React.Component {
  static getStores() {
    return [ ImageStore ];
  }

  static calculateState(prevProps, nextProps) {
    const state = ImageStore.getImage(nextProps.src);
    return {
      animate: false,
      loaded: state,
      imageState: state
    };
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

  render() {
    if (!this.state.loaded) {
      const {width, height} = this.props;
      return <div className="image image--loader" style={{width, height}}></div>;
    } else {
      let props = {
        width: this.state.imageState.width,
        height: this.state.imageState.height,
        src: this.props.src
      };
      let classNames = {
        "image--gif": this.isGIF()
      };

      if (this.isGIF()) {
        console.log(this.props.src, "is a GIF");
        return <span className="image">
          <span className="image--gif">&#9658; GIF</span>
          <img {...props} />
        </span>;
      //   props.onMouseEnter = this.handleMouseEnter.bind(this);
      //   props.onMouseLeave = this.handleMouseLeave.bind(this);
      //   if (!this.state.animate) {
      //     return <img className="image image-static" {...props} src={this.state.staticFrame} />;
      //   }
      }
      return <img className={classnames("image", classNames)} {...props} />;
    }
  }

  isGIF() {
    return (/\.gif/i).test(this.props.src);
  }

  handleMouseEnter() {
    this.setState({ animate: true });
  }

  handleMouseLeave() {
    this.setState({ animate: false });
  }
}

const instance = Container.create(ImageContainer, { withProps: true });
export default instance;

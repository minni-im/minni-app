import React from "react";
import { Container } from "flux/utils";

import { closeLigthbox } from "../../actions/ImageActionCreators";

import RootChild from "./RootChild.react";

import ImageStore from "../../stores/ImageStore";
import LightboxStore from "../../stores/LightboxStore";

class Lightbox extends React.Component {
  static getStores() {
    return [ImageStore, LightboxStore];
  }

  static calculateState() {
    return {
      isVisible: LightboxStore.isVisible(),
      image: LightboxStore.imageUrl(),
      ...ImageStore.getImage(LightboxStore.imageUrl()),
    };
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  state = {
    isVisible: false,
    image: {},
  };

  onClick(event) {
    closeLigthbox();
    event.preventDefault();
  }

  render() {
    const maxWidth = Math.round(
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) * 0.8
    );
    const maxHeight = Math.round(
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.8
    );

    let { width, height } = this.state;

    const ratioScreen = maxWidth / maxHeight;
    const ratioImage = width / height;

    if (height >= maxHeight || width >= maxWidth) {
      if (ratioScreen > ratioImage) {
        width = maxHeight * width / height;
        height = maxHeight;
      } else {
        height = maxWidth * height / width;
        width = maxWidth;
      }
    }

    return (
      <RootChild>
        {this.state.isVisible
          ? <div className="lightbox" onClick={this.onClick}>
            <div className="lightbox-content">
              <img style={{ height, width }} src={this.state.image} />
              <a
                className="lightbox--open-original"
                href={this.state.image}
                target="_blank"
                rel="noopener noreferrer"
                onClick={event => event.stopPropagation()}
              >
                  Open original
                </a>
            </div>
          </div>
          : null}
      </RootChild>
    );
  }
}

const container = Container.create(Lightbox);
export default container;

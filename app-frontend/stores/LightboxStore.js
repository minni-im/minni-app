import Dispatcher from "../Dispatcher";
import { ReduceStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleShow(state, { image }) {
  return image;
}

function handleHide() {
  return "";
}

class LightboxStore extends ReduceStore {
  initialize() {
    this.addAction(ActionTypes.LIGHTBOX_SHOW_IMAGE, handleShow);
    this.addAction(ActionTypes.LIGHTBOX_HIDE, handleHide);
  }

  getInitialState() {
    return "";
  }

  isVisible() {
    return this.getState().length > 0;
  }

  imageUrl() {
    return this.getState();
  }
}

export default new LightboxStore(Dispatcher);

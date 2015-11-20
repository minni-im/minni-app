import Dispatcher from "../dispatchers/Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleImageLoad(state, { url, width, height }) {
  return state.set(url, { width, height });
}

function handleImageLoadFailed(state, { url }) {
 return state.set(url, { errored: true });
}

class ImageStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.LOAD_IMAGE_SUCCESS, handleImageLoad);
    this.addAction(ActionTypes.LOAD_IMAGE_FAILURE, handleImageLoadFailed);
  }

  getImage(url) {
    return this.get(url);
  }
}

export default new ImageStore(Dispatcher);

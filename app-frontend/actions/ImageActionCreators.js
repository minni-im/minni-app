import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes } from "../Constants";

export default {
  loadImage(url) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.onerror = () => {
        dispatch({
          type: ActionTypes.LOAD_IMAGE_FAILURE,
          url
        });
        resolve(false);
      };
      image.onload = () => {
        dispatch({
          type: ActionTypes.LOAD_IMAGE_SUCCESS,
          image,
          url,
          width: image.width,
          height: image.height
        });
        resolve({ image, url, width: image.width, height: image.height });
      };
      image.src = url;
    });
  }
};

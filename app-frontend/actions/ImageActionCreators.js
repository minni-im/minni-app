import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export const showLightbox = (url) => {
  dispatch({
    type: ActionTypes.LIGHTBOX_SHOW_IMAGE,
    image: url,
  });
};

export const closeLigthbox = () => {
  dispatch({
    type: ActionTypes.LIGHTBOX_HIDE,
  });
};

export const loadImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => {
      dispatch({
        type: ActionTypes.LOAD_IMAGE_FAILURE,
        url,
      });
      resolve(false);
    };
    image.onload = () => {
      dispatch({
        type: ActionTypes.LOAD_IMAGE_SUCCESS,
        image,
        url,
        width: image.width,
        height: image.height,
      });
      resolve({ image, url, width: image.width, height: image.height });
    };
    image.src = url;
  });

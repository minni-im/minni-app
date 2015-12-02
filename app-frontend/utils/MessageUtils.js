import Long from "long";
import twitter from "twitter-text";

import ImageActionCreators from "../actions/ImageActionCreators";

import ImageStore from "../stores/ImageStore";
import UserStore from "../stores/UserStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

import Logger from "../libs/Logger";
const logger = Logger.create("MessageUtils");

const REGEX_IMAGE = /\.(?:jpe?g|png|gif|webp|bmp|tiff|svg)$/i;

function createNonce() {
  return Long.fromNumber(new Date().getTime()).multiply(1000.0).subtract(1420070400000).shiftLeft(22);
}


function extractImages(message) {
  return Promise.all(
    twitter.extractUrls(message.content)
      .filter(url => {
        return REGEX_IMAGE.test(url);
      })
      .map(url => {
        const image = ImageStore.getImage(url);
        if (image) {
          return { url, width: image.width, height: image.height };
        } else {
          return ImageActionCreators.loadImage(url);
        }
      })
  ).then(images => {
    if (images.length) {
      message.embeds = images.map(image => {
        image.type = "image";
        return image;
      });
    }
    return message;
  });
}

export function createMessage(roomId, content, subType) {
  return extractImages({
    id: createNonce().toString(),
    roomId,
    content,
    type: "chat",
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  });
}

export function createSystemMessage(roomId, content, subType) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    type: "system",
    subType: subType,
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };
}

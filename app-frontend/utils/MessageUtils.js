import Long from "long";
import twitter from "twitter-text";

import { PLUGIN_TYPES } from "../Constants";

import ImageActionCreators from "../actions/ImageActionCreators";

import PluginsStore from "../stores/PluginsStore";
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
  const potentialImages = twitter.extractUrls(message.content);
  if (!potentialImages.length) {
    return Promise.resolve(message);
  }
  return Promise.all(
    potentialImages.filter(url => {
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
        image.thumbnail = {
          url: image.url
        };
        return image;
      });
    }
    return message;
  });
}

export function createMessage(roomId, content, subType) {
  const composerPlugins = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER);
  const message = {
    id: createNonce().toString(),
    roomId,
    content,
    type: "chat",
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };

  const preProcessors = composerPlugins
    .map(plugin => plugin.execute)
    .concat(extractImages);

  return preProcessors.reduce(
    (onGoing, processor) => onGoing.then(m => processor(m))
    , Promise.resolve(message));
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

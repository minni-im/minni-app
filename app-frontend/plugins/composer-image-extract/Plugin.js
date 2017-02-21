import twitter from "twitter-text";
import { Constants, register as PluginRegister } from "minni-plugins-toolkit";
import ImageActionCreators from "../../actions/ImageActionCreators";
import ImageStore from "../../stores/ImageStore";

const { COMPOSER_TEXT } = Constants.PLUGIN_TYPES;
const REGEX_IMAGE = /\.(?:jpe?g|png|gif|webp|bmp|tiff|svg)$/i;

PluginRegister("ImageExtractor", COMPOSER_TEXT, {
  encodeMessage(message) {
    const potentialImages = twitter.extractUrls(message.content);
    if (!potentialImages.length) {
      return Promise.resolve(message);
    }
    return Promise
      .all(
        potentialImages.filter(url => REGEX_IMAGE.test(url)).map((url) => {
          const image = ImageStore.getImage(url);
          if (image) {
            return { url, width: image.width, height: image.height };
          }
          return ImageActionCreators.loadImage(url);
        })
      )
      .then((images) => {
        if (images.length) {
          message.embeds = images.map((image) => {
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
});

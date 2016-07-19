import twitter from "twitter-text";
import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";
import ImageActionCreators from "../../actions/ImageActionCreators";
import ImageStore from "../../stores/ImageStore";

const { PLUGIN_TYPES } = Constants;
const REGEX_IMAGE = /\.(?:jpe?g|png|gif|webp|bmp|tiff|svg)$/i;

PluginRegister("ImageExtractor", PLUGIN_TYPES.COMPOSER, {
  execute(message) {
    const potentialImages = twitter.extractUrls(message.content);
    if (!potentialImages.length) {
      return Promise.resolve(message);
    }
    return Promise.all(
      potentialImages
        .filter(url => REGEX_IMAGE.test(url))
        .map(url => {
          const image = ImageStore.getImage(url);
          if (image) {
            return { url, width: image.width, height: image.height };
          }
          return ImageActionCreators.loadImage(url);
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
});

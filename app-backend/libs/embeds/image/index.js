import twitter from "twitter-text";

const REGEX_IMAGE = /\.(?:jpe?g|png|gif|webp|bmp|tiff|svg)$/i;


function extractImages(text) {
  return twitter.extractUrls(text)
    .filter(url => {
      return REGEX_IMAGE.test(url);
    });
}


export default {
  match(text) {
    console.log("Image:match", extractImages(text));
    return extractImages(text).length > 0;
  },

  process(text) {
    return extractImages(text)
      .map(url => {
        return { type: "image", url };
      });
  }
};

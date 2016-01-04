import Base from "../../base";

const REGEXP_FLICKR = /^https?:\/\/(?:[^\.]+\.)?flickr\.com\/photos\/([a-zA-Z@_\$!\d\-]+)\/([\d]+[\d])\/?/;

const REGEXP_FLICKR_SHORT = /^https?:\/\/flic\.kr\/p\/([a-zA-Z@_\$!\d\-]+)\/([\d]+[\d])\/?/;

export default class FlickrEmbed extends Base {
  constructor() {
    super();
    this.name = "Flickr";
    this.type = "image.flickr";
  }

  endpointUrl({ url }) {
    return `https://www.flickr.com/services/oembed?format=json&url=${url}`;
  }

  match(source) {
    return REGEXP_FLICKR.exec(source) ||
      REGEXP_FLICKR_SHORT.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      username: capture[1],
      photoId: capture[2]
    };
  }
}

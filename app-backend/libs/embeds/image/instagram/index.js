import Base from "../../base";

const REGEXP_INSTAGRAM = /^https?:\/\/(?:www\.)?instagram\.com\/p\/([^\/]+)\/?/;

const REGEXP_INSTAGRAM_SHORT = /^https?:\/\/instagr\.am\/p\/([^\/]+)\/?/;

export default class InstagramEmbed extends Base {
  constructor() {
    super();
    this.name = "Instagram";
    this.type = "image.instagram";
  }

  endpointUrl({ url }) {
    return `http://api.instagram.com/oembed?url=${url}`;
  }

  match(source) {
    return REGEXP_INSTAGRAM.exec(source) ||
      REGEXP_INSTAGRAM_SHORT.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      id: capture[1]
    };
  }
}

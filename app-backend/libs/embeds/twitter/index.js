import Base from "../base";

const REGEXP_TWITTER =
/^https?:\/\/(?:www|mobile\.)?twitter\.com\/(?:#!\/)?[^\/]+\/status(?:es)?\/(\d+)\/?/;


const REGEXP_TWITTER_PHOTO = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?[^\/]+\/status(?:es)?\/(\d+)\/photo\/\d+(?:\/large|\/)?/;

export default class TwitterEmbed extends Base {
  constructor() {
    super();
    this.name = "Twitter";
  }

  match(source) {
    return REGEXP_TWITTER.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0]
    };
  }

  process(element) {
    return element;
  }
};

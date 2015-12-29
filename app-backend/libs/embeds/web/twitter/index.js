import Base from "../../base";

const REGEXP_TWITTER =
/^https?:\/\/(?:www|mobile\.)?twitter\.com\/(?:#!\/)?([^\/]+)\/status(?:es)?\/(\d+)\/?/;


const REGEXP_TWITTER_PHOTO = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?[^\/]+\/status(?:es)?\/(\d+)\/photo\/\d+(?:\/large|\/)?/;

export default class TwitterEmbed extends Base {
  constructor() {
    super();
    this.name = "Twitter";
    this.type = "web.twitter";
  }

  match(source) {
    return REGEXP_TWITTER.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      username: capture[1],
      id: capture[2]
    };
  }

  process(element) {
    return element;
  }
};

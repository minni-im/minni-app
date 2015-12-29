import Base from "../../base";

const REGEXP_VIDEO = /^(https?:\/\/\S*\.(?:ogv|webm|mp4|mov))(?:\s+|$)?/;

export default class VideoEmbed extends Base {
  constructor() {
    super();
    this.name = "Video";
  }

  match(source) {
    return REGEXP_VIDEO.exec(source);
  }

  parse(capture) {
    return {
      url: capture[1]
    };
  }

  process(element) {
    return element;
  }
}

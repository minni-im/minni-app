import { Embed, register } from "@minni-im/minni-embed";

const REGEXP_VIDEO = /^(https?:\/\/\S*\.(?:ogv|webm|mp4|mov))(?:\s+|$)?/;

export const name = "video";

export default class VideoEmbed extends Embed {
  name = name;

  match(source) {
    return REGEXP_VIDEO.exec(source);
  }

  parse(capture) {
    return {
      url: capture[1],
    };
  }

  process(element) {
    return element;
  }
}

export function init() {
  register(new VideoEmbed());
}

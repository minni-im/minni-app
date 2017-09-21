import { Embed, register } from "@minni-im/minni-embed";

const REGEXP_AUDIO = /^(https?:\/\/\S*\.(?:wav|mp3|ogg))(?:\s+|$)?/;

export const name = "Audio";

export default class AudioEmbed extends Embed {
  name = name;

  match(source) {
    return REGEXP_AUDIO.exec(source);
  }

  parse(capture) {
    return {
      url: capture[1],
    };
  }

  exec(element) {
    return element;
  }
}

export function init() {
  register(new AudioEmbed());
}

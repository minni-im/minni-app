import Base from "../../base";

const REGEXP_AUDIO = /^(https?:\/\/\S*\.(?:wav|mp3|ogg))(?:\s+|$)?/;

export default class AudioEmbed extends Base {
  constructor() {
    super();
    this.name = "Audio";
  }

  match(source) {
    return REGEXP_AUDIO.exec(source);
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

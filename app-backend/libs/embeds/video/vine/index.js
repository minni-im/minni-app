import Base from "../../base";

const REGEXP_VINE = /^https?:\/\/vine.co\/v\/([a-zA-Z0-9]+[a-zA-Z0-9])/;

export default class VineEmbed extends Base {
  constructor() {
    super();
    this.name = "Vine";
    this.type = "video.vine";
  }

  endpointUrl({ id }) {
    return `https://vine.co/oembed.json?id=${id}`;
  }

  match(source) {
    return REGEXP_VINE.exec(source);
  }

  parse(capture) {
    return {
      id: capture[1],
      url: capture[0]
    };
  }
}

import { OEmbed, register } from "@minni-im/minni-embed";

const REGEXP_VINE = /^https?:\/\/vine.co\/v\/([a-zA-Z0-9]+[a-zA-Z0-9])/;

export const name = "Vine";
export const type = "video.vine";

export default class VineEmbed extends OEmbed {
  name = name;
  type = type;

  endpointUrl({ id }) {
    return `https://vine.co/oembed.json?id=${id}`;
  }

  match(source) {
    return REGEXP_VINE.exec(source);
  }

  parse(capture) {
    return {
      id: capture[1],
      url: capture[0],
    };
  }
}

export function init() {
  register(new VineEmbed());
}

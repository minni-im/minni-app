import { OEmbed, register } from "@minni-im/minni-embed";

const REGEXP_INSTAGRAM = /^https?:\/\/(?:www\.)?instagram\.com\/p\/([^\/]+)\/?/;
const REGEXP_INSTAGRAM_SHORT = /^https?:\/\/instagr\.am\/p\/([^\/]+)\/?/;

export const name = "Instagram";
export const type = "image.instagram";

export default class InstagramEmbed extends OEmbed {
  name = name;
  type = type;

  endpointUrl({ url }) {
    return `http://api.instagram.com/oembed?url=${url}`;
  }

  match(source) {
    return REGEXP_INSTAGRAM.exec(source) || REGEXP_INSTAGRAM_SHORT.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      id: capture[1],
    };
  }
}

export function init() {
  register(new InstagramEmbed());
}

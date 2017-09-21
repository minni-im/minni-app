import { OEmbed, register } from "@minni-im/minni-embed";

const REGXEP_VIMEO = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+\d)/;

export const name = "Vimeo";
export const type = "video.vimeo";

export default class VimeoEmbed extends OEmbed {
  name = name;
  type = type;

  endpointUrl({ url }) {
    // `https://vimeo.com/api/v2/video/${id}.json`
    return `https://vimeo.com/api/oembed.json?url=${encodeURI(url)}&width=450`;
  }

  match(source) {
    return REGXEP_VIMEO.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      id: capture[1],
    };
  }
}

export function init() {
  register(new VimeoEmbed());
}

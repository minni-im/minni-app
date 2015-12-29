import Base from "../../base";

const REGXEP_VIMEO = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+\d)/;

export default class VimeoEmbed extends Base {
  constructor() {
    super();
    this.name = "Vimeo";
  }

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
      id: capture[1]
    };
  }
};

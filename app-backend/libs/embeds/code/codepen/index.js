import Base from "../../base";

const REGEX_CODEPEN = /^https?:\/\/codepen\.io\/([a-zA-Z0-9_-]+)\/pen\/([^\s$]*)/;

export default class CodePenEmbed extends Base {
  constructor() {
    super();
    this.name = "CodePen";
    this.type = "code.codepen";
  }

  parse(capture) {
    return {
      url: capture[0],
      user: capture[1]
    };
  }

  endpointUrl({ url }) {
    return `http://codepen.io/api/oembed?format=json&url=${url}`;
  }

  match(source) {
    return REGEX_CODEPEN.exec(source);
  }
}

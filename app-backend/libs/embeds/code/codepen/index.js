import { OEmbed, register } from "@minni-im/minni-embed";

const REGEX_CODEPEN = /^https?:\/\/codepen\.io\/([a-zA-Z0-9_-]+)\/pen\/([^\s$]*)/;

export const name = "CodePen";
export const type = "code.codepen";

export default class CodePenEmbed extends OEmbed {
  name = name;
  type = type;

  parse(capture) {
    return {
      url: capture[0],
      user: capture[1],
    };
  }

  endpointUrl({ url }) {
    return `http://codepen.io/api/oembed?format=json&url=${url}`;
  }

  match(source) {
    return REGEX_CODEPEN.exec(source);
  }
}

export function init() {
  register(new CodePenEmbed());
}

import SimpleMarkdown from "simple-markdown";

import Spotify from "./spotify";
import Twitter from "./twitter";
import Vimeo from "./vimeo";
import Youtube from "./youtube";

let namedEmbeds = {};
export const embeds = [
  new Spotify(), new Youtube(), new Twitter(), new Vimeo()
];

const RULES = {
  newline: SimpleMarkdown.defaultRules.newline,
  text: SimpleMarkdown.defaultRules.text
}

embeds.forEach(embed => {
  const embedName = embed.name.toLowerCase();
  namedEmbeds[embedName] = embed;
  RULES[embedName] = {
    order: SimpleMarkdown.defaultRules.url.order,
    match: embed.match,
    parse: embed.parse
  }
});

let parser = SimpleMarkdown.parserFor(RULES);

export function parse(message) {
  return parser(message, { inline: true })
    .filter(p => p.type !== "text");
}

export function process(tree) {
  return Promise.all(tree.map(element => {
    return namedEmbeds[element.type].process(element)
  }));
}

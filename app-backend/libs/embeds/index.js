import SimpleMarkdown from "simple-markdown";
import { auth, embed } from "../../config";

const { active, providers } = embed;

import Audio from "./audio/basic";
import Spotify from "./audio/spotify";
import Gist from "./code/gist";
import Github from "./code/github";
import Flickr from "./image/flickr";
import Instagram from "./image/instagram";
import Video from "./video/basic";
import Vimeo from "./video/vimeo";
import Vine from  "./video/vine";
import Youtube from "./video/youtube";
import Twitter from "./web/twitter";

const list = { Audio, Spotify, Gist, Github, Flickr, Instagram, Video, Vimeo, Vine, Youtube, Twitter };

let namedEmbeds = {};
export const embeds = [];
for (const embedName of providers) {
  embeds.push(new list[embedName](auth[embedName.toLowerCase()]));
}

const RULES = {
  newline: SimpleMarkdown.defaultRules.newline,
  text: SimpleMarkdown.defaultRules.text
}

embeds.forEach(embed => {
  const embedName = embed.name
    .replace(/\s/g, "_")
    .toLowerCase();
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
  }))
  .then(results => results.filter(result => result !== false));
}

export default function(message) {
  if (!active) {
    // Returning empty array to emulate nothing was found.
    return Promise.resolve([]);
  }
  const tree = parse(message);
  return process(tree);
}

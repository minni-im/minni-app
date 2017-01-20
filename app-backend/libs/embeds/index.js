import SimpleMarkdown from "simple-markdown";
import config from "../../config";

import Audio from "./audio/basic";
import Spotify from "./audio/spotify";
import Gist from "./code/gist";
import Github from "./code/github";
import CodePen from "./code/codepen";
import Flickr from "./image/flickr";
import Instagram from "./image/instagram";
import Video from "./video/basic";
import Vimeo from "./video/vimeo";
import Vine from "./video/vine";
import Youtube from "./video/youtube";
import Twitter from "./web/twitter";

const { auth, embed } = config;
const { active, providers } = embed;

const list = {
  Audio,
  Spotify,
  Gist,
  Github,
  CodePen,
  Flickr,
  Instagram,
  Video,
  Vimeo,
  Vine,
  Youtube,
  Twitter };

const namedEmbeds = {};
export const embeds = [];
for (const embedName of providers) {
  embeds.push(new list[embedName](auth[embedName.toLowerCase()]));
}

const RULES = {
  newline: SimpleMarkdown.defaultRules.newline,
  text: SimpleMarkdown.defaultRules.text
};

embeds.forEach((e) => {
  const embedName = e.name
    .replace(/\s/g, "_")
    .toLowerCase();
  namedEmbeds[embedName] = e;
  RULES[embedName] = {
    order: SimpleMarkdown.defaultRules.url.order,
    match: e.match,
    parse: e.parse
  };
});

const parser = SimpleMarkdown.parserFor(RULES);

export function parse(message) {
  return parser(message, { inline: true })
    .filter(p => p.type !== "text");
}

export function process(tree) {
  return Promise.all(tree.map((element) => {
    const embedProcessor = namedEmbeds[element.type];
    return embedProcessor.process(element);
  }))
  .then(results => results.filter(result => result !== false));
}

export default function (message) {
  if (!active) {
    // Returning empty array to emulate nothing was found.
    return Promise.resolve([]);
  }
  const tree = parse(message);
  return process(tree);
}

import glob from "glob";
import path from "path";
import { parse, process } from "@minni-im/minni-embed";

import config from "../../config";

export { parse, process };

const { auth, embed } = config;
const { disabled } = embed;

const nodeModules = path.join(__dirname, "..", "..", "..", "node_modules");
const embeds = [[nodeModules, "@minni-im/minni-embed-*"], [nodeModules, "minni-embed-*"]]
  .map(fragments => path.join(...fragments))
  .map(p => glob.sync(p))
  .reduce((list, globs) => list.concat(globs), [])
  .map(p => p.replace(`${nodeModules}/`, ""))
  .concat([
    "./audio/audio",
    "./audio/spotify",
    "./code/codepen",
    "./code/gist",
    "./code/github",
    "./image/flickr",
    "./image/instagram",
    "./video/video",
    "./video/vine",
    "./video/vimeo",
    "./web/twitter",
  ]);

embeds.forEach((module) => {
  const shortName = module
    .split("/")
    .pop()
    .replace("minni-embed-", "");
  if (!disabled.includes(shortName)) {
    console.log(`Loading ${module} embed`);
    const { init, name } = require(module); // eslint-disable-line
    init({ ...embed[name], ...auth[name] });
  }
});

export default function (message) {
  return process(message);
}

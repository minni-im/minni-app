import Image from "./image";
import Spotify from "./spotify";
import Twitter from "./twitter";
import Vimeo from "./vimeo";
import Youtube from "./youtube";

const embeds = [
  Spotify, Twitter, Vimeo, Youtube, Image
];

export function process(text) {
  // TODO: To be removed
  console.log(`Embed processing: ${text}`);
  const matching =
    embeds
      .filter(embed => embed.match(text))
      .map(embed => {
        const processed = embed.process(text);
        return (processed instanceof Promise) ? processed : Promise.resolve(processed);
      });

  // TODO: To be removed
  console.log(matching.length, matching);
  return Promise.all(matching).catch(ex => {
    console.error(`[Embed engine failed]: ${ex}`);
  });
}

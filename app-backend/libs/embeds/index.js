import Image from "./image";
import Spotify from "./spotify";
import Twitter from "./twitter";
import Vimeo from "./vimeo";
import Youtube from "./youtube";

const embeds = [
  Spotify, Twitter, Vimeo, Youtube, Image
];

export function process(message) {
  const matching = embeds
    .filter(embed => embed.match(message))
    .map(embed => {
      return embed.process(message);
    });

  return Promise.all(matching)
    .then(detectedEmbeds => {
      // Using a Set here to dedupe embeds;
      const flatDedupedEmbeds = detectedEmbeds.reduce((flat, embed) => {
        embed.forEach(e => {
          flat.add(e);
        });
        return flat;
      }, new Set());
      return [...flatDedupedEmbeds];
    }, error => {
      console.error(`[Embed engine failed]: ${error}`);
    })
    .catch(ex => {
      console.error(`[Embed engine failed]: ${ex}`);
    });
}

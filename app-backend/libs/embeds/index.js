import twitter from "twitter-text";

import Image from "./image";
import Spotify from "./spotify";
import Twitter from "./twitter";
import Vimeo from "./vimeo";
import Youtube from "./youtube";

const embeds = [
  Spotify, Twitter, Vimeo, Youtube, Image
];

export function process(message) {
  const urls = [...new Set(twitter.extractUrls(message.content))];

  const matching = embeds
    .filter(embed => embed.match(message, urls))
    .map(embed => {
      return embed.process(message, urls);
    });

  return Promise.all(matching)
    .then(detectedEmbeds => {
      // Using a Set here to dedupe embeds;
      const flatDedupedEmbeds = detectedEmbeds.reduce((flat, embed) => {
        // in case an embed would failed, we don't reject to not stop `Promise.all()`
        // we simply return `resolve(false)`
        if (!embed || embed.length === 0) {
          return flat;
        }
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

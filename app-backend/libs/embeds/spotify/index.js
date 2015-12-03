import { version } from "../../../../package.json";
import twitter from "twitter-text";
import request from "request";

const REGEXP_OPEN_SPOTIFY = /https?:\/\/open\.spotify\.com\/(track|album)\/([0-9a-zA-Z]{22})/;
const REGEXP_SPOTIFY = /spotify\:(?:[^\s\S]*|$)/;


function endpointUrl(url) {
  return `https://embed.spotify.com/oembed/?format=json&url=${encodeURI(url)}`;
}


export default {
  match({ content }, urls) {
    // TODO: detect spotify url from `open.spotify.com`
    // TODO: detect spotify short pseudo uri `spotify:track:`
    return false;
  },

  process(message) {
    return false;
  }
};

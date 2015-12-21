import Base from "../base";

const REGEXP_OPEN_SPOTIFY = /^https?:\/\/open\.spotify\.com\/(track|album|artist)\/([0-9a-zA-Z]{22})/;
const REGEXP_SPOTIFY = /^spotify\:(track|album|artist)\:([0-9a-zA-Z]{22})/;

export default class SpotifyEmbed extends Base {
  constructor() {
    super();
    this.name = "Spotify";
  }
  
  endpointUrl({ url }) {
    return `https://embed.spotify.com/oembed/?format=json&url=${encodeURI(url)}`;
  }

  match(source) {
    return REGEXP_OPEN_SPOTIFY.exec(source) ||
      REGEXP_SPOTIFY.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      resource: capture[1],
      id: capture[2]
    }
  }
};

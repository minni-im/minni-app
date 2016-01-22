import Base from "../../base";

const REGEXP_OPEN_SPOTIFY = /^https?:\/\/open\.spotify\.com\/(track|album|artist|user\/[^\/]+\/playlist)\/([0-9a-zA-Z]{22})/;
const REGEXP_SPOTIFY = /^spotify\:(track|album|artist|user\/[^\/]+\/playlist)\:([0-9a-zA-Z]{22})/;

export default class SpotifyEmbed extends Base {
  constructor() {
    super();
    this.name = "Spotify";
    this.type = "audio.spotify";
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

  extractTitle({ title }, { resource }) {
    if (resource === "track" || resource === "album") {
      const [ author, ...rest ] = title.split("-");
      return { title: author.trim() };
    }
    if (resource.indexOf("user") === 0) {
      const [ noise, username, type ] = resource.split("/");
      return { title: username };
    }
    return { title };
  }

  extractDescription({ title }, { resource }) {
    if (resource === "track" || resource === "album") {
      const [ author, ...rest ] = title.split("-");
      return { description: rest.join("-").trim() };
    }
    if (resource.indexOf("user") === 0) {
      return { description: title };
    }
    return {};
  }
};

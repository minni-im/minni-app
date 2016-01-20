import { OpenGraph } from "../../base";

const REGEXP_MEDIUM = /^https:\/\/medium.com\/(@[\w-_0-9]+)\/([^\s$]*)/;
const REGEXP_MEDIUM_IMAGE_SIZE = /\/max\/\d+\//;
const THUMBNAIL_SIZE = 150;

export default class MediumEmbed extends OpenGraph {
  constructor() {
    super();
    this.name = "Medium";
    this.type = "web.medium";
    this.url = "https://medium.com";
  }

  parse(capture) {
    return {
      url: capture[0],
      author: capture[1]
    }
  }

  match(source) {
    return REGEXP_MEDIUM.exec(source);
  }

  extractAuthor({ openGraph }, { author }) {
    return {
      author: {
        name: author,
        url: `${this.url}/${author}`
      }
    };
  }

  extractThumbnail({ openGraph }) {
    return {
      thumbnail: {
        url: openGraph.image.replace(REGEXP_MEDIUM_IMAGE_SIZE, `/fit/c/${THUMBNAIL_SIZE}/${THUMBNAIL_SIZE}/`),
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE
      }
    }
  }
}

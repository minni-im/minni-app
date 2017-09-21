import { OEmbed, register } from "@minni-im/minni-embed";

const REGEXP_FLICKR = /^https?:\/\/(?:[^\.]+\.)?flickr\.com\/photos\/([a-zA-Z@_\$!\d\-]+)\/([\d]+[\d])\/?/;

const REGEXP_FLICKR_SHORT = /^https?:\/\/flic\.kr\/p\/([a-zA-Z@_\$!\d\-]+)\/([\d]+[\d])\/?/;

export const name = "Flickr";
export const type = "image.flickr";

export default class FlickrEmbed extends OEmbed {
  name = name;
  type = type;

  endpointUrl({ url }) {
    return `https://www.flickr.com/services/oembed?format=json&url=${url}`;
  }

  match(source) {
    return REGEXP_FLICKR.exec(source) || REGEXP_FLICKR_SHORT.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      username: capture[1],
      photoId: capture[2],
    };
  }

  extractThumbnail(data) {
    // Flickr image sizes info
    // Square75: sq, Square150: q, Thumbnail: t
    // Small240: s, Small320: n
    // Medium500: m, Medium640: z, Medium800: c
    // Large1024: l, Large1600: h, Large2048: k,
    // Orignial: o

    // Oembed returns Square150
    const { width, url } = super.extractThumbnail(data).thumbnail;
    return {
      url: url.replace("_q.", "_z."),
      width: 640,
    };
  }
}

export function init() {
  register(new FlickrEmbed());
}

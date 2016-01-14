import Base from "../../base";

const REGEXP_GIST = /^https:\/\/gist.github.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9]+)/;
const AVATAR_SIZE = 300;

export default class GistEmbed extends Base {
  constructor() {
    super();
    this.name = "Github Gist";
    this.type = "code.gist";
  }

  endpointUrl({ id }) {
    return `https://api.github.com/gists/${id}`;
  }

  match(source) {
    return REGEXP_GIST.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      username: capture[1],
      id: capture[2]
    }
  }
  extractMeta(data) {
    return {
       meta: {
         id: data.id,
         files: Object.keys(data.files).map(filename => {
           const file = data.files[filename];
           return {
             filename: filename,
             language: file.language,
             content: file.content,
             url: file.raw_url
           }
         })
       }
    };
  }

  extractThumbnail(data) {
    return {
      thumbnail: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        url: `${data.owner.avatar_url}&s=${AVATAR_SIZE}`
      }
    }
  }

  extractAuthor(data) {
    return {
       author: {
         name: data.owner.login,
         url: data.owner.html_url
       }
    }
  }
}

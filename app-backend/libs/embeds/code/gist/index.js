import Base from "../../base";

const REGEXP_GIST = /^https:\/\/gist.github.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9]+)/;

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

  extractData(data) {
    return {
      id: data.id,
      type: this.type,
      description: data.description || "",
      author: {
        name: data.owner.login,
        url: data.owner.html_url
      },
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
  }
}

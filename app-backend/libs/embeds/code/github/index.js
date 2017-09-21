import { OEmbed, register } from "@minni-im/minni-embed";

const REGEXP_GITHUB = /^https:\/\/github\.com\/([\w-_]+)(?:\/([\w-_]+[\w-_])\/?)?/;
const AVATAR_SIZE = 300;

export const name = "Github";

export default class GithubEmbed extends OEmbed {
  name = name;

  endpointUrl({ username, repo }) {
    if (username) {
      if (repo) {
        return `https://api.github.com/repos/${username}/${repo}`;
      }
      return `https://api.github.com/users/${username}`;
    }
  }

  match(source) {
    return REGEXP_GITHUB.exec(source);
  }

  parse(capture) {
    const element = {
      url: capture[0],
      username: capture[1],
    };
    if (capture[2]) {
      element.repo = capture[2];
    }
    return element;
  }

  extractData(data, { repo }) {
    return repo
      ? {
        type: "code.github.repo",
        provider: data.provider,
        title: data.full_name,
        description: data.description || data.bio || "",
        thumbnail: {
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          url: `${data.owner.avatar_url}&s=${AVATAR_SIZE}`,
        },
        author: {
          name: data.owner.login,
          url: data.owner.html_url,
        },
      }
      : {
        type: "code.github.user",
        provider: data.provider,
        title: data.login,
        thumbnail: {
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          url: `${data.avatar_url}&s=${AVATAR_SIZE}`,
        },
        author: {
          name: data.login,
          url: data.html_url,
        },
      };
  }
}

export function init() {
  register(new GithubEmbed());
}

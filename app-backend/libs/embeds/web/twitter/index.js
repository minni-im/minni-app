import fetch from "node-fetch";
import Base from "../../base";

const REGEXP_TWITTER =
/^https?:\/\/(?:www\.|mobile\.)?twitter\.com\/(?:#!\/)?([^\/]+)\/status(?:es)?\/(\d+)\/?/;

// const REGEXP_TWITTER_PHOTO = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?[^\/]+\/status(?:es)?\/(\d+)\/photo\/\d+(?:\/large|\/)?/;

const TWITTER_API_AUTH_URL = "https://api.twitter.com/oauth2/token";

function getUrlLink(url) {
  return `<a href="${url.url}" target="_blank">${url.display_url}</a>`;
}

function getUserLink(user) {
  const link = `https://twitter.com/${user.screen_name}`;
  return `<a href="${link}" target="_blank">@${user.screen_name}</a>`;
}

function getHashLink(tag) {
  const link = `https://twitter.com/hashtag/${encodeURIComponent(tag.text)}?src=hash`;
  return `<a href="${link}" target="_blank">#${tag.text}</a>`;
}

function transformText(text, entities) {
  if (!entities) {
    return text;
  }
  if (entities.hashtags) {
    for (let tag in entities.hashtags) {
      tag = entities.hashtags[tag];
      text = text.replace(`#${tag.text}`, getHashLink(tag));
    }
  }
  if (entities.user_mentions) {
    for (let user in entities.user_mentions) {
      user = entities.user_mentions[user];
      text = text.replace(new RegExp(`@${user.screen_name}`, "ig"), getUserLink(user));
    }
  }

  if (entities && entities.urls) {
    for (let url in entities.urls) {
      url = entities.urls[url];
      text = text.replace(url.url, getUrlLink(url));
    }
  }

  if (entities && entities.media) {
    for (let media in entities.media) {
      media = entities.media[media];
      text = text.replace(media.url, getUrlLink(media));
    }
  }

  return text;
}


export default class TwitterEmbed extends Base {
  constructor(config) {
    super();
    this.name = "Twitter";
    this.type = "web.twitter";
    this.config = config;
    if (!config || (config && (!config.id || !config.secret))) {
      throw new Error("Missing Twitter configuration. You have to declare an id and a secret in your 'settings.yml' file.");
    }

    this.hasValidToken = false;
    this.bearerToken = null;

    this.authorization();
  }

  endpointUrl({ id }) {
    return `https://api.twitter.com/1.1/statuses/show.json?id=${id}`;
  }

  match(source) {
    return REGEXP_TWITTER.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      username: capture[1],
      id: capture[2]
    };
  }

  process(element) {
    return this.authorization()
      .then((bearerToken) => {
        return super.process(element, {
          headers: {
            "Authorization": "Bearer " + bearerToken
          }
        });
      }, error => console.error("ERROR", error));
  }

  extractTitle(data) {
    return { title: data.user.name };
  }

  extractDescription(data) {
    return { description: data.text };
  }

  extractHtml(data) {
    return { html: transformText(data.text, data.entities) };
  }

  extractAuthor(data) {
    const { name, screen_name } = data.user;
    return {
      author: {
        name: `@${screen_name}`,
        url: `https://twitter.com/${screen_name}`
      }
    };
  }

  extractProvider(data) {
    return {
      provider: {
        name: "Twitter",
        url: "https://twitter.com"
      }
    };
  }

  extractThumbnail(data) {
    const { profile_image_url_https: url } = data.user;
    return {
      thumbnail: {
        width: 500,
        height: 500,
        url: url.replace("_normal.", ".")
      }
    };
  }

  extractMeta(data) {
    const { retweet_count, favorite_count } = data;
    return { meta: {
      retweet_count,
      favorite_count
    } };
  }

  // OAuth stuff
  get consumerKey() {
    return this.config.id;
  }

  get consumerSecret() {
    return this.config.secret;
  }

  get bearerTokenCredentials() {
    const key = encodeURIComponent(this.consumerKey);
    const secret = encodeURIComponent(this.consumerSecret);
    return new Buffer(`${key}:${secret}`).toString("base64");
  }

  authorization() {
    return new Promise((resolve, reject) => {
      if (this.hasValidToken) {
        return resolve(this.bearerToken);
      }
      return fetch(TWITTER_API_AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${this.bearerTokenCredentials}`
        },
        body: "grant_type=client_credentials"
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      })
      .then(response => response.json())
      .then(({ access_token }) => {
        this.hasValidToken = true;
        this.bearerToken = access_token;
        return resolve(access_token);
      })
      .catch((error) => {
        console.error(`[Twitter Embed] ${error}`);
        return reject(error);
      });
    });
  }
}

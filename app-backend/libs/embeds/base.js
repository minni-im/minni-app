import fetch from "node-fetch";

export default class Base {
  endpointUrl() {
    throw new Error("You have to implement a 'endpointUrl' method");
  }

  match() {
    throw new Error("You have to implement a 'match' method");
  }

  parse(capture) {
    return {
      url: capture[0],
    };
  }

  extractData(data = {}, element) {
    // default implementation supports only oEmbed endpoints
    return [
      {
        type: this.type || data.type,
      },
      this.extractTitle(data, element),
      this.extractHtml(data, element),
      this.extractDescription(data, element),
      this.extractThumbnail(data, element),
      this.extractProvider(data, element),
      this.extractAuthor(data, element),
      this.extractWidth(data, element),
      this.extractHeight(data, element),
      this.extractMeta(data, element),
    ].reduce((ongoing, data) => Object.assign(ongoing, data), {});
  }

  extractTitle(data, element) {
    return { title: data.title };
  }

  extractDescription(data, element) {
    return data.description ? { description: data.description } : {};
  }

  extractHtml(data, element) {
    return {};
  }

  extractThumbnail(data, element) {
    return {
      thumbnail: {
        width: data.thumbnail_width,
        height: data.thumbnail_height,
        url: data.thumbnail_url,
      },
    };
  }

  extractAuthor(data, element) {
    let extractedData = {};
    if (data.author_name && data.author_url) {
      extractedData.author = {
        name: data.author_name,
        url: data.author_url,
      };
    }
    return extractedData;
  }

  extractProvider(data, element) {
    let extractedData = {};
    if (data.provider_name && data.provider_url) {
      extractedData.provider = {
        name: data.provider_name,
        url: data.provider_url,
      };
    }
    return extractedData;
  }

  extractWidth(data, element) {
    const condition = data.width && data.width != null;
    return condition ? { width: data.width } : {};
  }

  extractHeight(data, element) {
    const condition = data.height && data.height != null;
    return condition ? { height: data.height } : {};
  }

  extractMeta(data, element) {
    return {};
  }

  process(element, options = {}) {
    options = Object.assign(Object.assign({}, this.options), options);
    const apiUrl = this.endpointUrl(element);
    return new Promise((resolve) => {
      fetch(apiUrl, options)
        .then((res) => {
          if (res.status !== 200) {
            return resolve(false);
          }
          return res.json();
        })
        .then(data => this.extractData(data, element))
        .then((embed) => {
          embed.url = element.url;
          if (!embed.provider) {
            embed.provider = {
              name: this.name,
            };
          }

          if (!embed.type && this.type) {
            embed.type = this.type;
          }
          return resolve(embed);
        })
        .catch((ex) => {
          console.error(ex);
          return resolve(false);
        });
    });
  }
}

export class OpenGraph extends Base {
  parse(capture) {
    return {
      url: capture[0],
    };
  }

  endpointUrl({ url }) {
    return `https://opengraph.io/api/1.0/site/${url}`;
  }

  extractTitle({ openGraph }) {
    return { title: openGraph.title };
  }

  extractDescription({ openGraph }) {
    return { description: openGraph.description };
  }

  extractProvider({ openGraph }) {
    let provider = {
      provider: {
        name: openGraph.site_name,
      },
    };

    if (this.url) {
      provider.provider.url = this.url;
    }
    return provider;
  }

  extractThumbnail({ openGraph }) {
    return {
      thumbnail: {
        url: openGraph.image,
      },
    };
  }
}

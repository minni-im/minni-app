import fetch from "node-fetch";

export default class Base {
  endpointUrl() {
    throw new Error("You have to implement a 'endpointUrl' method");
  }

  match() {
    throw new Error("You have to implement a 'match' method");
  }

  parse(capture) {
    return {};
  }

  extractData(data) {
    // default implementation supports only oEmbed endpoints
    return {
      type: data.type,
      author: {
        name: data.author_name,
        url: data.author_url
      },
      thumbnail: {
        width: data.thumbnail_width,
        height: data.thumbnail_height,
        url: data.thumbnail_url
      },
      title: data.title,
      description: data.description
    };
  }

  process(element) {
    const apiUrl = this.endpointUrl(element);
    return new Promise((resolve, reject) => {
      fetch(apiUrl)
        .then(res => res.json())
        .then(this.extractData)
        .then(embed => {
          embed.url = element.url;
          embed.provider = this.name;
          return resolve(embed);
        });
    });
  }
}

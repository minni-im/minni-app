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
    let extractedData = {
      type: this.type || data.type,
      thumbnail: {
        width: data.thumbnail_width,
        height: data.thumbnail_height,
        url: data.thumbnail_url
      },
      title: data.title
    };

    if (data.author_name &&  data.author_url) {
      extractedData.author = {
        name: data.author_name,
        url: data.author_url
      };
    }

    if (data.description) {
      extractedData.description = data.description;
    }
    return extractedData;
  }

  process(element) {
    const apiUrl = this.endpointUrl(element);
    return new Promise((resolve) => {
      fetch(apiUrl)
        .then(res => {
          if (res.status !== 200) {
            return resolve(false);
          }
          return res.json();
        })
        .then(data => {
          return this.extractData(data, element);
        })
        .then(embed => {
          embed.url = element.url;
          embed.provider = this.name;
          if (!embed.type && this.type) {
            embed.type = this.type;
          }
          return resolve(embed);
        });
    });
  }
}

const data = {
  "hybridGraph": {
    "title": "Rey is a Kenobi",
    "description": "The Case for Why She’s Obi Wan’s Granddaughter",
    "image": "https://cdn-images-1.medium.com/max/800/1*1LUSeP43SoRNKuPckLybRQ.jpeg",
    "url": "https://medium.com/@benostrower/rey-is-a-kenobi-362b5af09849",
    "type": "article",
    "site_name": "Medium"
  },
  "openGraph": {
    "site_name": "Medium",
    "title": "Rey is a Kenobi",
    "url": "https://medium.com/@benostrower/rey-is-a-kenobi-362b5af09849",
    "image": "https://cdn-images-1.medium.com/max/800/1*1LUSeP43SoRNKuPckLybRQ.jpeg",
    "description": "The Case for Why She’s Obi Wan’s Granddaughter",
    "type": "article"
  },
  "htmlInferred": {
    "title": "Rey is a Kenobi — Medium",
    "description": "The Case for Why She’s Obi Wan’s Granddaughter",
    "images": [
      "https://cdn-images-1.medium.com/fit/c/24/24/0*6HIOe_NWK7RfyJth.jpeg",
      "https://cdn-images-1.medium.com/fit/c/36/36/0*6HIOe_NWK7RfyJth.jpeg",
      "https://cdn-images-1.medium.com/max/800/1*1LUSeP43SoRNKuPckLybRQ.jpeg",
      "https://cdn-images-1.medium.com/max/800/1*WwRg8STvpAR1yEKFDXK2kw.png",
      "https://cdn-images-1.medium.com/fit/c/60/60/0*6HIOe_NWK7RfyJth.jpeg",
      "https://cdn-images-1.medium.com/fit/c/40/40/0*6HIOe_NWK7RfyJth.jpeg"
    ],
    "image_guess": "https://cdn-images-1.medium.com/fit/c/24/24/0*6HIOe_NWK7RfyJth.jpeg"
  },
  "requestInfo": {
    "redirects": 0,
    "host": "medium.com",
    "responseCode": 200
  }
}

export default {
  status: 200,
  json() {
    return Promise.resolve(data);
  }
}

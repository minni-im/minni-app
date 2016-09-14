const mappings = {
  "http://www.youtube.com/oembed?url=https://youtube.com/watch?v=4SbiiyRSIwo&format=json": "youtube",
  "https://embed.spotify.com/oembed/?format=json&url=https://open.spotify.com/track/7Hj2D61IPaPICdGBXFj0cU": "spotify",
  "https://vimeo.com/api/oembed.json?url=https://vimeo.com/120876824&width=450": "vimeo",
  "https://vine.co/oembed.json?id=im5wjA9qDvM": "vine",
  "https://api.github.com/gists/4e4b3d8ec2868ae63596": "gist",
  "https://api.github.com/repos/minni-im/minni-app": "github-repo-minni-app",
  "https://api.github.com/users/bcharbonnier": "github-user-bcharbonnier",
  "https://www.flickr.com/services/oembed?format=json&url=https://www.flickr.com/photos/78986993@N00/3372549602/": "flickr",
  "https://api.instagram.com/oembed/?url=http://instagram.com/p/V8UMy0LjpX/": "instagram",

  "https://api.twitter.com/1.1/statuses/show.json?id=681507091064946688": "twitter",
  "https://api.twitter.com/oauth2/token": "twitter-auth-token",
  "https://opengraph.io/api/1.0/site/https://medium.com/@benostrower/rey-is-a-kenobi-362b5af09849": "medium",
  "http://codepen.io/api/oembed?format=json&url=http://codepen.io/captainbrosset/pen/lHpnK": "codepen"
};

function fake(url, options = {}) {
  if (!(url in mappings)) {
    return Promise.resolve({
      status: 404
    });
  }
  const filename = `./${mappings[url]}`;
  return Promise.resolve(require.requireActual(filename).default);
}

export default jest.genMockFunction().mockImplementation(fake);

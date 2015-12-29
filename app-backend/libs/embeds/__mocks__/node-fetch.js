const mappings = {
  "http://www.youtube.com/oembed?url=https://youtube.com/watch?v=4SbiiyRSIwo&format=json": "youtube",
  "https://embed.spotify.com/oembed/?format=json&url=https://open.spotify.com/track/7Hj2D61IPaPICdGBXFj0cU": "spotify",
  "https://vimeo.com/api/oembed.json?url=https://vimeo.com/120876824&width=450": "vimeo",
  "https://vine.co/oembed.json?id=im5wjA9qDvM": "vine",
  "https://api.github.com/gists/4e4b3d8ec2868ae63596": "gist",
  "https://api.github.com/repos/minni-im/minni-app": "github-repo-minni-app",
  "https://api.github.com/users/bcharbonnier": "github-user-bcharbonnier"
}

function fake(url, options = {}) {
  const filename = `./${mappings[url]}`;
  return Promise.resolve(require.requireActual(filename));
}

let fetch = jest.genMockFunction().mockImplementation(fake);
export default fetch;

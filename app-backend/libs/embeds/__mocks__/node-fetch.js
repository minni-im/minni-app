const mappings = {
  "http://www.youtube.com/oembed?url=https://youtube.com/watch?v=4SbiiyRSIwo&format=json": "youtube-4SbiiyRSIwo",
  "https://embed.spotify.com/oembed/?format=json&url=https://open.spotify.com/track/7Hj2D61IPaPICdGBXFj0cU": "spotify-7Hj2D61IPaPICdGBXFj0cU",
  "https://vimeo.com/api/oembed.json?url=https://vimeo.com/120876824&width=450": "vimeo-120876824"
}

function fake(url, options = {}) {
  const filename = `./${mappings[url]}`;
  return Promise.resolve(require.requireActual(filename));
}

let fetch = jest.genMockFunction().mockImplementation(fake);
export default fetch;

jest.dontMock("simple-markdown");
jest.dontMock("../base");
jest.dontMock("../index");
[
  "spotify",
  "youtube",
  "twitter",
  "vimeo"
].forEach(embed => jest.dontMock(`../${embed}`));


const { parse, process } = require("../");

describe("Embed processor", () => {
  pit("should process all detected urls from message", function() {
    const privateVimeo = "https://vimeo.com/120876824";
    const tree = parse(`https://www.youtube.com/watch?v=4SbiiyRSIwo
      and https://open.spotify.com/track/7Hj2D61IPaPICdGBXFj0cU
      and ${privateVimeo}`);

    return process(tree).then(results => {
      expect(results.length).toEqual(2);
      {
        let { type, provider, author } = results[0];
        expect(type).toEqual("video");
        expect(provider).toEqual("Youtube");
        expect(author).toBeDefined();

      }

      {
        let { type, provider, author } = results[1];
        expect(type).toEqual("audio");
        expect(provider).toEqual("Spotify");
        expect(author).not.toBeDefined();
      }

    });
  });
});

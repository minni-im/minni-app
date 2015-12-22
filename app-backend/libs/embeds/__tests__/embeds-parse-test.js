jest.dontMock("simple-markdown");
jest.dontMock("../index");

[
  "spotify",
  "youtube",
  "twitter",
  "vimeo"
].forEach(embed => jest.dontMock(`../${embed}`));

const { parse } = require("../");

describe("Embed parser", () => {
  describe("Spotify", function() {
    it("should detect http links", function() {
      const tree = parse(`https://open.spotify.com/artist/5yxyJsFanEAuwSM5kOuZKc`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("spotify");
    });

    it("should detect spotify URI links", function() {
      const tree = parse(`spotify:track:6mOS5otVnh103JwefAKhwS`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("spotify");
    });
  });

  describe("Youtube", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://www.youtube.com/watch?v=4SbiiyRSIwo`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("youtube");
    });

    it("should detect short url", function() {
      const tree = parse(`https://youtu.be/XUvhAPs38RA`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("youtube");
    });

    it("should detect embed url", function() {
      const tree = parse(`https://www.youtube.com/embed/vsF0K3Ou1v0`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("youtube");
    });
  });

  describe("Twitter", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://twitter.com/patrickbrosset/status/675448727285448705`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("twitter");
    });

    it("should detect url with trailing /", function() {
      const tree = parse(`https://twitter.com/patrickbrosset/status/675448727285448705/`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("twitter");
    });
  });

  describe("Vimeo", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://vimeo.com/120876824`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("vimeo");
    });
  })

  it("should detect all urls from message", function() {
    const tree = parse(`Hello there ! please check these 2 links this morning: https://www.youtube.com/watch?v=4SbiiyRSIwo and https://twitter.com/patrickbrosset/status/675448727285448705`);
    expect(tree.length).toEqual(2);
    expect(tree[0].type).toEqual("youtube");
    expect(tree[1].type).toEqual("twitter");
  });

});

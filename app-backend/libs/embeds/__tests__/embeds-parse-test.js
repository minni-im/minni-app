jest.dontMock("simple-markdown");
jest.dontMock("../index");

const fs = require.requireActual("fs");
const path = require.requireActual("path");

function dontMockFolder(folder) {
  const dir = path.join(__dirname, "..", folder);
  fs.readdirSync(dir).forEach(file => {
    if (file.indexOf("__") === 0) {
      return;
    }
    const stats = fs.lstatSync(path.join(dir, file));
    if (stats.isDirectory()) {
      jest.dontMock(`../${folder}/${file}`)
    }
  });
}

dontMockFolder("audio");
dontMockFolder("code");
dontMockFolder("video");
dontMockFolder("web");

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

      expect(tree[0].username).toEqual("patrickbrosset");
      expect(tree[0].id).toEqual("675448727285448705");
    });
  });

  describe("Vine", function() {
    it("should detect standard url", function() {
      const tree = parse(`Hello foo, check this Vine
      https://vine.co/v/im5wjA9qDvM`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("vine");
      expect(tree[0].id).toEqual("im5wjA9qDvM");
    });
  });

  describe("Vimeo", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://vimeo.com/120876824`);
      expect(tree.length).toEqual(1);
      expect(tree[0].type).toEqual("vimeo");
    });
  })

  describe("Gist", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://gist.github.com/bcharbonnier/0dcf15df255767a4bf18`);
      expect(tree.length).toEqual(1);
      expect(tree[0].username).toEqual("bcharbonnier");
      expect(tree[0].id).toEqual("0dcf15df255767a4bf18");
    });
  });

  it("should detect all urls from message", function() {
    const tree = parse(`Hello there ! please check these 2 links this morning: https://www.youtube.com/watch?v=4SbiiyRSIwo and https://twitter.com/patrickbrosset/status/675448727285448705and
      https://example.com/foo/bar/baz.ogg`);
    expect(tree.length).toEqual(3);
    expect(tree[0].type).toEqual("youtube");
    expect(tree[1].type).toEqual("twitter");
    expect(tree[2].type).toEqual("audio");
  });

});

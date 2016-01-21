jest.dontMock("simple-markdown");
jest.dontMock("../../../config");
jest.dontMock("../base");
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
dontMockFolder("image");
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
      const tree = parse(`solange: https://gist.github.com/bcharbonnier/0dcf15df255767a4bf18`);
      expect(tree.length).toEqual(1);
      expect(tree[0].username).toEqual("bcharbonnier");
      expect(tree[0].id).toEqual("0dcf15df255767a4bf18");
    });
  });

  describe("Flickr", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://www.flickr.com/photos/78986993@N00/3372549602/`);
      expect(tree.length).toEqual(1);
      expect(tree[0].username).toEqual("78986993@N00");
      expect(tree[0].photoId).toEqual("3372549602");
    });

    it("should detect standard url w/o trailing /", function() {
      const tree = parse(` https://www.flickr.com/photos/78986993@N00/3372549602`);
      expect(tree.length).toEqual(1);
      expect(tree[0].username).toEqual("78986993@N00");
      expect(tree[0].photoId).toEqual("3372549602");
    });

    it("should detect short url", function() {
      const tree = parse(`https://flic.kr/p/78986993@N00/3372549602/`);
      expect(tree.length).toEqual(1);
      expect(tree[0].username).toEqual("78986993@N00");
      expect(tree[0].photoId).toEqual("3372549602");
    });
  });

  describe("Instagram", function() {
    it("should detect standard url", function() {
      const tree = parse(`https://instagram.com/p/V8UMy0LjpX/`);
      expect(tree.length).toEqual(1);
      expect(tree[0].id).toEqual("V8UMy0LjpX");
    });

    it("should detect short url", function() {
      const tree = parse(`https://instagr.am/p/V8UMy0LjpX/`);
      expect(tree.length).toEqual(1);
      expect(tree[0].id).toEqual("V8UMy0LjpX");
    });
  });

  describe("Medium", function() {
    it("should detect medium urls", function() {
      const url = "https://medium.com/@benostrower/rey-is-a-kenobi-362b5af09849";
      const tree = parse(`un peu de meidum sur #starwars ${url} attention ca spoile !`);
      expect(tree.length).toEqual(1);
      expect(tree[0].url).toEqual(url);
    });
  });

  describe("CodePen", function() {
    it("should detect codepen url", function() {
      const url = "http://codepen.io/captainbrosset/pen/lHpnK";
      const tree = parse(`tu sais comment marche les CSS Transforms? Regarde ce pen http://codepen.io/captainbrosset/pen/lHpnK`);
      expect(tree.length).toEqual(1);
      expect(tree[0].url).toEqual(url);
    });
  });

  it("should detect all urls from message", function() {
    const tree = parse(`Hello there ! please check these 2 links this morning: https://www.youtube.com/watch?v=4SbiiyRSIwo and https://twitter.com/patrickbrosset/status/675448727285448705 and
      https://example.com/foo/bar/baz.ogg`);
    expect(tree.length).toEqual(3);
    expect(tree[0].type).toEqual("youtube");
    expect(tree[1].type).toEqual("twitter");
    expect(tree[2].type).toEqual("audio");
  });

});

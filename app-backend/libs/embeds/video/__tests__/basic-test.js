jest.dontMock("../../base");
jest.dontMock("../basic");

const Video = require("../basic");
const extensions = ["ogv", "webm", "mp4", "mov"];
let embed;

beforeEach(function() {
    embed = new Video();
});

describe("Video embed", function() {
  extensions.forEach(ext => {
    it(`should detect standalone '${ext}' video url`, function() {
      const message = `http://example.com/foo/bar/baz.${ext}`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(message);
    });

    it(`should detect '${ext}' video url with noise after`, function() {
      const url = `http://example.com/foo/bar/baz.${ext}`;
      const message = `${url} look at that !`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(url);
    });
  });

});

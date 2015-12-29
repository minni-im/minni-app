jest.dontMock("../basic");

const Audio = require("../basic");
const extensions = ["mp3", "wav", "ogg"];
let embed;

beforeEach(function() {
    embed = new Audio();
});

describe("Audio embed", function() {
  extensions.forEach(ext => {
    it(`should detect standalone '${ext}' audio url`, function() {
      const message = `http://example.com/foo/bar/baz.${ext}`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(message);
    });

    it(`should detect '${ext}' audio url with noise after`, function() {
      const url = `http://example.com/foo/bar/baz.${ext}`;
      const message = `${url} look at that !`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(url);
    });
  });

});

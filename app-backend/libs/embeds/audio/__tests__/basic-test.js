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

describe("Audio embed", function() {
  it("should process a single audio url in message", function() {
    const tree = {
      url: "http://example.com/foo/bar/baz.mp3"
    };
    const results = embed.process(tree);
    expect(results).toBeDefined();
    expect(results.url).toEqual(tree.url);
  });
});

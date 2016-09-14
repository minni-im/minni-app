import Audio from "../basic";

const extensions = ["mp3", "wav", "ogg"];
let embed;

beforeEach(() => {
  embed = new Audio();
});

describe("Audio embed", () => {
  extensions.forEach((ext) => {
    it(`should detect standalone '${ext}' audio url`, () => {
      const message = `http://example.com/foo/bar/baz.${ext}`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(message);
    });

    it(`should detect '${ext}' audio url with noise after`, () => {
      const url = `http://example.com/foo/bar/baz.${ext}`;
      const message = `${url} look at that !`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(url);
    });
  });
});

describe("Audio embed", () => {
  it("should process a single audio url in message", () => {
    const tree = {
      url: "http://example.com/foo/bar/baz.mp3"
    };
    const results = embed.process(tree);
    expect(results).toBeDefined();
    expect(results.url).toEqual(tree.url);
  });
});

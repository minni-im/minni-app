import Video from "./video";

const extensions = ["ogv", "webm", "mp4", "mov"];
let embed;

beforeEach(() => {
  embed = new Video();
});

describe("Video embed", () => {
  extensions.forEach((ext) => {
    it(`should detect standalone '${ext}' video url`, () => {
      const message = `http://example.com/foo/bar/baz.${ext}`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(message);
    });

    it(`should detect '${ext}' video url with noise after`, () => {
      const url = `http://example.com/foo/bar/baz.${ext}`;
      const message = `${url} look at that !`;
      const match = embed.match(message);
      expect(match).not.toBeNull();
      expect(embed.parse(match)).toBeDefined();
      expect(embed.parse(match).url).toEqual(url);
    });
  });
});

import { process } from ".";

describe("Embed processor", () => {
  it("should return empty array in case nothing is detected", () =>
    process("Hello there !").then((results) => {
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toEqual(0);
    }));

  it("should process twice the same url in message", () =>
    process(`https://www.youtube.com/watch?v=4SbiiyRSIwo
      and https://www.youtube.com/watch?v=4SbiiyRSIwo`).then((results) => {
        expect(results.length).toEqual(2);
        expect(results[0]).toEqual(results[1]);
      }));

  it("should process audio urls", () => {
    const urls = ["http://example.com/foo/baz.mp3", "https://example.org/music/free.ogg"];
    return process(`Some raw music ${urls[0]} and ${urls[1]}`).then((results) => {
      expect(results.length).toEqual(2);
      urls.forEach((url, index) => {
        expect(results[index]).toEqual({
          type: "audio",
          url,
        });
      });
    });
  });

  it("should process video urls", () => {
    const urls = ["https://example.com/foo/bar/baz.ogv", "https://vine.co/v/im5wjA9qDvM"];
    return process(`ovg: ${urls[0]} and vine: ${urls[1]}`).then((results) => {
      expect(results.length).toEqual(2);
      expect(results[0]).toEqual({
        type: "video",
        url: urls[0],
      });

      const { type, provider, author } = results[1];
      expect(type).toEqual("video.vine");
      expect(provider).toEqual({
        name: "Vine",
        url: "https://vine.co/",
      });
      expect(author).toBeDefined();
    });
  });

  it("should process gist urls", () =>
    process(
      "This is solange: https://gist.github.com/bbaliguet/4e4b3d8ec2868ae63596 et ca envoie de la buche"
    ).then((results) => {
      expect(results.length).toEqual(1);
      const { type, author, description, meta } = results[0];
      expect(type).toEqual("code.gist");
      expect(description).toEqual("Roulotte is speaking !");
      expect(author).toEqual({
        name: "bbaliguet",
        url: "https://github.com/bbaliguet",
      });

      const [{ filename, language }] = meta.files;
      expect(filename).toBe("solange.js");
      expect(language).toBe("JavaScript");
    }));

  it("should process github user url", () =>
    process("here is my github page https://github.com/bcharbonnier").then((results) => {
      expect(results.length).toEqual(1);
      const { type, author, thumbnail } = results[0];
      expect(type).toEqual("code.github.user");
      expect(author.name).toEqual("bcharbonnier");
      expect(thumbnail.url).toEqual("https://avatars.githubusercontent.com/u/583204?v=3&s=300");
    }));

  it("should process github repo url", () =>
    process(
      "here is my github project page https://github.com/minni-im/minni-app"
    ).then((results) => {
      expect(results.length).toEqual(1);
      const { type, title, description, thumbnail } = results[0];
      expect(type).toEqual("code.github.repo");
      expect(title).toEqual("minni-im/minni-app");
      expect(description).toEqual("Anywhere should be the place to be working from");
      expect(thumbnail.url).toEqual("https://avatars.githubusercontent.com/u/8825731?v=3&s=300");
    }));

  it("should process flickr url", () =>
    process(
      "here is a nice pic: https://www.flickr.com/photos/78986993@N00/3372549602/"
    ).then((results) => {
      expect(results.length).toEqual(1);
      const { type, provider } = results[0];
      expect(type).toEqual("image.flickr");
      expect(provider).toEqual({
        name: "Flickr",
        url: "https://www.flickr.com/",
      });
    }));

  it("should process codepen url", () => {
    const url = "http://codepen.io/captainbrosset/pen/lHpnK";
    return process(
      `tu sais comment marche les CSS Transforms? Regarde ce pen ${url}`
    ).then((results) => {
      expect(results.length).toEqual(1);
      const { type, provider } = results[0];
      expect(type).toEqual("code.codepen");
      expect(provider).toEqual({
        name: "CodePen",
        url: "http://codepen.io",
      });
    });
  });

  it("should process twitter url", () =>
    process(
      "yop yop https://twitter.com/patrickbrosset/status/681507091064946688"
    ).then((results) => {
      expect(results.length).toEqual(1);
      const { title, description, provider, author } = results[0];
      expect(title).toEqual("Patrick Brosset");
      expect(description).toEqual(
        "xmas is the only time of year I have time to take photos anymore. So there, trees &amp; sunrise: https://t.co/TvvgacvMUy https://t.co/UmaJjr6FmN"
      );
      expect(author).toEqual({
        name: "@patrickbrosset",
        url: "https://twitter.com/patrickbrosset",
      });
      expect(provider).toEqual({
        name: "Twitter",
        url: "https://twitter.com",
      });
    }));

  it("should process all detected urls from message", () => {
    const privateVimeo = "https://vimeo.com/120876824";
    return process(`https://www.youtube.com/watch?v=4SbiiyRSIwo
      and https://open.spotify.com/track/7Hj2D61IPaPICdGBXFj0cU
      and ${privateVimeo}
      and https://example.com/foo/bar/baz.webm`).then((results) => {
        expect(results.length).toEqual(3);
        {
          const { type, provider, author } = results[0];
          expect(type).toEqual("video.youtube");
          expect(provider).toEqual({
            name: "YouTube",
            url: "https://www.youtube.com/",
          });
          expect(author).toBeDefined();
        }

        {
          const { type, provider, author } = results[1];
          expect(type).toEqual("audio.spotify");
          expect(provider).toEqual({
            name: "Spotify",
            url: "https://www.spotify.com",
          });
          expect(author).not.toBeDefined();
        }

        {
          const { type, provider, author } = results[2];
          expect(type).toEqual("video");
          expect(provider).not.toBeDefined();
          expect(author).not.toBeDefined();
        }
      });
  });
});

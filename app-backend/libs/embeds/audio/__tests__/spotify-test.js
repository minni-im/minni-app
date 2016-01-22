jest.dontMock("../../base");
jest.dontMock("../spotify");

const Spotify = require("../spotify");
let embed;

beforeEach(function() {
  embed = new Spotify();
});

describe("Spotify embed", function() {
  it("should extract artist and track name from track url", function() {
    const element = {
      resource: "track"
    };
    const data = {
      title: "Muse - Dead Inside"
    };
    const { title } = embed.extractTitle(data, element);
    const { description } = embed.extractDescription(data, element);
    expect(title).toEqual("Muse");
    expect(description).toEqual("Dead Inside");
  });

  it("should extract artist and album name from album url", function() {
    const element = {
      resource: "album"
    };
    const data = {
      title: "Muse - Live At Rome Olympic Stadium"
    };
    const { title } = embed.extractTitle(data, element);
    const { description } = embed.extractDescription(data, element);
    expect(title).toEqual("Muse");
    expect(description).toEqual("Live At Rome Olympic Stadium");
  });

  it("should extract onwer and playlist name from user playlist url", function() {
    const element = {
      resource: "user/benoua/playlist"
    };
    const data = {
      title: "#01/16 - Jan2016 MixTape"
    };
    const { title } = embed.extractTitle(data, element);
    const { description } = embed.extractDescription(data, element);
    expect(title).toEqual("benoua");
    expect(description).toEqual("#01/16 - Jan2016 MixTape");
  });

  it("should transform thumbnail url", function() {
    const url = "https://d3rt1990lpmkn.cloudfront.net/cover/d83a086148afe6539dae524607cbe4b6ccdd0360";

    const { thumbnail } = embed.extractThumbnail({ thumbnail_url: url });
    expect(thumbnail.url).toEqual("https://d3rt1990lpmkn.cloudfront.net/640/d83a086148afe6539dae524607cbe4b6ccdd0360");
    expect(thumbnail.width).toEqual(320);
  });

});

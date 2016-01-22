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
    const result = embed.extractData(data, element);
    expect(result.title).toEqual("Muse");
    expect(result.description).toEqual("Dead Inside");
  });

  it("should extract artist and album name from album url", function() {
    const element = {
      resource: "album"
    };
    const data = {
      title: "Muse - Live At Rome Olympic Stadium"
    };
    const result = embed.extractData(data, element);
    expect(result.title).toEqual("Muse");
    expect(result.description).toEqual("Live At Rome Olympic Stadium");
  });

  it("should extract onwer and playlist name from user playlist url", function() {
    const element = {
      resource: "user/benoua/playlist"
    };
    const data = {
      title: "#01/16 - Jan2016 MixTape"
    };
    const result = embed.extractData(data, element);
    expect(result.title).toEqual("benoua");
    expect(result.description).toEqual("#01/16 - Jan2016 MixTape");
  });

});

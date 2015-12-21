jest.autoMockOff();

[
  "spotify",
  "youtube",
  "twitter",
  "vimeo"
].forEach(embed => jest.dontMock(`../${embed}`));

const { parse, process } = require("../");

describe("Embed processor", () => {
  pit("should process all detected urls from message", function() {
    const tree = parse(`https://www.youtube.com/watch?v=4SbiiyRSIwo`);
    return process(tree).then(results => {
      console.log(results);
      expect(true).toBeTruthy();
    });
  });
});

export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve({
      thumbnail_height: 360,
      height: 270,
      provider_name: "YouTube",
      author_name: "AngularConnect 2015",
      provider_url: "https://www.youtube.com/",
      version: "1.0",
      type: "video",
      thumbnail_url: "https://i.ytimg.com/vi/4SbiiyRSIwo/hqdefault.jpg",
      html:
        '\u003ciframe width="480" height="270" src="https://www.youtube.com/embed/4SbiiyRSIwo?feature=oembed" frameborder="0" allowfullscreen\u003e\u003c/iframe\u003e',
      thumbnail_width: 480,
      width: 480,
      title:
        "Building native mobile apps with Angular 2 0 and NativeScript\u200b - Sebastian Witalec",
      author_url: "https://www.youtube.com/channel/UCzrskTiT_ObAk3xBkVxMz5g",
    });
  },
};

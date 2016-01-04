const data = {
  "cache_age":"3153600000",
  "url":"https://twitter.com/patrickbrosset/statuses/681507091064946688",
  "height":null,
  "provider_url":"https://twitter.com",
  "provider_name":"Twitter",
  "author_name":"Patrick Brosset",
  "version":"1.0",
  "author_url":"https://twitter.com/patrickbrosset",
  "type":"rich",
  "html":"\u003Cblockquote class=\"twitter-tweet\" width=\"400\"\u003E\u003Cp lang=\"en\" dir=\"ltr\"\u003Exmas is the only time of year I have time to take photos anymore. So there, trees &amp; sunrise: \u003Ca href=\"https://t.co/TvvgacvMUy\"\u003Ehttps://t.co/TvvgacvMUy\u003C\/a\u003E \u003Ca href=\"https://t.co/UmaJjr6FmN\"\u003Epic.twitter.com\/UmaJjr6FmN\u003C\/a\u003E\u003C\/p\u003E&mdash; Patrick Brosset (@patrickbrosset) \u003Ca href=\"https://twitter.com/patrickbrosset/status/681507091064946688\"\u003EDecember 28, 2015\u003C\/a\u003E\u003C\/blockquote\u003E\n",
  "width":400
};

export default {
  status: 200,
  json() {
    return Promise.resolve(data);
  }
}

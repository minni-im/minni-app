const data = {
  "type":"photo",
  "flickr_type":"photo",
  "title":"Hexagonal Color Palette",
  "author_name":"g0upil",
  "author_url":"https://www.flickr.com/photos/78986993@N00/",
  "width":"1024",
  "height":"684",
  "url":"https://farm4.staticflickr.com/3599/3372549602_3eeee52790_b.jpg",
  "web_page":"https://www.flickr.com/photos/78986993@N00/3372549602/",
  "thumbnail_url":"https://farm4.staticflickr.com/3599/3372549602_3eeee52790_q.jpg",
  "thumbnail_width":150,
  "thumbnail_height":150,
  "web_page_short_url":"https://flic.kr/p/692cuW",
  "license":"Attribution-ShareAlike License",
  "license_url":"https://creativecommons.org/licenses/by-sa/2.0/",
  "license_id":"5",
  "html":"<a data-flickr-embed=\"true\" href=\"https://www.flickr.com/photos/78986993@N00/3372549602/\" title=\"Hexagonal Color Palette by g0upil, on Flickr\"><img src=\"https://farm4.staticflickr.com/3599/3372549602_3eeee52790_b.jpg\" width=\"1024\" height=\"684\" alt=\"Hexagonal Color Palette\"><\/a><script async src=\"https://embedr.flickr.com/assets/client-code.js\" charset=\"utf-8\"><\/script>",
  "version":"1.0",
  "cache_age":3600,
  "provider_name":"Flickr",
  "provider_url":"https://www.flickr.com/"
};

export default {
  status: 200,
  json() {
    return Promise.resolve(data);
  }
}

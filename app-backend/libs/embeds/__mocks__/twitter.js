const data = {
  created_at: "Mon Dec 28 16:08:46 +0000 2015",
  id: 681507091064946700,
  id_str: "681507091064946688",
  text:
    "xmas is the only time of year I have time to take photos anymore. So there, trees &amp; sunrise: https://t.co/TvvgacvMUy https://t.co/UmaJjr6FmN",
  source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
  truncated: false,
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: null,
  in_reply_to_user_id_str: null,
  in_reply_to_screen_name: null,
  user: {
    id: 17022950,
    id_str: "17022950",
    name: "Patrick Brosset",
    screen_name: "patrickbrosset",
    location: "",
    description: "Dijon - Mozilla - Javascript\nhttp://t.co/3b2nQVeaVb",
    url: null,
    entities: {
      description: {
        urls: [
          {
            url: "http://t.co/3b2nQVeaVb",
            expanded_url: "http://medium.com/@patrickbrosset",
            display_url: "medium.com/@patrickbrosset",
            indices: [29, 51],
          },
        ],
      },
    },
    protected: false,
    followers_count: 552,
    friends_count: 231,
    listed_count: 43,
    created_at: "Tue Oct 28 15:32:24 +0000 2008",
    favourites_count: 321,
    utc_offset: 3600,
    time_zone: "Paris",
    geo_enabled: true,
    verified: false,
    statuses_count: 2514,
    lang: "en",
    contributors_enabled: false,
    is_translator: false,
    is_translation_enabled: false,
    profile_background_color: "000000",
    profile_background_image_url: "http://abs.twimg.com/images/themes/theme14/bg.gif",
    profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme14/bg.gif",
    profile_background_tile: false,
    profile_image_url:
      "http://pbs.twimg.com/profile_images/551423570937536512/yL2O2o2N_normal.jpeg",
    profile_image_url_https:
      "https://pbs.twimg.com/profile_images/551423570937536512/yL2O2o2N_normal.jpeg",
    profile_banner_url: "https://pbs.twimg.com/profile_banners/17022950/1420304831",
    profile_link_color: "2864A0",
    profile_sidebar_border_color: "000000",
    profile_sidebar_fill_color: "000000",
    profile_text_color: "000000",
    profile_use_background_image: false,
    has_extended_profile: false,
    default_profile: false,
    default_profile_image: false,
    following: null,
    follow_request_sent: null,
    notifications: null,
  },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  retweet_count: 0,
  favorite_count: 3,
  entities: {
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [
      {
        url: "https://t.co/TvvgacvMUy",
        expanded_url: "https://www.flickr.com/photos/gnackgnackgnack/",
        display_url: "flickr.com/photos/gnackgn…",
        indices: [97, 120],
      },
    ],
    media: [
      {
        id: 681507088271601700,
        id_str: "681507088271601664",
        indices: [121, 144],
        media_url: "http://pbs.twimg.com/media/CXUzFgRW8AA10mB.jpg",
        media_url_https: "https://pbs.twimg.com/media/CXUzFgRW8AA10mB.jpg",
        url: "https://t.co/UmaJjr6FmN",
        display_url: "pic.twitter.com/UmaJjr6FmN",
        expanded_url: "http://twitter.com/patrickbrosset/status/681507091064946688/photo/1",
        type: "photo",
        sizes: {
          medium: {
            w: 600,
            h: 399,
            resize: "fit",
          },
          small: {
            w: 340,
            h: 226,
            resize: "fit",
          },
          thumb: {
            w: 150,
            h: 150,
            resize: "crop",
          },
          large: {
            w: 1024,
            h: 682,
            resize: "fit",
          },
        },
      },
    ],
  },
  extended_entities: {
    media: [
      {
        id: 681507088271601700,
        id_str: "681507088271601664",
        indices: [121, 144],
        media_url: "http://pbs.twimg.com/media/CXUzFgRW8AA10mB.jpg",
        media_url_https: "https://pbs.twimg.com/media/CXUzFgRW8AA10mB.jpg",
        url: "https://t.co/UmaJjr6FmN",
        display_url: "pic.twitter.com/UmaJjr6FmN",
        expanded_url: "http://twitter.com/patrickbrosset/status/681507091064946688/photo/1",
        type: "photo",
        sizes: {
          medium: {
            w: 600,
            h: 399,
            resize: "fit",
          },
          small: {
            w: 340,
            h: 226,
            resize: "fit",
          },
          thumb: {
            w: 150,
            h: 150,
            resize: "crop",
          },
          large: {
            w: 1024,
            h: 682,
            resize: "fit",
          },
        },
      },
    ],
  },
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  possibly_sensitive_appealable: false,
  lang: "en",
};

export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve(data);
  },
};

/*
{
  "t":"MESSAGE_UPDATE",
  "s":27,
  "op":0,
  "d":{
    "id":"132116809645031424",
    "embeds":[{
      "url":"https://twitter.com/patrickbrosset/status/681507091064946688",
      "type":"tweet",
      "title":"Patrick Brosset",
      "thumbnail":{
        "width":1023,
        "url":"https://pbs.twimg.com/media/CXUzFgRW8AA10mB.jpg:large",
        "proxy_url":"https://images.discordapp.net/eyJ1cmwiOiJodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ1hVekZnUlc4QUExMG1CLmpwZzpsYXJnZSJ9.x1SEwNbHtU9E5iKVuJpo0-4l_Zo.jpg:large",
        "height":682
      },
      "provider":{
        "url":"https://twitter.com",
        "name":"Twitter"
      },
      "description":"xmas is the only time of year I have time to take photos anymore. So there, trees &amp; sunrise: https://t.co/TvvgacvMUy",
      "author":{
        "url":"https://twitter.com/patrickbrosset",
        "name":"@patrickbrosset"}
      }
    ],
    "channel_id":"103523815916589056"}}

*/

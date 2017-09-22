const data = {
  provider_url: "https://www.instagram.com",
  media_id: "395279707428239959_14057957",
  author_name: "zooeydeschanel",
  height: null,
  thumbnail_url:
    "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg",
  thumbnail_width: 612,
  thumbnail_height: 612,
  provider_name: "Instagram",
  title: "My favorite cat from tonight's episode- a true winner. #newgirl",
  html:
    '\u003cblockquote class="instagram-media" data-instgrm-captioned data-instgrm-version="6" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"\u003e\u003cdiv style="padding:8px;"\u003e \u003cdiv style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"\u003e \u003cdiv style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"\u003e\u003c/div\u003e\u003c/div\u003e \u003cp style=" margin:8px 0 0 0; padding:0 4px;"\u003e \u003ca href="https://www.instagram.com/p/V8UMy0LjpX/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank"\u003eMy favorite cat from tonight\u0026#39;s episode- a true winner. #newgirl\u003c/a\u003e\u003c/p\u003e \u003cp style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"\u003eA photo posted by Zooey Deschanel (@zooeydeschanel) on \u003ctime style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2013-02-20T06:17:14+00:00"\u003eFeb 19, 2013 at 10:17pm PST\u003c/time\u003e\u003c/p\u003e\u003c/div\u003e\u003c/blockquote\u003e\n\u003cscript async defer src="//platform.instagram.com/en_US/embeds.js"\u003e\u003c/script\u003e',
  width: 658,
  version: "1.0",
  author_url: "https://www.instagram.com/zooeydeschanel",
  author_id: 14057957,
  type: "rich",
};

export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve(data);
  },
};

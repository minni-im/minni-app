const data = {
  success: true,
  type: "rich",
  version: "1.0",
  provider_name: "CodePen",
  provider_url: "http://codepen.io",
  title: "CSS transforms",
  author_name: "Patrick Brosset",
  author_url: "http://codepen.io/captainbrosset/",
  height: "300",
  width: "800",
  thumbnail_width: "384",
  thumbnail_height: "225",
  thumbnail_url:
    "https://s3-us-west-2.amazonaws.com/i.cdpn.io/35264.lHpnK.small.413fbeac-ab65-4d34-8f4f-1678f222aa91.png",
  html:
    '<iframe id="cp_embed_lHpnK" src="https://codepen.io/captainbrosset/embed/preview/lHpnK?height=300&amp;slug-hash=lHpnK&amp;default-tab=result&amp;host=http%3A%2F%2Fcodepen.io" scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe>',
};

export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve(data);
  },
};

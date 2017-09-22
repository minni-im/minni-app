export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve({
      provider_url: "https://www.spotify.com",
      version: "1.0",
      thumbnail_width: 300,
      height: 380,
      thumbnail_height: 300,
      title: "Tom Holkenborg (Junkie XL) - Brothers In Arms",
      width: 300,
      thumbnail_url:
        "https://d3rt1990lpmkn.cloudfront.net/cover/935c5d2d97150eeb611832a2342b8239eafcd833",
      provider_name: "Spotify",
      type: "rich",
      html:
        '<iframe src="https://embed.spotify.com/?uri=spotify:track:7Hj2D61IPaPICdGBXFj0cU" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',
    });
  },
};

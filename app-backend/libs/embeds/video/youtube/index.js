import Base from "../../base";

const REGEXP_YOUTUBE = /^https?:\/\/(?:[^\.]+\.)?youtube\.com\/watch\/?\?(?:.+&)?v=([^\s]+[\S])/;
const REGEXP_YOUTUBE_EMBED = /^https?:\/\/(?:[^\.]+\.)?youtube\.com\/(embed|v)\/([^\s]+[\S])/;
const REGEXP_YOUTU_BE = /^https?:\/\/youtu\.be\/([^\s]+[\S])/;

export default class YoutubeEmbed extends Base {
  constructor() {
    super();
    this.name = "Youtube";
  }

  endpointUrl({id: videoId}) {
    const videoUrl = encodeURI(`https://youtube.com/watch?v=${videoId}`);
    return `http://www.youtube.com/oembed?url=${videoUrl}&format=json`;
  }

  match(source) {
    return REGEXP_YOUTUBE.exec(source) ||
      REGEXP_YOUTUBE_EMBED.exec(source) ||
      REGEXP_YOUTU_BE.exec(source);
  }

  parse(capture) {
    return {
      url: capture[0],
      id: capture[1]
    }
  }
};

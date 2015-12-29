export default {
  status: 200,
  json() {
    return Promise.resolve({
      "version": 1.0,
      "type": "video",
      "cache_age": 3153600000,
      "provider_name": "Vine",
      "provider_url": "https://vine.co/",
      "author_name": "Gerald Andal",
      "author_url": "https://vine.co/u/906380398727147520",

      "title": "\ud83c\udf13",

      "thumbnail_url": "https://v.cdn.vine.co/r/videos/D23100296D1288658194734247936_4ada4c93836.5.0.16921951269562394155.mp4.jpg?versionId=1vXYbvXnR8dhUZcU.rNZknNKVkDd__VA",
      "thumbnail_width": 480,
      "thumbnail_height": 480,
      "html": "<iframe class=\"vine-embed\" src=\"https://vine.co/v/im5wjA9qDvM/embed/simple\" width=\"600\" height=\"600\" frameborder=\"0\"><\/iframe><script async src=\"//platform.vine.co/static/scripts/embed.js\"><\/script>",
      "width": 600,
      "height": 600
    });
  }
}

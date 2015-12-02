const MAX_IMAGE_WIDTH = 400;
const MAX_IMAGE_HEIGHT = 300;

function getImageEmbeds(embeds) {
  return embeds.filter(embed => embed.type && embed.type === "image");
}

function getRatio({ width, height }) {
  let widthRatio = 1;
  if (width > MAX_IMAGE_WIDTH) {
    widthRatio = MAX_IMAGE_WIDTH / width;
  }

  width = Math.round(width * widthRatio);
  height = Math.round(height * widthRatio);

  let heightRatio = 1;
  if (height > MAX_IMAGE_HEIGHT) {
    heightRatio = MAX_IMAGE_HEIGHT / height;
  }

  return Math.min(widthRatio * heightRatio, 1);
}

export default {
  match({ embeds }) {
    return getImageEmbeds(embeds).length > 0;
  },

  process({ embeds }) {
    return getImageEmbeds(embeds)
      .map(image => {
        const ratio = getRatio(image);
        return Object.assign(image, {
          thumbnail: {
            url: image.url,
            width: Math.round(image.width * ratio),
            height: Math.round(image.height * ratio)
          }
        });
      });
  }
};

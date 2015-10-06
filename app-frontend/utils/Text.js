export function camelize(text) {
  return text[0].toUpperCase() + text.substr(1);
}

export function slugify(text) {
  return text.toLowerCase()
      .trim()
      .replace(/[ _]/g, "-")
      .replace(/-+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-$/, "");
}

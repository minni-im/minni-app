import Logger from "../libs/Logger";
const logger = Logger.create("TextUtils");

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[ _]/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-$/, "");
}

export function unslugify(text) {
  return text.replace(/-/g, " ");
}

export function capitalize(text) {
  return unslugify(text).replace(/(?:^|\s)([a-z])/g, m => m.toUpperCase());
}

export function camelize(text) {
  return text[0].toUpperCase() + text.substr(1);
}

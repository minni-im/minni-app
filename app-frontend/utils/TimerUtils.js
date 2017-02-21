export function debounce(fn) {
  let id = null;
  return function () {
    clearImmediate(id);
    id = setImmediate(fn);
  };
}

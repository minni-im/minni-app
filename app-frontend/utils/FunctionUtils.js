export function noop() {}

export function debounce(func, wait, immediate) {
  let timeout;
  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

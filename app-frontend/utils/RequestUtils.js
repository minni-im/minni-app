
export function request(url, options = {}) {
  if (options.body && !options.body.length) {
    options.body = JSON.stringify(options.body);
  }
  options = Object.assign({
    credentials: "same-origin",
    headers: {
      "X-Requested-With": "XMLHttpRequest", // stupid hack to be able to use req.xhr on the server
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }, options);

  const params = Object.keys(options.params || {})
    .map(key => `${key}=${encodeURIComponent(options.params[key])}`)
    .join("&");

  function getUrl() {
    if (params.length && (
        !options.method ||
        (options.method && options.method.toLowerCase() === "get")
      )) {
      delete options.params;
      return `${url}?${params}`;
    }
    return url;
  }

  return fetch(getUrl(), options)
    .then((response) => {
      if (response.status === 204) {
        return response;
      }
      return response.json();
    });
}

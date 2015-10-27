

export function request(url, options = {}) {
  if (options.body && !options.body.length) {
    options.body = JSON.stringify(options.body);
  }
  options = Object.assign({
    credentials: "same-origin"
  }, options);

  return fetch(url, options)
    .then(response => {
      return response.json();
    });
}

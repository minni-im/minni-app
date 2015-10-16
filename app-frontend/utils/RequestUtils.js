

export function request(url, options = {}) {
  options = Object.assign({
    credentials: "same-origin"
  }, options);

  return fetch(url, options)
    .then(response => {
      return response.json();
    });
}

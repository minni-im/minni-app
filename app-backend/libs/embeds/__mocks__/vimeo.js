export default {
  ok: true,
  status: 403,
  json() {
    return Promise.resolve({});
  },
};

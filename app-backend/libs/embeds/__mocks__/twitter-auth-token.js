export default {
  ok: true,
  status: 200,
  json() {
    return Promise.resolve({
      token_type: "mocked", // bearer
      access_token:
        "AAAAAAAAAAAAAAAAAAAAAIDTeQAAAAAAl8oIPQOJwr54ydR0JXP%2FaZcDkx4%3DuEVYXwGf3TuJygu4ay1EzV6whHavmv61KZucS7x6zT04gPRk1b",
    });
  },
};

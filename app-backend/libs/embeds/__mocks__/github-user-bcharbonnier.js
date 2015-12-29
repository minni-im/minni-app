const data = {
  "login": "bcharbonnier",
  "id": 583204,
  "avatar_url": "https://avatars.githubusercontent.com/u/583204?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/bcharbonnier",
  "html_url": "https://github.com/bcharbonnier",
  "followers_url": "https://api.github.com/users/bcharbonnier/followers",
  "following_url": "https://api.github.com/users/bcharbonnier/following{/other_user}",
  "gists_url": "https://api.github.com/users/bcharbonnier/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/bcharbonnier/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/bcharbonnier/subscriptions",
  "organizations_url": "https://api.github.com/users/bcharbonnier/orgs",
  "repos_url": "https://api.github.com/users/bcharbonnier/repos",
  "events_url": "https://api.github.com/users/bcharbonnier/events{/privacy}",
  "received_events_url": "https://api.github.com/users/bcharbonnier/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Benoit Charbonnier",
  "company": null,
  "blog": null,
  "location": "Antibes",
  "email": "benoit.charbonnier@gmail.com",
  "hireable": null,
  "bio": null,
  "public_repos": 12,
  "public_gists": 11,
  "followers": 17,
  "following": 23,
  "created_at": "2011-01-25T18:24:49Z",
  "updated_at": "2015-12-25T12:37:23Z"
};

export default {
  status: 200,
  json() {
    return Promise.resolve(data);
  }
}

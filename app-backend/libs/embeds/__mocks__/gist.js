const data = {
  "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596",
  "forks_url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/forks",
  "commits_url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/commits",
  "id": "4e4b3d8ec2868ae63596",
  "git_pull_url": "https://gist.github.com/4e4b3d8ec2868ae63596.git",
  "git_push_url": "https://gist.github.com/4e4b3d8ec2868ae63596.git",
  "html_url": "https://gist.github.com/4e4b3d8ec2868ae63596",
  "files": {
    "solange.js": {
      "filename": "solange.js",
      "type": "application/javascript",
      "language": "JavaScript",
      "raw_url": "https://gist.githubusercontent.com/bbaliguet/4e4b3d8ec2868ae63596/raw/fc8d7239f0c985f371d882d72c9e1b8cd8edf5c0/solange.js",
      "size": 928,
      "truncated": false,
      "content": "(function() {\n\n    var original = roulotte.plugins.notifiers.SoundNotifier.prototype.onMessage, \n        lastUser;\n\n    // hijack roulotte\n    roulotte.plugins.notifiers.SoundNotifier.prototype.onMessage = function(evt) {\n        var message = evt.message,\n            me = this.room_context.getUserInfo();\n\n        if(me.id === message.user.id || !message.content.length) {\n            lastUser = message.user.id;\n            return;\n        }\n\n        var shortName = message.user.username.split(/\\d/)[0],\n            prefix = lastUser === message.user.id ? \"\" : message.user.username.split(/\\s/)[0] + \" dit \",\n            speach = encodeURI(prefix + message.content),\n            audio = new Audio();\n\n        lastUser = message.user.id;\n\n        audio.src ='http://translate.google.com/translate_tts?ie=utf-8&tl=fr&q=' + speach;\n        audio.play();\n\n        // call original\n        original.call(this, evt);\n    };\n\n})();"
    }
  },
  "public": false,
  "created_at": "2013-10-03T13:27:10Z",
  "updated_at": "2015-12-24T13:59:29Z",
  "description": "Roulotte is speaking !",
  "comments": 0,
  "user": null,
  "comments_url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/comments",
  "owner": {
    "login": "bbaliguet",
    "id": 1152915,
    "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/bbaliguet",
    "html_url": "https://github.com/bbaliguet",
    "followers_url": "https://api.github.com/users/bbaliguet/followers",
    "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
    "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
    "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
    "repos_url": "https://api.github.com/users/bbaliguet/repos",
    "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
    "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
    "type": "User",
    "site_admin": false
  },
  "forks": [

  ],
  "history": [
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "69eefa4bcb7cefcfd2e8fba32d7f3aaa03fa3fc5",
      "committed_at": "2013-12-03T16:18:53Z",
      "change_status": {
        "total": 1,
        "additions": 1,
        "deletions": 0
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/69eefa4bcb7cefcfd2e8fba32d7f3aaa03fa3fc5"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "b0bd22b9e91b8a54797a082a5630e6be58abd5a8",
      "committed_at": "2013-12-03T16:18:27Z",
      "change_status": {
        "total": 4,
        "additions": 2,
        "deletions": 2
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/b0bd22b9e91b8a54797a082a5630e6be58abd5a8"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "74de867d7bc6d36573ae2d38f172b156c5c48c10",
      "committed_at": "2013-12-03T16:16:50Z",
      "change_status": {
        "total": 57,
        "additions": 29,
        "deletions": 28
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/74de867d7bc6d36573ae2d38f172b156c5c48c10"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "c293fc53d9809c841ad83418faa80e20f063c79b",
      "committed_at": "2013-10-03T14:07:15Z",
      "change_status": {
        "total": 2,
        "additions": 1,
        "deletions": 1
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/c293fc53d9809c841ad83418faa80e20f063c79b"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "8bd7f71985285d29298e2ad9619bc5b7ed89c47e",
      "committed_at": "2013-10-03T14:06:55Z",
      "change_status": {
        "total": 38,
        "additions": 26,
        "deletions": 12
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/8bd7f71985285d29298e2ad9619bc5b7ed89c47e"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "6994f8376781cc50c3e37bda3dc94f548ba83d88",
      "committed_at": "2013-10-03T13:54:26Z",
      "change_status": {
        "total": 3,
        "additions": 2,
        "deletions": 1
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/6994f8376781cc50c3e37bda3dc94f548ba83d88"
    },
    {
      "user": {
        "login": "bbaliguet",
        "id": 1152915,
        "avatar_url": "https://avatars.githubusercontent.com/u/1152915?v=3",
        "gravatar_id": "",
        "url": "https://api.github.com/users/bbaliguet",
        "html_url": "https://github.com/bbaliguet",
        "followers_url": "https://api.github.com/users/bbaliguet/followers",
        "following_url": "https://api.github.com/users/bbaliguet/following{/other_user}",
        "gists_url": "https://api.github.com/users/bbaliguet/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/bbaliguet/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/bbaliguet/subscriptions",
        "organizations_url": "https://api.github.com/users/bbaliguet/orgs",
        "repos_url": "https://api.github.com/users/bbaliguet/repos",
        "events_url": "https://api.github.com/users/bbaliguet/events{/privacy}",
        "received_events_url": "https://api.github.com/users/bbaliguet/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "fb937e72477d69627a8dfca168a5fb82fd9fa460",
      "committed_at": "2013-10-03T13:27:10Z",
      "change_status": {
        "total": 13,
        "additions": 13,
        "deletions": 0
      },
      "url": "https://api.github.com/gists/4e4b3d8ec2868ae63596/fb937e72477d69627a8dfca168a5fb82fd9fa460"
    }
  ],
  "truncated": false
};

export default {
  status: 200,
  json() {
    return Promise.resolve(data);
  }
}
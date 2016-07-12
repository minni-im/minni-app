import Long from "long";
import SimpleMarkdown from "simple-markdown";

import { PLUGIN_TYPES } from "../Constants";

import AccountRoomStore from "../stores/AccountRoomStore";
import PluginsStore from "../stores/PluginsStore";
import RoomStore from "../stores/RoomStore";
import UserStore from "../stores/UserStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

import * as MarkupUtils from "../utils/MarkupUtils";

function createNonce() {
  return Long.fromNumber(new Date().getTime())
    .multiply(1000.0)
    .subtract(1420070400000)
    .shiftLeft(22);
}

const DEFAULT_TEXT_RULE = SimpleMarkdown.defaultRules.text;
const DEFAULT_RULES = MarkupUtils.getDefaultRules();

function matchAsText(simpleRule) {
  return {
    order: simpleRule.order,
    match: simpleRule.match,
    parse(capture) {
      return {
        type: "text",
        content: capture[0]
      };
    },
    text(node) {
      return node.content;
    }
  };
}

const ENCODING_RULES = {
  // We need to lookup for links otherwise we could get mentions and rooms from
  // within them :)
  link: matchAsText(SimpleMarkdown.defaultRules.link),
  url: matchAsText(SimpleMarkdown.defaultRules.url),
  room: {
    order: DEFAULT_RULES.room.order,
    match(source, state, lookBehind) {
      if (/^|[\s]+/.test(lookBehind)) {
        const match = source.match(/^#([a-z0-9-]{1,20})/);
        if (match) {
          return state.rooms
            .filter(({ slug }) => slug === match[1])
            .map(({ id }) => [match[0], id])
            [0];
        }
      }
      return null;
    },
    parse(capture) {
      return {
        type: "room",
        content: `<#${capture[1]}>`
      };
    },
    text(node) {
      return node.content;
    }
  },
  mention: {
    order: DEFAULT_RULES.mention.order,
    match(source, state, lookBehind) {
      if (/^|[^a-zA-Z0-9_!#$%&*@＠]/.test(lookBehind)) {
        const match = source.match(/^[@＠]([a-zA-Z0-9_]{1,20})/);
        if (match) {
          return state.users
            .filter(({ nickname }) => nickname === match[1])
            .map(({ id }) => [match[0], id])
            [0];
        }
      }
      return null;
    },
    parse(capture) {
      return {
        type: "mention",
        content: `<@${capture[1]}>`
      };
    },
    text(node) {
      return node.content;
    }
  },
  text: {
    ...DEFAULT_TEXT_RULE,
    text(node) {
      return node.content;
    }
  }
};

// Generate proper rule's order index based
Object.keys(ENCODING_RULES).forEach((type, i) => {
  ENCODING_RULES[type].order = i;
});

// Transforming @mention and #link-room into proper object we can recognize
export function encode(text) {
  text = text.trim();
  const account = SelectedAccountStore.getAccount();

  const users = UserStore.getUsers(account.usersId)
    .toArray()
    .map(user => ({ id: user.id, nickname: user.nickname }));

  const rooms = AccountRoomStore.getRooms(account.id)
    .toArray()
    .map(room => ({ id: room.id, slug: room.slug }));

  const state = {
    inline: true,
    meta: {},
    account,
    users,
    rooms
  };

  const parser = SimpleMarkdown.parserFor(ENCODING_RULES);
  const textFor = SimpleMarkdown.htmlFor(SimpleMarkdown.ruleOutput(ENCODING_RULES, "text"));
  const parsed = {
    content: textFor(parser(text, state))
  };
  return parsed;
}

// Used when editing a message to revert private objects to @mention and #room
export function decode(text) {
  return text.replace(/<@([a-zA-Z0-9-]{32})>/g, (match, userId) => {
    const user = UserStore.getUser(userId);
    return user == null ? match : `@${user.nickname}`;
  }).replace(/<#([a-zA-Z0-9-]{32})>/g, (match, roomId) => {
    const room = RoomStore.get(roomId);
    return room == null ? match : `#${room.slug}`;
  });
}

export function createMessage(roomId, text) {
  const composerPlugins = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_TEXT);
  const preProcessors = composerPlugins.map(plugin => plugin.encodeMessage);

  const message = {
    id: createNonce().toString(),
    roomId,
    content: encode(text).content,
    type: "chat",
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };

  return preProcessors.reduce((onGoing, processor) =>
    onGoing.then(processor), Promise.resolve(message));
}

export function createSystemMessage(roomId, content, subType) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    type: "system",
    subType,
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };
}

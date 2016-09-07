import React from "react"; // needed for the jsx below.
import SimpleMarkdown from "simple-markdown";
import highlight from "highlight.js";
import { Link } from "react-router";

import Emoji from "../components/Emoji.react";

import UserStore from "../stores/UserStore";
import RoomStore from "../stores/RoomStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

const DEFAULT_LINK_RULE = SimpleMarkdown.defaultRules.link;

const DEFAULT_RULES = {
  newline: SimpleMarkdown.defaultRules.newline,
  paragraph: SimpleMarkdown.defaultRules.paragraph,
  escape: SimpleMarkdown.defaultRules.escape,
  link: {
    ...DEFAULT_LINK_RULE,
    match() {
      return null;
    },
    react(node, output, state) {
      return (
        <a
          key={state.key}
          href={SimpleMarkdown.sanitizeUrl(node.target)}
          title={node.title}
          target="_blank"
        >{output(node.content, state)}</a>
      );
    }
  },
  autolink: SimpleMarkdown.defaultRules.autolink,
  url: SimpleMarkdown.defaultRules.url,
  strong: SimpleMarkdown.defaultRules.strong,
  em: SimpleMarkdown.defaultRules.em,
  u: SimpleMarkdown.defaultRules.u,
  br: SimpleMarkdown.defaultRules.br,
  text: SimpleMarkdown.defaultRules.text,
  inlineCode: SimpleMarkdown.defaultRules.inlineCode,
  s: {
    order: SimpleMarkdown.defaultRules.u.order,
    match: SimpleMarkdown.inlineRegex(/^~([\s\S]+?)~(?!_)/),
    parse: SimpleMarkdown.defaultRules.u.parse,
    react(node, output, state) {
      return (
        <s key={state.key}>{output(node.content, state)}</s>
      );
    }
  },
  codeBlock: {
    order: SimpleMarkdown.defaultRules.codeBlock.order,
    match(source, state, lookBehind) {
      const match = /^(`{3,})(?:([A-z0-9\-]+?)\n+)?\n*?([^]+?)\1/.exec(source);
      // We only detect code block (or also known as code fence)
      // that compose the entire message. If text is detected before,
      // we let the inlineCode matcher do the job
      if (match && lookBehind.trim() === "") {
        return match;
      }
      return null;
    },

    parse(capture) {
      return {
        lang: (capture[2] || "").trim(),
        content: (capture[3] || "").trim()
      };
    },

    react(node, output, state) {
      if (node.lang && highlight.getLanguage(node.lang) !== null) {
        const code = highlight.highlight(node.lang, node.content);
        return (
          <div
            className="message--code-block"
            key={state.key}
          >
            <div className="language">{`</> ${code.language}`}</div>
            <pre>
              <code
                className={`hljs ${code.language}`}
                dangerouslySetInnerHTML={{ __html: code.value }}
              ></code>
            </pre>
          </div>
        );
      }
      const code = highlight.highlightAuto(node.content);
      return (
        <div
          className="message--code-block"
          key={state.key}
        >
          <div className="language">{`<?> Is it some '${code.language}' ?`}</div>
          <pre>
            <code className="hljs">{node.content}</code>
          </pre>
        </div>
      );
    }
  },

  blockQuote: SimpleMarkdown.defaultRules.blockQuote,

  emoji: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return /^:([a-zA-Z0-9-_+]+):(:skin-tone-((?:1\-2|[3-6])):)?/.exec(source);
    },
    parse(capture) {
      const name = capture[1];
      return { name, skinTone: capture[2] && capture[3] };
    },
    react(node, output, state) {
      return <Emoji key={state.key} shortname={node.name} skinTone={node.skinTone} />;
    }
  },

  mention: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return /^<@([0-9a-z]{32})>/.exec(source);
    },
    parse(capture) {
      const user = UserStore.getUser(capture[1]);
      return {
        userId: user !== null ? user.id : null,
        content: [{
          type: "text",
          content: user !== null ? `@${user.nickname}` : capture[0]
        }]
      };
    },
    react(node, output, state) {
      return (
        <b
          className="mention"
          key={state.key}
        >{output(node.content, state)}</b>
      );
    }
  },

  room: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source) {
      return /^<#([0-9a-z-]{32})>/.exec(source);
    },
    parse(capture) {
      const accountSlug = SelectedAccountStore.getAccount().slug;
      const room = RoomStore.get(capture[1]);
      if (!room) {
        return {
          content: "deleted-room"
        };
      }
      return {
        accountSlug,
        roomSlug: room.slug,
        content: [{
          type: "text",
          content: `#${room.slug}`
        }]
      };
    },
    react(node, output, state) {
      if (!node.roomSlug) {
        return (
          <span
            key={state.key}
            className="hashtag"
            title="There used to be a room here. It's gone..."
          >#deleted-room</span>
        );
      }
      return (
        <Link
          key={state.key}
          className="hashtag hashtag--room"
          to={`/chat/${node.accountSlug}/messages/${node.roomSlug}`}
        >{output(node.content, state)}</Link>
      );
    }
  },

  hashtag: {
    order: SimpleMarkdown.defaultRules.text.order,
    match(source, state, lookBehind) {
      if (/^|[^a-zA-Z0-9_!#$%&*@＠]/.test(lookBehind)) {
        return /^#([a-zA-Z0-9_-]{1,20})/.exec(source);
      }
      return null;
    },
    parse(capture) {
      return {
        content: capture[1]
      };
    },
    react(node, output, state) {
      return (
        <b key={state.key} className="hashtag">#{node.content}</b>
      );
    }
  }
};

export function getDefaultRules() {
  return { ...DEFAULT_RULES };
}

function createContentParser(rules, content = "", inline = true, state = {}) {
  const parser = SimpleMarkdown.parserFor(rules);
  const output = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, "react"));

  if (!inline) {
    content = `${content}\n\n`;
  }

  return output(parser(content, { inline, ...state }));
}

export function parseContent(content, inline, state) {
  return createContentParser(getDefaultRules(), content, inline, state);
}

export function parseTitle(content, withLink = true) {
  const defaultRules = getDefaultRules();
  let rules = {
    emoji: defaultRules.emoji,
    text: defaultRules.text
  };
  if (withLink) {
    rules = {
      link: defaultRules.link,
      url: defaultRules.url,
      ...rules
    };
  }
  return createContentParser(rules, content);
}

export function parseTitleWithoutLinks(content) {
  return parseTitle(content, false);
}

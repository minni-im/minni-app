import React from "react"; //needed for the jsx below.
import SimpleMarkdown from "simple-markdown";
import highlight from "highlight.js";

const DEFAULT_PARAGRAPH_RULE = SimpleMarkdown.defaultRules.paragraph;
const DEFAULT_LINK_RULE = SimpleMarkdown.defaultRules.paragraph;

function createRules() {
  return {
    newline: SimpleMarkdown.defaultRules.newline,
    paragraph: SimpleMarkdown.defaultRules.paragraph,
    escape: SimpleMarkdown.defaultRules.escape,
    link: {
      ...DEFAULT_LINK_RULE,
      match() {
        return null;
      },
      react( node, output, state ) {
        return (
          <a key={ state.key }
             href={ SimpleMarkdown.sanitizeUrl( node.target ) }
             title={ node.title } target="_blank">
            { output( node.content, state ) }
          </a>
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
      react( node , output, state ) {
        return (
          <s key={ state.key }>{ output( node.content, state ) }</s>
        );
      }
    },

    codeBlock: {
      order: SimpleMarkdown.defaultRules.codeBlock.order,
      match( source, state, lookBehind ) {
        const match = /^(`{3,})(?:([A-z0-9\-]+?)\n+)?\n*?([^]+?)\1/.exec( source );
        // We only detect code block (or also known as code fence) that compose the entire message. If text is detected before, we let the inlineCode matcher do the job
        if (match && lookBehind.trim() === "") {
          return match;
        }
        return null;
      },

      parse( capture ) {
        return {
          lang: ( capture[2] || "" ).trim(),
          content: ( capture[3] || "").trim()
        };
      },

      react( node, output, state ) {
        if ( node.lang && highlight.getLanguage(node.lang) !== null ) {
          const code = highlight.highlight(node.lang, node.content);
          return (
            <div className="message--code-block" key={ state.key }>
              <div className="language">{`</> ${code.language}`}</div>
              <pre>
                <code
                  className={`hljs ${code.language}`}
                  dangerouslySetInnerHTML={ { __html: code.value } }></code>
              </pre>
            </div>
          );
        } else {
          const code = highlight.highlightAuto(node.content);
          return (
            <div className="message--code-block" key={ state.key }>
              <div className="language">{`<?> Is it some '${code.language}' ?`}</div>
              <pre>
                <code className="hljs">{ node.content }</code>
              </pre>
            </div>
          );
        }

      }
    },

    blockQuote: SimpleMarkdown.defaultRules.blockQuote,

    mention: {
      order: SimpleMarkdown.defaultRules.text.order,
      match( source, state, lookBehind ) {
        if ( /^|[^a-zA-Z0-9_!#$%&*@＠]/.test( lookBehind ) ) {
          return /^[@＠]([a-zA-Z0-9_]{1,20})/.exec( source );
        } else {
          return null;
        }
      },

      parse( capture ) {
        return {
          name: capture[ 1 ]
        };
      },

      react( node, output, state ) {
        return (
          <b className="mention" key={ state.key }>@{ node.name }</b>
        );
      }
    }

  }
}

export function parseContent( content = "", inline = true, state = {} ) {
  const rules = createRules();
  const parser = SimpleMarkdown.parserFor( rules );
  const output = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput( rules, "react" ));

  if ( !inline ) {
    content = `${content}\n\n`;
  }

  return output( parser( content, { inline, ...state } ) );
}

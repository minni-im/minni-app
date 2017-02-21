import React from "react";

const CODE = `\`\`\`javascript
function notify(msg) {
  alert(msg);
}
\`\`\``;
export default function FormattingHints() {
  return (
    <div className="formatting-hints">
      <span className="has-tooltip">
        Formatting Tips
        <div className="tooltip-content">
          <div className="message-group flex-horizontal">
            <span className="hint"><em>italic</em></span>
            <span className="flex-spacer">_italic_</span>
          </div>
          <div className="message-group flex-horizontal">
            <span className="hint">
              <span style={{ textDecoration: "underline" }}>underline</span>
            </span>
            <span className="flex-spacer">__underline__</span>
          </div>
          <div className="message-group flex-horizontal">
            <span className="hint"><strong>bold</strong></span>
            <span className="flex-spacer">**bold**</span>
          </div>
          <div className="message-group flex-horizontal">
            <span className="hint"><strike>strike</strike></span>
            <span className="flex-spacer">~strike~</span>
          </div>
          <div className="message-group message-group-me flex-horizontal">
            <span className="hint"><blockquote>Someone said</blockquote></span>
            <span className="flex-spacer">&gt; Someone said</span>
          </div>
          <div className="message-group message-group-me flex-horizontal">
            <span className="hint"><code>code()</code></span>
            <span className="flex-spacer">`code()`</span>
          </div>
          <div className="message-group flex-horizontal">
            <span className="hint message--code-block">
              <pre>
                <code className="hljs javascript">
                  <span className="hljs-function">
                    <span className="hljs-keyword">function</span>
                    {" "}
                    <span className="hljs-title">notify</span>
                    (
                    <span className="hljs-params">msg</span>
                    ){" "}
                  </span>
                  {"{"}
                  <br />&nbsp;&nbsp;alert(msg);<br />
                  {"}"}
                </code>
              </pre>
            </span>
            <span className="code-block flex-spacer"><pre>{CODE}</pre></span>
          </div>
        </div>
      </span>
    </div>
  );
}

import React, { PropTypes } from "react";
import classnames from "classnames";

function generateUnicodeAltText(unicodeAsString) {
  return unicodeAsString.split("-")
    .map(codePoint => (
      codePoint === "200d"
        ? "&zwj;"
        : String.fromCodePoint(parseInt(codePoint, 16))
    ))
    .join("");
}

function format(shortname, skinTone) {
  return skinTone ? `:${shortname}::skin-tone-${skinTone}:` : `:${shortname}:`;
}

export default function Emoji({ className, name, unicode, skinTone, src }) {
  if (!src) {
    return <span>{format(name)}</span>;
  }
  return (
    <img
      className={classnames("emoji", className)}
      draggable={false}
      alt={generateUnicodeAltText(unicode)}
      title={format(name, skinTone)}
      src={src}
    />
  );
}

Emoji.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  unicode: PropTypes.string,
  src: PropTypes.string,
  skinTone: PropTypes.oneOf(["1-2", "3", "4", "5", "6"])
};

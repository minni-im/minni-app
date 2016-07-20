import React from "react";

import { UI } from "minni-plugins-toolkit";
const { TypeaheadResults } = UI;

const COMMAND_SENTINEL = "/";

export default class extends TypeaheadResults {
  static className = "suggestions-command";

  transformSelectionToText(value) {
    return COMMAND_SENTINEL + value.command;
  }

  renderHeader() {
    return "Slash Commands";
  }

  renderRow({ command, description }, props) {
    return (
      <div {...props}>
        <div>{COMMAND_SENTINEL + command}</div>
        <div className="suggestion-item--info">
          {description}
        </div>
      </div>
    );
  }
}

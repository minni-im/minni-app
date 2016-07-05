import React from "react";
import TypeAheadResults from "./TypeAheadResults.react";

export const COMMAND_SENTINEL = "/";

export default class CommandResults extends TypeAheadResults {
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

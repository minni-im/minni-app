import React from "react";
import { Container } from "flux/utils";

import { UI } from "minni-plugins-toolkit";
const { TypeaheadResults } = UI;

// TODO: We need to find a way for plugins to create their own stores.
import SlashCommandStore from "../../stores/SlashCommandStore";

function filename(url) {
  return url.split("/").pop();
}

class SlashCommandResults extends TypeaheadResults {
  static className = "suggestions-command-results";
  static getStores() {
    return [SlashCommandStore];
  }

  static calculateState(prevProps, nextProps) {
    const results = SlashCommandStore.getResults(
      nextProps.command.command,
      nextProps.query
    );
    return {
      selectedIndex: 0,
      results: results.slice(0, 6),
    };
  }

  constructor(props) {
    super(props);
    // We don't want to append an extra space after the url;
    this.trailingSpace = false;
  }

  transformSelectionToText(result) {
    return result.preview;
  }

  renderHeader() {
    let name;
    if (this.state.results && this.state.results.length) {
      const current = this.state.results[this.state.selectedIndex];
      name = (
        <span>
          &nbsp;-&nbsp;
          <em>{current.title || filename(current.preview)}</em>
        </span>
      );
    }
    return (
      <div>
        {this.props.command.title} results matching{" "}
        <strong>{this.props.query}</strong>
        {name}
      </div>
    );
  }

  renderRow(result, props) {
    function getName(url) {
      return url.split("/").pop();
    }
    return (
      <div
        style={{
          backgroundImage: `url(${result.preview})`,
        }}
        {...props}
        title={result.title || getName(result.preview)}
      />
    );
  }
}

const container = Container.create(SlashCommandResults, { withProps: true });

export default container;

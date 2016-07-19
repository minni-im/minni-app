import React from "react";
import { Container } from "flux/utils";
import TypeAheadResults from "../../components/typeahead/TypeAheadResults.react";

import SlashCommandStore from "../../stores/SlashCommandStore";

class SlashCommandResults extends TypeAheadResults {
  static getStores() {
    return [
      SlashCommandStore
    ];
  }

  static calculateState(prevProps, nextProps) {
    const results = SlashCommandStore.getResults(nextProps.command.command, nextProps.query);
    return {
      selectedIndex: 0,
      results: results.slice(0, 6)
    };
  }

  constructor(props) {
    super(props);
    // We don't want to append an extra space after the url;
    this.trailingSpace = false;
  }

  transformSelectionToText(result) {
    return result;
  }

  renderHeader() {
    return (
      <div>{this.props.command.title} results matching <strong>{this.props.query}</strong></div>
    );
  }

  renderRow(result, props) {
    function getName(url) {
      return url.split("/").pop();
    }
    return (
      <div
        style={{
          backgroundImage: `url(${result})`
        }}
        {...props}
        title={getName(result)}
      ></div>
    );
  }
}

const container = Container.create(
  SlashCommandResults,
  { withProps: true }
);

export default container;

import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { KEYCODES } from "../utils/KeyboardUtils";

export default class TypeaheadResults extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    results: PropTypes.array,
    command: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.trailingSpace = true;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  state = {
    selectedIndex: 0,
  };

  handleKeyDown(event) {
    const results = this.props.results || this.state.results;
    if (results == null || results.length === 0) {
      return;
    }
    let selectedIndex = this.state.selectedIndex;
    switch (event.which) {
      case KEYCODES.ENTER:
        event.preventDefault();
        this.handleSelect();
        break;

      case KEYCODES.UP:
        event.preventDefault();
        if (--selectedIndex < 0) {
          selectedIndex = results.length - 1;
        }
        this.setState({ selectedIndex });
        break;

      case KEYCODES.TAB:
      case KEYCODES.DOWN:
        event.preventDefault();
        if (++selectedIndex >= results.length) {
          selectedIndex = 0;
        }
        this.setState({ selectedIndex });
        break;

      default:
    }
  }

  handleSelect(event = null) {
    const results = this.props.results || this.state.results;
    const value = results[this.state.selectedIndex];
    const text = this.transformSelectionToText(value);
    if (event) {
      event.preventDefault();
    }
    this.props.onSelect(text, this.trailingSpace);
  }

  transformSelectionToText(value) {
    return value;
  }

  render() {
    const results = this.props.results || this.state.results;
    const classNames = {
      suggestions: true,
      [this.constructor.className || ""]: true,
    };

    if (this.props.command) {
      classNames[`suggestions-${this.props.command.command}`] = true;
      classNames["suggestions-images"] = !!this.props.command.images;
    }

    const header = (
      <div className="suggestions-header">
        {this.renderHeader && this.renderHeader()}
        <div className="header-help">
          <kbd className="text">Tab</kbd>&nbsp; or &nbsp;
          <kbd>↑</kbd> <kbd>↓</kbd>&nbsp; to navigate &nbsp;
          <kbd>↵</kbd>&nbsp; to select
        </div>
      </div>
    );

    if (results == null || (results.length === 0 && !this.props.command)) {
      return null;
    }

    let suggestions;
    if (results.length) {
      const suggestionMapper = (result, index) =>
        this.renderRow(result, {
          key: index,
          className: classnames("suggestion-item", {
            "suggestion-item--active": this.state.selectedIndex === index,
          }),
          onMouseDown: this.handleSelect,
          onMouseEnter: () => this.setState({ selectedIndex: index }),
        });
      suggestions = (
        <div className="suggestions-list">{results.map(suggestionMapper)}</div>
      );
    } else {
      suggestions = (
        <div className="suggestions-list" style={{ justifyContent: "center" }}>
          Loading...
        </div>
      );
    }

    return (
      <div className={classnames(classNames)}>
        {header}
        {suggestions}
      </div>
    );
  }
}

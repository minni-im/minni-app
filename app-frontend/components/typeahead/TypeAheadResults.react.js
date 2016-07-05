import React, { PropTypes } from "react";
import classnames from "classnames";

import { KEYCODES } from "../../utils/KeyboardUtils";

export default class TypeAheadResults extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    results: PropTypes.array,
    command: PropTypes.object,
    onSelect: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.trailingSpace = true;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  state = {
    selectedIndex: 0
  }

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
    if (results == null || results.length === 0) {
      if (!this.props.command) {
        return null;
      }
      return <span>Loading...</span>;
    }
    const classNames = {
      suggestions: true
    };
    if (this.props.command) {
      classNames[`suggestions-${this.props.command.command}`] = true;
      classNames["suggestions-images"] = !!this.props.command.images;
    }

    let header = (
      <div className="suggestions-header">
        {this.renderHeader && this.renderHeader()}
        <div className="header-help">
          <kbd className="text">Tab</kbd>&nbsp; or &nbsp;
          <kbd>↑</kbd> <kbd>↓</kbd>&nbsp; to navigate &nbsp;
          <kbd>↵</kbd>&nbsp; to select &nbsp;
          <kbd className="text">Esc</kbd>&nbsp; to dismiss
        </div>
      </div>
    );

    const suggestionMapper = (result, index) => this.renderRow(result, {
      key: index,
      className: classnames("suggestion-item", {
        "suggestion-item--active": this.state.selectedIndex === index
      }),
      onMouseDown: this.handleSelect,
      onMouseEnter: () => this.setState({ selectedIndex: index })
    });
    const suggestions = (
      <div className="suggestions-list">
        {results.map(suggestionMapper)}
      </div>
    );
    return (
      <div className={classnames(classNames, this.props.className)}>
        {header}
        {suggestions}
      </div>
    );
  }
}

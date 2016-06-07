import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

import { SmileyIcon } from "../utils/IconsUtils";

import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";
import { search as SlashCommandSearch } from "../actions/SlashCommandActionCreators";

import Room from "../models/Room";

import TypingUtils from "../utils/TypingUtils";
import RegexUtils from "../utils/RegexUtils";

// import Logger from "../libs/Logger";
// const logger = Logger.create("Composer.react");

const KEYCODES = {
  UP: 38,
  DOWN: 40,
  ENTER: 13,
  LEFT: 37,
  RIGHT: 39,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  ESCAPE: 27,
  TAB: 9
};

const COMMAND_ENABLED = () => true;

const COMMANDS = [
  {
    command: "gif",
    title: "Buukkit",
    description: "Search animated gifs on http://buukkit.appspot.com",
    enabled: COMMAND_ENABLED,
    integration: true,
    images: true
  }, {
    command: "me",
    title: "Me",
    description: "What are you doing ?",
    enabled: COMMAND_ENABLED,
    integration: false,
    images: false
  }, {
    command: "giphy",
    title: "Giphy",
    description: "Search animated gifs from Giphy",
    enabled: COMMAND_ENABLED,
    integration: true,
    images: true
  }
];

const MENTION_SENTINEL = "@";
const ROOM_SENTINEL = "#";
const EMOJI_SENTINEL = ":";
const COMMAND_SENTINEL = "/";
const PREFIX_RE = new RegExp(`${MENTION_SENTINEL}|${ROOM_SENTINEL}|${EMOJI_SENTINEL}|^${COMMAND_SENTINEL}`);
const COMMAND_RE = new RegExp(`^/(${COMMANDS.filter(c => c.integration).map(c => c.command).join("|")})\\s(.+)`, "i");
const WHITESPACE_RE = /(\t|\s)/;

const TYPE_MENTION = 1;
const TYPE_EMOJI = 2;
const TYPE_COMMAND = 3;
const TYPE_INTEGRATION = 4;
const TYPE_ROOM = 5;

class TypeAheadResults extends React.Component {
  static propTypes = {
    results: React.PropTypes.array,
    onSelect: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  state = {
    selectedIndex: 0
  }

  handleKeyDown(event) {
    const { results } = this.props;
    if (results == null || results.length === 0) {
      return;
    }
    let selectedIndex = this.state.selectedIndex;
    switch (event.which) {
      case KEYCODES.TAB:
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
    const { results } = this.props;
    const value = results[this.state.selectedIndex];
    const text = this.transformSelectionToText(value);
    if (event) {
      event.preventDefault();
    }
    this.props.onSelect(text);
  }

  transformSelectionToText(value) {
    return value;
  }

  render() {
    let header;
    if (this.renderHeader) {
      header = (
        <div className="suggestions-header">
          {this.renderHeader()}
        </div>
      );
    }
    const suggestionMapper = (result, index) => this.renderRow(result, {
      key: index,
      className: classnames("suggestion-item", {
        "suggestion-item--active": this.state.selectedIndex === index
      }),
      onMouseDown: this.handleSelect
    });
    const suggestions = (
      <div className="suggestions-list">
        {this.props.results.map(suggestionMapper)}
      </div>
    );
    return (
      <div className="suggestions">
        {header}
        {suggestions}
      </div>
    );
  }
}

class CommandTypeAhead extends TypeAheadResults {
  transformSelectionToText(value) {
    return COMMAND_SENTINEL + value.command;
  }

  renderHeader() {
    return "Slash Commands /";
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

class MentionTypeAhead extends TypeAheadResults {
  renderRow() {
    return (
      <div></div>
    );
  }
}

class EmojiTypeAhead extends TypeAheadResults {
  renderRow() {
    return (
      <div></div>
    );
  }
}

class RoomTypeAhead extends TypeAheadResults {
  renderRow() {
    return (
      <div></div>
    );
  }
}

function extractFileName(htmlString) {
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  const img = div.querySelector("img");
  if (img) {
    const a = document.createElement("a");
    a.href = img.src;
    let filename = a.pathname.split("/").pop();
    if (filename) {
      filename = filename.replace(/\..+$/, "");
      if (filename) {
        return `${filename}.png`;
      }
    }
  }
  return undefined;
}

export default class Composer extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    defaultValue: React.PropTypes.string,
    room: React.PropTypes.instanceOf(Room)
  }

  static defautProps = {
    defaultValue: ""
  }

  constructor(props) {
    super(props);
    this.handleTextareaFocus = this.handleTextareaFocus.bind(this);
    this.handleTextareaBlur = this.handleTextareaBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnPaste = this.handleOnPaste.bind(this);

    this.performAutocomplete = this.performAutocomplete.bind(this);
  }

  state = {
    results: null
  }

  componentDidMount() {
    const { textarea } = this.refs;
    this.lineHeight = parseInt(
      window
        .getComputedStyle(textarea, null)
        .getPropertyValue("line-height"),
      10);
    this.computeTextAreaHeight(1);
    this.moveCursorAtEnd();
  }

  componentWillUnmount() {
    ComposerActionCreators.saveCurrentText(this.props.room.id, this.refs.textarea.value.trim());
  }

  clearValue() {
    this.refs.textarea.value = "";
    this.computeTextAreaHeight(1);
    ComposerActionCreators.saveCurrentText(this.props.room.id, "");
  }

  focus() {
    this.refs.textarea.focus();
  }

  moveCursorAtEnd() {
    const { textarea } = this.refs;
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
  }

  computeTextAreaHeight(numberOfLine) {
    const { textarea } = this.refs;
    textarea.style.height = `${numberOfLine * this.lineHeight}px`;
    textarea.scrollTop = textarea.offsetHeight;
  }

  handleTextareaFocus() {
    ReactDOM.findDOMNode(this).classList.add("active");
    this.setState({ focused: true });
  }

  handleTextareaBlur() {
    ReactDOM.findDOMNode(this).classList.remove("active");
    this.setState({ focused: false });
  }

  handleOnChange(event) {
    const text = event.target.value;
    this.computeTextAreaHeight(text.split("\n").length);
    TypingUtils.sendTyping(this.props.room.id);
  }

  handleOnKeyPress(event) {
    let value;
    const shouldSend = !event.shiftKey;
    switch (event.which) {
      case KEYCODES.ENTER:
        value = this.refs.textarea.value;
        if (shouldSend) {
          event.preventDefault();
          if (this.props.onSubmit(value)) {
            this.clearValue();
          }
        }
        break;
      default:
    }
  }

  handleOnKeyUp() {
    this.shouldWeAutocomplete();
  }

  handleOnKeyDown(event) {
    const suggestions = this.refs.suggestions;
    if (suggestions) {
      suggestions.handleKeyDown(event);
    }
  }

  handleOnPaste(event) {
    const { clipboardData } = event;
    if (!clipboardData || !clipboardData.items) {
      return;
    }

    for (let i = 0; i < clipboardData.items.length; i++) {
      const clipboardItem = clipboardData.items[i];
      let fileBlob;
      switch (clipboardItem.type) {
        case "image/png":
          fileBlob = clipboardItem.getAsFile();

          // In chrome, some files will have an additional
          // html node that contains the filename.
          if (clipboardData.items.length === 2) {
            clipboardData.items[0].getAsString((s) => {
              fileBlob.name = extractFileName(s);
              UploadActionCreators.upload(this.props.room.id, [fileBlob]);
            });
          } else {
            UploadActionCreators.upload(this.props.room.id, [fileBlob]);
          }
          break;
        default:
      }
    }
  }

  shouldWeAutocomplete() {
    const { value, selectionStart, selectionEnd } = this.refs.textarea;
    let results = [];

    let start = selectionStart;
    const end = selectionEnd;
    let prefix;
    let type;

    const match = value.match(COMMAND_RE);
    if (match) {
      const integration = match[1];
      const query = match[2];
      if (this.state.integration === integration && this.state.query === query) {
        return;
      }
      SlashCommandSearch(integration, query);
      this.setState({
        type: TYPE_INTEGRATION,
        integration,
        command: COMMANDS.filter(c => c.command === integration)[0],
        query,
        results: null,
        start: 0,
        end: value.length
      });
    }

    do {
      if (PREFIX_RE.test(value[start])) {
        if (start === 0 || WHITESPACE_RE.test(value[start - 1])) {
          prefix = value.slice(start, end);
          const regex = new RegExp(`^${RegexUtils.escape(prefix.slice(1))}`, "i");
          const test = v => regex.test(v);

          switch (prefix[0]) {
            case MENTION_SENTINEL:
              type = TYPE_MENTION;
              break;
            case COMMAND_SENTINEL:
              results = COMMANDS.filter(({ command, enabled }) =>
                enabled(command) && test(command)
              ).slice(0, 10);
              type = TYPE_COMMAND;
              break;
            case EMOJI_SENTINEL:
              type = TYPE_EMOJI;
              break;
            case ROOM_SENTINEL:
              type = TYPE_ROOM;
              break;
            default:
          }
        }
        break;
      } else if (WHITESPACE_RE.test(value[start - 1])) {
        break;
      }
    } while (--start >= 0);
    this.setState({ type, results, prefix, start, end, integration: null, command: null });
  }

  performAutocomplete(text) {
    const { textarea } = this.refs;
    const before = textarea.value.slice(0, this.state.start);
    const after = textarea.value.slice(this.state.end);
    text += " ";
    textarea.value = before + text + after;
    textarea.selectionEnd = before.length + text.length + 1;
    this.shouldWeAutocomplete();
  }

  render() {
    let actions = [SmileyIcon].map((action, index) => (
      <div className="icon action" key={`action-${index}`}>
        {React.createElement(action)}
      </div>)
    );

    let autocomplete;
    const autocompleteComponent = this.state.focused && {
      [TYPE_MENTION]: MentionTypeAhead,
      [TYPE_EMOJI]: EmojiTypeAhead,
      [TYPE_COMMAND]: CommandTypeAhead,
      [TYPE_ROOM]: RoomTypeAhead
    }[this.state.type];
    if (autocompleteComponent) {
      autocomplete = React.createElement(autocompleteComponent, {
        ref: "suggestions",
        key: this.state.prefix,
        results: this.state.results,
        type: this.state.prefix,
        onSelect: this.performAutocomplete
      });
    }

    return (
      <div
        className="composer flex-spacer flex-horizontal"
      >
        <textarea
          className="flex-spacer"
          ref="textarea"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="true"
          placeholder="Type your message here"
          rows="1"
          onFocus={this.handleTextareaFocus}
          onBlur={this.handleTextareaBlur}
          onChange={this.handleOnChange}
          onKeyPress={this.handleOnKeyPress}
          onKeyUp={this.handleOnKeyUp}
          onKeyDown={this.handleOnKeyDown}
          onPaste={this.handleOnPaste}
          defaultValue={this.props.defaultValue}
        />
        {actions}
        {autocomplete}
      </div>
    );
  }
}

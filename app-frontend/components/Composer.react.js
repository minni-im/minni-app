import React from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import { Container } from "flux/utils";
import { ALL as EMOJIS } from "emojify";

import { SmileyIcon } from "../utils/IconsUtils";

import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";
import { search as SlashCommandSearch } from "../actions/SlashCommandActionCreators";

import Room from "../models/Room";

import SlashCommandStore from "../stores/SlashCommandStore";
import UserStore from "../stores/UserStore";

import TypingUtils from "../utils/TypingUtils";
import RegexUtils from "../utils/RegexUtils";

import Avatar from "./generic/Avatar.react";

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
const COMMAND_DISABLED = () => false;

const COMMANDS = [
  {
    command: "gif",
    title: "Buukkit",
    description: "Search animated gifs on http://buukkit.appspot.com",
    enabled: COMMAND_ENABLED,
    typeahead: true,
    images: true
  }, {
    command: "me",
    title: "Me",
    description: "What are you doing ?",
    enabled: COMMAND_DISABLED
  }, {
    command: "giphy",
    title: "Giphy",
    description: "Search animated gifs from Giphy",
    enabled: COMMAND_DISABLED,
    typeahead: true,
    images: true
  }
];

const MENTION_SENTINEL = "@";
const ROOM_SENTINEL = "#";
const EMOJI_SENTINEL = ":";
const COMMAND_SENTINEL = "/";
const PREFIX_RE = new RegExp(
  `${MENTION_SENTINEL}|${ROOM_SENTINEL}|${EMOJI_SENTINEL}|^${COMMAND_SENTINEL}`
);

const COMMAND_RE_TEXT = `^/(${COMMANDS.filter(c => c.typeahead)
    .map(c => c.command)
    .join("|")
  })\\s(.+)`;
const COMMAND_RE = new RegExp(COMMAND_RE_TEXT, "i");
const WHITESPACE_RE = /(\t|\s)/;

const TYPEAHEAD_NONE = 0;
const TYPEAHEAD_MENTION = 1;
const TYPEAHEAD_EMOJI = 2;
const TYPEAHEAD_COMMAND = 3;
const TYPEAHEAD_COMMAND_RESULTS = 4;
const TYPEAHEAD_ROOM = 5;

class TypeAheadResults extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    results: React.PropTypes.array,
    command: React.PropTypes.object,
    onSelect: React.PropTypes.func.isRequired
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
    if (!this.props.command && (results == null || results.length === 0)) {
      return null;
    }
    const classNames = {
      suggestions: true
    };
    if (this.props.command) {
      classNames[`suggestions-${this.props.command.command}`] = true;
      classNames["suggestions-images"] = !!this.props.command.images;
    }

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

class CommandTypeAhead extends TypeAheadResults {
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

class SlashCommandTypeAheadResultsContainer extends TypeAheadResults {
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
    // We don't wnat to append an extra space after the url;
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

const SlashCommandTypeAheadResults = Container.create(
  SlashCommandTypeAheadResultsContainer,
  { withProps: true }
);

class MentionTypeAhead extends TypeAheadResults {
  transformSelectionToText(user) {
    return MENTION_SENTINEL + user.nickname;
  }

  renderHeader() {
    if (this.props.prefix.length > 1) {
      return (
        <div>Coworkers matching {MENTION_SENTINEL}<strong>{this.props.prefix.slice(1)}</strong></div>
      );
    }
    return "Coworkers & Bots";
  }

  renderRow(user, props) {
    return (
      <div {...props}>
        <div>
          <Avatar size={Avatar.SIZE.SMALL} user={user} />
          {user.fullname}{" "}
          <em>({MENTION_SENTINEL}{user.nickname})</em>
        </div>
        <div className="suggestion-item--info">
          {user.status}
        </div>
      </div>
    );
  }
}

class EmojiTypeAhead extends TypeAheadResults {
  transformSelectionToText(emoji) {
    return EMOJI_SENTINEL + emoji.name + EMOJI_SENTINEL;
  }

  renderHeader() {
    return (
      <div>Emojis matching <strong>{this.props.prefix}</strong></div>
    );
  }

  renderRow(emoji, props) {
    return (
      <div {...props}>
        <img
          className="emoji"
          draggable={false}
          alt={""}
          title={`:${emoji.name}:`}
          src={`/images/emoji/emojione/svg/${emoji.unicode[0]}.svg`}
        />
        &nbsp;
        {`${EMOJI_SENTINEL}${emoji.name}${EMOJI_SENTINEL}`}
      </div>
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
    let start = selectionStart;
    const end = selectionEnd;
    let results;
    let prefix;
    let type = TYPEAHEAD_NONE;

    const match = value.match(COMMAND_RE);
    if (match) {
      const integration = match[1];
      const query = match[2];
      if (this.state.integration === integration && this.state.query === query) {
        return;
      }
      SlashCommandSearch(integration, query);
      this.setState({
        type: TYPEAHEAD_COMMAND_RESULTS,
        integration,
        query,
        command: COMMANDS.filter(c => c.command === integration)[0],
        results: null,
        start: 0,
        end: value.length
      });
      return;
    }

    do {
      if (PREFIX_RE.test(value[start])) {
        if (start === 0 || WHITESPACE_RE.test(value[start - 1])) {
          prefix = value.slice(start, end);
          if (this.state.prefix !== prefix) {
            const regex = new RegExp(`^${RegexUtils.escape(prefix.slice(1))}`, "i");
            const test = v => regex.test(v);

            switch (prefix[0]) {
              case MENTION_SENTINEL:
                type = TYPEAHEAD_MENTION;
                results = UserStore.getAll()
                  .filter(user => user.nickname.indexOf(prefix.slice(1)) === 0)
                  .slice(0, 10);
                break;
              case COMMAND_SENTINEL:
                type = TYPEAHEAD_COMMAND;
                results = COMMANDS.filter(({ command, enabled }) =>
                  enabled(command) && test(command)
                ).slice(0, 10);
                break;
              case EMOJI_SENTINEL:
                type = TYPEAHEAD_EMOJI;
                if (prefix.length > 2) {
                  results = Object.keys(EMOJIS)
                    .reduce((matching, emoji) => {
                      if (test(emoji)) {
                        matching.push({
                          name: emoji,
                          ...EMOJIS[emoji]
                        });
                      }
                      return matching;
                    }, [])
                    .slice(0, 10);
                } else {
                  results = [];
                }
                break;
              case ROOM_SENTINEL:
                type = TYPEAHEAD_ROOM;
                break;
              default:
            }
          } else {
            type = this.state.type;
            results = this.state.results;
          }
        }
        break;
      } else if (WHITESPACE_RE.test(value[start - 1])) {
        break;
      }
    } while (--start >= 0);
    this.setState({ type, results, prefix, start, end, integration: null, command: null });
  }

  performAutocomplete(text, trailingSpace = true) {
    const { textarea } = this.refs;
    const before = textarea.value.slice(0, this.state.start);
    const after = textarea.value.slice(this.state.end);
    if (trailingSpace) {
      text += " ";
    }
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
    const autocompleteComponent = /* this.state.focused && */{
      [TYPEAHEAD_MENTION]: [MentionTypeAhead, "suggestions-mention"],
      [TYPEAHEAD_EMOJI]: [EmojiTypeAhead, "suggestions-emoji"],
      [TYPEAHEAD_COMMAND]: [CommandTypeAhead, "suggestions-command"],
      [TYPEAHEAD_COMMAND_RESULTS]: [SlashCommandTypeAheadResults, "suggestions-command-results"],
      [TYPEAHEAD_ROOM]: [RoomTypeAhead, "suggestions-room"]
    }[this.state.type];
    if (autocompleteComponent) {
      const [component, className] = autocompleteComponent;
      autocomplete = React.createElement(component, {
        ref: "suggestions",
        className,
        key: this.state.query || this.state.prefix,
        prefix: this.state.prefix,
        command: this.state.command,
        query: this.state.query,
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

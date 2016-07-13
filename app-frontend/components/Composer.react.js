import React from "react";
import ReactDOM from "react-dom";
import { ALL as EMOJIS, MASK_BY_PROVIDER } from "emojify";

import { SmileyIcon } from "../utils/IconsUtils";

import CommandTypeAhead, { COMMAND_SENTINEL } from "./typeahead/CommandResults.react";
import EmojiTypeAhead, { EMOJI_SENTINEL } from "./typeahead/EmojiResults.react";
import MentionTypeAhead, { MENTION_SENTINEL } from "./typeahead/MentionResults.react";
import RoomTypeAhead, { ROOM_SENTINEL } from "./typeahead/RoomResults.react";
import SlashCommandTypeAhead from "./typeahead/SlashCommandResults.react";


import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";
import { search as SlashCommandSearch } from "../actions/SlashCommandActionCreators";

import Room from "../models/Room";

import ComposerPluginsStore from "../stores/ComposerPluginsStore";
import UserSettingsStore from "../stores/UserSettingsStore";
import UserStore from "../stores/UserStore";
import AccountRoomStore from "../stores/AccountRoomStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

import { KEYCODES } from "../utils/KeyboardUtils";
import TypingUtils from "../utils/TypingUtils";
import RegexUtils from "../utils/RegexUtils";

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
                results = this.processMentionSentinelResults(prefix);
                break;

              case COMMAND_SENTINEL:
                if (start === 0) {
                  type = TYPEAHEAD_COMMAND;
                  results = COMMANDS.filter(({ command, enabled }) =>
                    enabled(command) && test(command)
                  ).slice(0, 10);
                }
                break;

              case EMOJI_SENTINEL:
                type = TYPEAHEAD_EMOJI;
                if (prefix.length > 2) {
                  results = this.processEmojiSentinelResults(test);
                }
                break;

              case ROOM_SENTINEL:
                type = TYPEAHEAD_ROOM;
                if (prefix.length > 3) {
                  results = this.processRoomSentinelResults(test);
                }
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

  processMentionSentinelResults(prefix) {
    return UserStore.getAll()
    .filter(user =>
      user.nickname.startsWith(prefix.slice(1))
    )
    .slice(0, 10);
  }

  processEmojiSentinelResults(test) {
    return Object.keys(EMOJIS)
      .reduce((matching, emoji) => {
        if (
          test(emoji) &&
          EMOJIS[emoji].mask & MASK_BY_PROVIDER[UserSettingsStore.getValue("global.emojis_type")]
        ) {
          matching.push(emoji);
        }
        return matching;
      }, [])
      .slice(0, 10);
  }

  processRoomSentinelResults(test) {
    const user = UserStore.getConnectedUser();
    const connectedAccount = SelectedAccountStore.getAccount();
    const rooms = AccountRoomStore.getRooms(connectedAccount.id);
    return rooms
      .filter(room => room !== this.props.room && test(room.slug))
      .filter(room =>
        room.public || (
          room.private && (
            room.usersId.includes(user.id) ||
            room.isUserAdmin(user.id)
          )
        )
      )
      .toArray()
      .slice(0, 10);
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
      [TYPEAHEAD_COMMAND_RESULTS]: [SlashCommandTypeAhead, "suggestions-command-results"],
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

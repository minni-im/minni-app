import React from "react";
import ReactDOM from "react-dom";

import { PLUGIN_TYPES } from "../Constants";

import { SmileyIcon } from "../utils/IconsUtils";

import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";
import { search as SlashCommandSearch } from "../actions/SlashCommandActionCreators";

import Room from "../models/Room";

import PluginsStore from "../stores/PluginsStore";

import { KEYCODES } from "../utils/KeyboardUtils";
import TypingUtils from "../utils/TypingUtils";
import RegexUtils from "../utils/RegexUtils";

const WHITESPACE_RE = /(\t|\s)/;

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
  };

  static defautProps = {
    defaultValue: ""
  };

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
  };

  componentDidMount() {
    this.lineHeight = parseInt(
      window.getComputedStyle(this.textarea, null).getPropertyValue("line-height"),
      10
    );
    this.computeTextAreaHeight(1);
    this.moveCursorAtEnd();
  }

  componentWillUnmount() {
    ComposerActionCreators.saveCurrentText(this.props.room.id, this.textarea.value.trim());
  }

  clearValue() {
    this.textarea.value = "";
    this.computeTextAreaHeight(1);
    ComposerActionCreators.saveCurrentText(this.props.room.id, "");
  }

  focus() {
    this.textarea.focus();
  }

  moveCursorAtEnd() {
    this.textarea.selectionStart = this.textarea.selectionEnd = this.textarea.value.length;
  }

  computeTextAreaHeight(numberOfLine) {
    this.textarea.style.height = `${numberOfLine * this.lineHeight}px`;
    this.textarea.scrollTop = this.textarea.offsetHeight;
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
        value = this.textarea.value;
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
    const suggestions = this.suggestions;
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
    const { value, selectionStart, selectionEnd } = this.textarea;
    let start = selectionStart;
    const end = selectionEnd;
    let results;
    let prefix;
    let type = null;

    const TYPEAHEAD_PLUGINS = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_TYPEAHEAD);
    const COMMAND_PLUGINS = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_COMMAND);
    const COMMAND_RE_TEXT = `^/(${COMMAND_PLUGINS.filter(c => c.typeahead)
      .map(c => c.command)
      .join("|")})\\s(.+)`;
    const COMMAND_RE = new RegExp(COMMAND_RE_TEXT, "i");

    const PREFIX_RE = new RegExp(
      TYPEAHEAD_PLUGINS.filter(plugin => plugin.PREFIX || plugin.SENTINEL)
        .map(plugin => plugin.PREFIX || plugin.SENTINEL)
        .join("|")
    );

    const commandMatch = value.match(COMMAND_RE);
    if (commandMatch) {
      const integration = commandMatch[1];
      const query = commandMatch[2];
      if (this.state.integration === integration && this.state.query === query) {
        return;
      }
      SlashCommandSearch(integration, query);
      this.setState({
        type: "commandresults",
        integration,
        query,
        command: COMMAND_PLUGINS.filter(c => c.command === integration)[0],
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

            for (const { name, SENTINEL, reduce } of TYPEAHEAD_PLUGINS) {
              if (SENTINEL && prefix[0] === SENTINEL) {
                type = name;
                results = reduce(prefix, start, test);
                break;
              }
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
    const before = this.textarea.value.slice(0, this.state.start);
    const after = this.textarea.value.slice(this.state.end);
    if (trailingSpace) {
      text += " ";
    }
    this.textarea.value = before + text + after;
    this.textarea.selectionEnd = before.length + text.length + 1;
    this.shouldWeAutocomplete();
  }

  render() {
    const actions = [SmileyIcon].map((action, index) => (
      <div className="icon action" key={`action-${index}`}>
        {React.createElement(action)}
      </div>
    ));

    const PLUGINS = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_TYPEAHEAD);
    const PLUGINS_COMPONENTS = PLUGINS.reduce(
      (dict, plugin) => {
        dict[plugin.name] = plugin.ResultsPanel;
        return dict;
      },
      {}
    );

    let autocomplete;
    const autocompleteComponent = /* this.state.focused && */
    PLUGINS_COMPONENTS[this.state.type];

    if (autocompleteComponent) {
      autocomplete = React.createElement(autocompleteComponent, {
        ref: (suggestions) => {
          this.suggestions = suggestions;
        },
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
      <div className="composer flex-spacer flex-horizontal">
        <textarea
          className="flex-spacer"
          ref={(textarea) => {
            this.textarea = textarea;
          }}
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

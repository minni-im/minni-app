import React from "react";
import ReactDOM from "react-dom";

import { SmileyIcon } from "../utils/IconsUtils";

import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";

import Room from "../models/Room";
import TypingUtils from "../utils/TypingUtils";

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
  constructor(props) {
    super(props);
    this.handleTextareaFocus = this.handleTextareaFocus.bind(this);
    this.handleTextareaBlur = this.handleTextareaBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnPaste = this.handleOnPaste.bind(this);
  }

  state = {
    results: []
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
    switch (event.which) {
      case KEYCODES.ENTER:
        const value = this.refs.textarea.value;
        const shouldSend = !event.shiftKey;
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
    //TODO forward event to active typeahead
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
    const { value } = this.refs.textarea;
    const results = [];
    if (value.length > 3) {
      results.push("yo");
    }
    this.setState({ results });
  }

  render() {
    let actions = [SmileyIcon].map((action, index) => (
      <div className="icon action" key={`action-${index}`}>
        {React.createElement(action)}
      </div>)
    );

    let autocomplete;
    if (this.state.focused && this.state.results && this.state.results.length > 0) {
      autocomplete = (<div className="suggestions">
        <div className="suggestions-header">
          Fecthing image from <a href="https://buukkit.appspot.com/" target="_blank">https://buukkit.appspot.com/</a>
        </div>
        <div className="suggestions-list">
          <div>Prout</div>
          <div>Prout</div>
          <div>Prout</div>
        </div>
      </div>);
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

Composer.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string,
  room: React.PropTypes.instanceOf(Room)
};

Composer.defautProps = {
  defaultValue: ""
};

import React from "react";
import ReactDOM from "react-dom";

import { SmileyIcon, UploadIcon } from "../utils/IconsUtils";

import ComposerActionCreators from "../actions/ComposerActionCreators";
import UploadActionCreators from "../actions/UploadActionCreators";

import TypingUtils from "../utils/TypingUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("Composer.react");

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
        return filename + ".png";
      }
    }
  }
  return undefined;
}


export default class Composer extends React.Component {
  componentWillUnmount() {
    ComposerActionCreators.saveCurrentText(this.props.room.id, this.refs.textarea.value.trim());
  }

  componentDidMount() {
    const { textarea } = this.refs;
    this._lineHeight = parseInt(window.getComputedStyle(this.refs.textarea, null).getPropertyValue("line-height"), 10);
    this._computeTextAreaHeight(1);
    this._moveCursorAtEnd();
  }

  clearValue() {
    this.refs.textarea.value = "";
    this._computeTextAreaHeight(1);
    ComposerActionCreators.saveCurrentText(this.props.room.id, "");
  }

  focus() {
    this.refs.textarea.focus();
  }

  _moveCursorAtEnd() {
    const { textarea } = this.refs;
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
  }

  _computeTextAreaHeight(numberOfLine) {
    const { textarea } = this.refs;
    textarea.style.height = `${numberOfLine * this._lineHeight}px`;
    textarea.scrollTop = textarea.offsetHeight;
  }

  _handleTextareaFocus() {
    ReactDOM.findDOMNode(this).classList.toggle("active");
  }

  _handleOnChange(event) {
    const text = event.target.value;
    this._computeTextAreaHeight(text.split("\n").length);
    TypingUtils.sendTyping(this.props.room.id);
  }

  _handleOnKeyPress(event) {
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

    }
  }

  _handleOnKeyUp(event) {
    //TODO compute typeahead autocompletion here.
  }

  _handleOnKeyDown(event) {
    //TODO forward event to active typeahead
  }

  _handleOnPaste(event) {
    const { clipboardData } = event;
    if (!clipboardData || !clipboardData.items) {
      return;
    }

    for (let i = 0; i < clipboardData.items.length; i++) {
      const clipboardItem = clipboardData.items[i];
      switch (clipboardItem.type) {
        case "image/png":
          let fileBlob = clipboardItem.getAsFile();

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
      }
    }
  }

  render() {
    const { room } = this.props;

    let actions = [ SmileyIcon ].map((action, index) => {
      return <div className="icon action" key={`action-${index}`}>
        {React.createElement(action)}
      </div>;
    });

    return <div className="composer">
      <textarea ref="textarea"
        autoCorrect="off" autoComplete="off" spellCheck="true"
        placeholder="Type your message here"
        rows="1"
        onFocus={this._handleTextareaFocus.bind(this)}
        onBlur={this._handleTextareaFocus.bind(this)}
        onChange={this._handleOnChange.bind(this)}
        onKeyPress={this._handleOnKeyPress.bind(this)}
        onKeyUp={this._handleOnKeyUp.bind(this)}
        onKeyDown={this._handleOnKeyDown.bind(this)}
        onPaste={this._handleOnPaste.bind(this)}
        defaultValue={this.props.defaultValue} />

      {actions}

      <div className="suggestions">
        <div className="suggestions-header">
          Fecthing image from <a href="https://buukkit.appspot.com/" target="_blank">https://buukkit.appspot.com/</a>
        </div>
        <div className="suggestions-list">
          <div>Prout</div>
          <div>Prout</div>
          <div>Prout</div>
        </div>
      </div>
    </div>;
  }
}

Composer.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
};

Composer.defautProps = {
  defaultValue: ""
};

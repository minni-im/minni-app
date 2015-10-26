import React from "react";
import ReactDOM from "react-dom";

import { SmileyIcon, UploadIcon } from "../utils/IconsUtils";

export default class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  render() {
    return <div className="composer">
      <pre className="shadow" dangerouslySetInnerHTML={{__html: (this.state.text + "\n")}}></pre>
      <textarea ref="textarea"
        onFocus={this._handleTextareaFocus.bind(this)}
        onBlur={this._handleTextareaFocus.bind(this)}
        rows="1" onChange={this._handleOnChange.bind(this)} defaultValue={this.state.text}></textarea>
      <div className="icon action">
        <UploadIcon />
      </div>
      <div className="icon action">
        <SmileyIcon />
      </div>
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

  _handleTextareaFocus() {
    ReactDOM.findDOMNode(this).classList.toggle("active");
  }

  _handleOnChange(event) {
    const text = event.target.value;
    this.setState({
      text
    });
  }
}

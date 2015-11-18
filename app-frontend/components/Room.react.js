import React from "react";
import classnames from "classnames";

import RoomActionCreators from "../actions/RoomActionCreators";

import MessagesContainer from "./MessagesContainer.react";
import Composer from "./Composer.react";
import TypingInfo from "./TypingInfo.react";
import { FavoriteIcon } from "../utils/IconsUtils";

import ComposerStore from "../stores/ComposerStore";

import { MAX_MESSAGE_LENGTH } from "../Constants";

export default class Room extends React.Component {
  componentDidMount() {
    this._focusComposer();
  }

  render() {
    const { room } = this.props;
    const { name, topic } = room;
    const defaultValue = ComposerStore.getSavedText(room.id);
    return <section className={classnames({"room--favorite": room.starred})}>
      <header>
        <div className="header-info">
          <h2>
            <span>{name}</span>
            <span className="icon icon--favorite" onClick={this._onRoomFavoriteToggle.bind(this)}><FavoriteIcon /></span>
          </h2>
          <h3>{topic}</h3>
        </div>
      </header>
      <MessagesContainer room={room} />
      <footer onClick={this._handleFooterOnClick.bind(this)}>
        <Composer ref="composer" room={room} defaultValue={defaultValue}
          onSubmit={this._handleSendMessage.bind(this)} />
        <div className="footer">
          <TypingInfo room={room} />
          <div className="contextual-info">
            <span className="formatting-tips has-tooltip">
              Formatting Tips
              <div className="tooltip-content">
                <span><em>_italics_</em></span>
                <span><strong>*bold*</strong></span>
                <span>~<strike>strike</strike>~</span>
                <span><code>`code`</code></span>
                <span><code>```preformatted```</code></span>
                <span>&gt;quote</span>
              </div>
            </span>
          </div>
        </div>
      </footer>
    </section>;
  }

  _focusComposer() {
    this.refs.composer.focus();
  }

  _handleSendMessage(message) {
    if (message.length === 0) {
      return false;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      //TODO show an alert message here
      return false;
    }
    RoomActionCreators.sendMessage(this.props.room.id, message);
    return true;
  }

  _handleFooterOnClick() {
    this._focusComposer();
  }

  _onRoomFavoriteToggle(event) {
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }
}

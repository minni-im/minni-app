import React from "react";
import classnames from "classnames";

import RoomActionCreators from "../actions/RoomActionCreators";

import MessagesContainer from "./MessagesContainer.react";
import Composer from "./Composer.react";
import TypingInfo from "./TypingInfo.react";
import { FavoriteIcon } from "../utils/IconsUtils";
import { parseTitle } from "../utils/MarkupUtils";

import ComposerStore from "../stores/ComposerStore";

import { MAX_MESSAGE_LENGTH } from "../Constants";

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomFavoriteToggle = this.handleRoomFavoriteToggle.bind(this);
    this.handleFooterOnClick = this.handleFooterOnClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    this.focusComposer();
  }

  focusComposer() {
    this.refs.composer.focus();
  }

  handleSendMessage(message) {
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

  handleFooterOnClick() {
    this.focusComposer();
  }

  handleRoomFavoriteToggle(event) {
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }

  render() {
    const { room } = this.props;
    const { name, topic } = room;
    const defaultValue = ComposerStore.getSavedText(room.id);
    return (
      <section
        className={classnames("flex-vertical", "flex-spacer", { "room--favorite": room.starred })}
      >
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>
              <span>{parseTitle(name)}</span>
              <span
                className="icon icon--favorite"
                onClick={this.handleRoomFavoriteToggle}
              ><FavoriteIcon /></span>
            </h2>
            <h3>{parseTitle(topic)}</h3>
          </div>
        </header>
        <MessagesContainer room={room} />
        <footer
          className="flex-vertical"
          onClick={this.handleFooterOnClick}
        >
          <Composer
            ref="composer"
            room={room}
            defaultValue={defaultValue}
            onSubmit={this.handleSendMessage}
          />
          <div className="footer flex-horizontal">
            <TypingInfo room={room} />
            &nbsp;
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
      </section>
    );
  }
}

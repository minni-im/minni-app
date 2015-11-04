import React from "react";

import Logger from "../libs/Logger";
const logger = Logger.create("Messages.react");

import { AVATAR_SIZES } from "../Constants";
import Avatar from "./generic/Avatar.react";

class Message extends React.Component {
  render() {
    const { message } = this.props;
    return <div className="message">
      <div className="header">
        <Avatar user={message.user} />
      </div>
      {message.user.fullname}: {message.content}
    </div>;
  }
}

Message.propTypes = {
  message: React.PropTypes.object.isRequired
};

export default class Messages extends React.Component {
  componentDidMount() {
    logger.info("Checking scroll position");
    this.restoreScroll();
  }

  componentDidUpdate(prevProps, nextProps) {
    this.scrollToBottom();
  }

  restoreScroll() {
    // TODO: if user previously scrolled up, restore here.

    this.scrollToBottom();
  }

  scrollTo(offset) {
    const { scroller } = this.refs;
    scroller.scrollTop = offset;
  }

  scrollToBottom() {
    const { scroller } = this.refs;
    this.scrollTo(scroller.scrollHeight);
  }

  render() {
    const messages = this.props.messages.toArray().map(message => {
      return <Message key={message.id} message={message} />;
    });

    return <section className="panel panel--contrast messages" ref="scroller">
      {messages}
    </section>;
  }
}

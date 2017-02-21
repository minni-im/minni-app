import React from "react";
import classnames from "classnames";

import * as RoomActionCreators from "../actions/RoomActionCreators";
import * as DimensionActionCreators from "../actions/DimensionActionCreators";
import * as MessageActionCreators from "../actions/MessageActionCreators";

import { MessageStreamTypes, FETCH_HISTORY_TRESHOLD } from "../Constants";

import Avatar from "./generic/Avatar.react";
import Embed from "./Embed.react";
import WelcomeMessage from "./WelcomeMessage.react";

import Logger from "../libs/Logger";
const logger = Logger.create("Messages.react");

class Message extends React.Component {
  static propTypes = {
    first: React.PropTypes.bool,
    message: React.PropTypes.object.isRequired,
    renderEmbeds: React.PropTypes.bool,
    inlineImages: React.PropTypes.bool,
    clock24: React.PropTypes.bool
  };

  static defaultProps = {
    first: false
  };

  render() {
    const { message, renderEmbeds, inlineImages, clock24 } = this.props;
    const hasEmbeds = message.hasEmbeds;
    let header;
    let timestamp;
    if (this.props.first) {
      header = (
        <div className="message--header">
          <span className="user-name">{message.user.fullname}</span>
          <span className="timestamp">{message.dateCreated.calendar()}</span>
        </div>
      );
    } else {
      timestamp = (
        <div className="message--timestamp">
          {message.dateCreated.format(clock24 ? "HH:MM" : "hh:mm A")}
        </div>
      );
    }

    let content = (
      <div
        className="message--content"
        onClick={(event) => {
          if (event.altKey) {
            MessageActionCreators.togglePreview(message);
            event.preventDefault();
          }
        }}
      >
        {message.contentParsed}
      </div>
    );

    let embeds;
    if (hasEmbeds && message.preview) {
      if (inlineImages && message.singleEmbed) {
        content = (
          <Embed
            {...message.embeds.get(0).toJS()}
            onHidePreview={() => {
              MessageActionCreators.togglePreview(message);
            }}
          />
        );
      } else if (renderEmbeds) {
        embeds = (
          <div className="message--embeds">
            {message.embeds
                .map((embed, index) => (
                  <Embed
                    key={index}
                    {...embed.toJS()}
                    onHidePreview={() => {
                      MessageActionCreators.togglePreview(message);
                    }}
                  />
                ))
                .toArray()}
          </div>
          );
      }
    }

    const classNames = {
      "message-first": this.props.first,
      "message-embed": hasEmbeds
    };

    return (
      <div className={classnames("message", classNames)}>
        {header}
        {timestamp}
        {content}
        {embeds}
      </div>
    );
  }
}

class MessageGroup extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array.isRequired,
    renderEmbeds: React.PropTypes.bool,
    inlineImages: React.PropTypes.bool,
    clock24: React.PropTypes.bool,
    emphasisMe: React.PropTypes.bool
  };

  render() {
    const user = this.props.messages[0].user;
    const messages = this.props.messages.map((message, i) => (
      <Message
        key={message.id}
        first={i === 0}
        message={message}
        clock24={this.props.clock24}
        renderEmbeds={this.props.renderEmbeds}
        inlineImages={this.props.inlineImages}
      />
    ));
    const avatar = <Avatar user={user} />;
    const { emphasisMe } = this.props;
    const classNames = {
      "message-group-me": this.props.viewer.id === user.id && emphasisMe
    };
    return (
      <div className={classnames("message-group", "flex-horizontal", classNames)}>
        {avatar}
        <div className="group-content flex-spacer">
          {messages}
        </div>
      </div>
    );
  }
}

function MessageTimestamp(props) {
  return (
    <div className="message-timestamp">
      {props.children}
    </div>
  );
}

export default class Messages extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired,
    dimensions: React.PropTypes.object,
    messagesState: React.PropTypes.object,
    renderEmbeds: React.PropTypes.bool,
    inlineImages: React.PropTypes.bool,
    emphasisMe: React.PropTypes.bool,
    clock24: React.PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.onHandleScroll = this.onHandleScroll.bind(this);
    this.onHandleLoadMore = this.onHandleLoadMore.bind(this);
  }

  componentDidMount() {
    this.restoreScroll();
  }

  componentDidUpdate(prevProps) {
    // This would affect the overall scroll size. We don't bother, let's move back to bottom
    if (
      prevProps.renderEmbeds !== this.props.renderEmbeds ||
      prevProps.inlineImages !== this.props.inlineImages
    ) {
      this.scrollToBottom();
    } else if (this.props.messages.last() !== prevProps.messages.last()) {
      // Last message has changed.
      if (prevProps.messagesState.loadingMore) {
        this.restoreScroll();
      }

      const latestMessage = this.props.messages.last();
      const currentUser = this.props.viewer;
      if (latestMessage && latestMessage.user.id === currentUser.id || this.isAtBottom()) {
        this.scrollToBottom();
      }
    } else if (
      prevProps.messages.first() !== this.props.messages.first() &&
      prevProps.messagesState.loadingMore
    ) {
      // The first message changed and was previously loading more.
      this.handleLoadMore();
    }
  }

  onHandleScroll() {
    // Nothing to compute about dimensions. It's empty
    if (this.props.messages.size === 0) {
      return;
    }

    const { scroller } = this;
    // Reaching the top when scrolling with a scrollable viewport
    if (
      scroller.scrollTop < FETCH_HISTORY_TRESHOLD && scroller.scrollHeight > scroller.offsetHeight
    ) {
      if (this.props.messagesState.hasMore && !this.props.messagesState.loadingMore) {
        this.loadMore();
      }
    }

    // If at the bottom we can clear dimensions.
    // we can't use `isAtBottom()` here as it would always be true, and we would
    // never get new dimensions.
    if (scroller.scrollTop + scroller.clientHeight === scroller.scrollHeight) {
      DimensionActionCreators.clearDimensions(this.props.room);
    } else {
      // Otherwise keep track of the current dimensions to use to offset calculation.
      DimensionActionCreators.updateDimensions(this.props.room, {
        scrollTop: scroller.scrollTop,
        scrollHeight: scroller.scrollHeight
      });
    }
  }

  onHandleLoadMore() {
    this.loadMore().then(() => {
      if (this.hasMore) {
        this.hasMore.scrollIntoView(true);
      } else {
        this.scrollTo(0);
      }
    });
  }

  loadMore() {
    return RoomActionCreators.fetchMessages(
      this.props.room.id,
      this.props.messages.first().dateCreated.toISOString()
    );
  }

  handleLoadMore() {
    if (!this.isAtBottom()) {
      this.scrollTo(this.scroller.scrollHeight - this.props.dimensions.scrollHeight);
    }
  }

  restoreScroll() {
    // If we have scroll position info, let's use it.
    if (this.props.dimensions !== null) {
      this.scrollTo(this.props.dimensions.scrollTop);
    } else {
      this.scrollToBottom();
    }
  }

  isAtBottom() {
    return this.props.dimensions === null;
  }

  scrollTo(offset) {
    this.scroller.scrollTop = offset;
  }

  scrollToBottom() {
    this.scrollTo(this.scroller.scrollHeight);
  }

  regroupMessages(messages) {
    const messageGroups = [];
    messages.forEach((message) => {
      const lastMessageGroup = messageGroups[messageGroups.length - 1];
      if (
        lastMessageGroup == null ||
        lastMessageGroup[0].user.id !== message.user.id ||
        lastMessageGroup[0].dateCreated.day() !== message.dateCreated.day() ||
        lastMessageGroup[0].dateCreated.hour() !== message.dateCreated.hour()
      ) {
        messageGroups.push([message]);
      } else {
        lastMessageGroup.push(message);
      }
    });

    let lastTimestamp;
    const messageStream = [];
    messageGroups.forEach((group) => {
      const timestamp = group[0].dateCreated.format("dddd, LL");
      if (timestamp !== lastTimestamp) {
        if (lastTimestamp != null) {
          messageStream.push({
            type: MessageStreamTypes.DIVIDER_TIME_STAMP,
            content: timestamp
          });
        }
        lastTimestamp = timestamp;
      }
      messageStream.push({
        type: MessageStreamTypes.MESSAGE_GROUP,
        content: group
      });
    });
    return messageStream;
  }

  render() {
    const messageGroup = this.regroupMessages(this.props.messages);
    const messageGroupFinal = messageGroup.map(({ type, content }, i) => {
      if (type === MessageStreamTypes.DIVIDER_TIME_STAMP) {
        return <MessageTimestamp key={i}><h4>{content}</h4></MessageTimestamp>;
      }

      return (
        <MessageGroup
          key={content[0].id}
          viewer={this.props.viewer}
          messages={content}
          renderEmbeds={this.props.renderEmbeds}
          inlineImages={this.props.inlineImages}
          emphasisMe={this.props.emphasisMe}
          clock24={this.props.clock24}
        />
      );
    });
    if (this.props.messagesState.loadingMore || !this.props.messagesState.ready) {
      messageGroupFinal.unshift(
        <div key="loading-more" className="message-loading-more">
          Retrieving messages history...
        </div>
      );
    } else if (this.props.messagesState.hasMore) {
      messageGroupFinal.unshift(
        <div
          key="has-more"
          ref={(hasMore) => {
            this.hasMore = hasMore;
          }}
          className="message-has-more"
        >
          <span role="link" title="Click to retrieve more messages" onClick={this.onHandleLoadMore}>
            And more...
          </span>
        </div>
      );
    } else {
      messageGroupFinal.unshift(<WelcomeMessage key="welcome-message" room={this.props.room} />);
    }

    return (
      <section
        className="panel panel--contrast flex-vertical flex-spacer"
        ref={(scroller) => {
          this.scroller = scroller;
        }}
        onScroll={this.onHandleScroll}
      >
        <div className="panel-wrapper messages">{messageGroupFinal}</div>
      </section>
    );
  }
}

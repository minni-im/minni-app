import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Container } from "flux/utils";

import * as RoomActionCreators from "../actions/RoomActionCreators";
import * as DimensionActionCreators from "../actions/DimensionActionCreators";
import * as MessageActionCreators from "../actions/MessageActionCreators";

import EditMessageStore from "../stores/EditMessageStore";
import UserStore from "../stores/UserStore";

import {
  MESSAGE_TYPES,
  MESSAGE_STREAM_TYPES,
  FETCH_HISTORY_TRESHOLD,
  MESSAGE_LIST_BOTTOM_TRESHOLD,
  MESSAGE_GROUP_DURATION,
} from "../Constants";

import Avatar from "./generic/Avatar.react";
import Popover from "./generic/Popover.react";
import TimeAgo from "./generic/TimeAgo.react";
import Embed from "./Embed.react";
import WelcomeMessage from "./WelcomeMessage.react";

import Composer from "./Composer.react";

import RoomModel from "../models/Room";

import { debounce } from "../utils/FunctionUtils";
import { decode } from "../utils/MessageUtils";

import Logger from "../libs/Logger";

const logger = Logger.create("Messages.react");

class Message extends React.PureComponent {
  static propTypes = {
    room: PropTypes.instanceOf(RoomModel).isRequired,
    first: PropTypes.bool,
    message: PropTypes.object.isRequired,
    renderEmbeds: PropTypes.bool,
    inlineImages: PropTypes.bool,
    clock24: PropTypes.bool,
    isEditing: PropTypes.bool,
  };

  static defaultProps = {
    first: false,
    isEditing: false,
  };

  editMessage = (event) => {
    const { message } = this.props;
    const canEdit = UserStore.getConnectedUser().id === message.user.id;
    if (canEdit) {
      MessageActionCreators.edit(message.roomId, message.id);
      event.preventDefault();
    }
  };

  render() {
    const {
      room,
      first,
      message,
      renderEmbeds,
      inlineImages,
      clock24,
      isEditing,
    } = this.props;
    const hasEmbeds = message.hasEmbeds;
    const classNames = {
      "message-first": first,
      "message-embed": hasEmbeds,
      "message-edited": message.dateEdited,
    };
    let header;
    let timestamp;

    if (first) {
      header = (
        <div className="message--header">
          <span className="user-name">{message.user.fullname}</span>
          <TimeAgo
            className="timestamp"
            datetime={message.dateCreated}
            format={clock24 ? "dddd, LL HH:mm" : "LLLL"}
          />
        </div>
      );
    } else {
      timestamp = (
        <div className="message--timestamp">
          {message.dateCreated.format(clock24 ? "HH:MM" : "LT")}
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className={classnames("message", classNames)}>
          {header}
          {timestamp}
          <Composer
            persist={false}
            room={this.props.room}
            defaultValue={decode(message.content)}
            onSubmit={(text) => {
              if (decode(text) !== message.content) {
                MessageActionCreators.sendUpdate(message, text);
              } else {
                MessageActionCreators.cancelEdit(room.id, message.id);
              }
            }}
            onEscape={() => {
              MessageActionCreators.cancelEdit(room.id, message.id);
            }}
          />
          <div className="message--edit-actions">
            <kbd className="text-small">esc</kbd> to cancel or{" "}
            <kbd className="text-small">enter</kbd> to save
          </div>
        </div>
      );
    }

    let content = (
      <div
        className="message--content"
        // onDoubleClick={this.editMessage}
        onClick={(event) => {
          if (event.detail === 3) {
            this.editMessage(event);
            return;
          }
          if (!hasEmbeds || !renderEmbeds || !inlineImages) {
            return;
          }
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
            onDoubleClick={this.editMessage}
          />
        );
      } else if (renderEmbeds && !message.singleEmbed) {
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

    let edited;
    if (message.dateEdited) {
      edited = <div className="message--edited">(edited)</div>;
    }

    return (
      <div
        ref={(msg) => {
          this.message = msg;
        }}
        className={classnames("message", classNames)}
      >
        {header}
        {timestamp}
        <div className="message--content-wrapper flex-horizontal">
          {content}
          {edited}
        </div>
        {embeds}
      </div>
    );
  }
}

class MessageContainer extends React.Component {
  static getStores() {
    return [EditMessageStore];
  }

  static calculateState(prevState, props) {
    return {
      isEditing: EditMessageStore.isMessageEdited(
        props.room.id,
        props.message.id
      ),
    };
  }

  render() {
    return <Message {...this.props} isEditing={this.state.isEditing} />;
  }
}

const MessageWrapper = Container.create(MessageContainer, { withProps: true });

class MessageGroup extends React.Component {
  static propTypes = {
    room: PropTypes.instanceOf(RoomModel),
    messages: PropTypes.array.isRequired,
    renderEmbeds: PropTypes.bool,
    inlineImages: PropTypes.bool,
    clock24: PropTypes.bool,
    emphasisMe: PropTypes.bool,
  };

  render() {
    const user = this.props.messages[0].user;
    const messages = this.props.messages.map((message, i) => (
      <MessageWrapper
        key={message.id}
        room={this.props.room}
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
      "message-group-me": this.props.viewer.id === user.id && emphasisMe,
    };
    return (
      <div
        className={classnames("message-group", "flex-horizontal", classNames)}
      >
        {avatar}
        <div className="group-content flex-spacer">{messages}</div>
      </div>
    );
  }
}

function MessageTimestamp(props) {
  return <div className="message-timestamp">{props.children}</div>;
}

function MessageSystemGroup(props) {
  const messages = props.messages.map((message) => (
    <div key={message.id} className="message-system">
      {message.content}{" "}
      <TimeAgo
        datetime={message.dateCreated}
        format={props.clock24 ? "dddd, LL HH:mm" : "LLLL"}
      />
    </div>
  ));
  return <div className="message-group message-group-system">{messages}</div>;
}

export default class Messages extends React.Component {
  static propTypes = {
    room: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    dimensions: PropTypes.object,
    messagesState: PropTypes.object,
    renderEmbeds: PropTypes.bool,
    inlineImages: PropTypes.bool,
    emphasisMe: PropTypes.bool,
    clock24: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.onHandleScroll = debounce(this.onHandleScroll.bind(this), 50);
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
      if (
        (latestMessage &&
          latestMessage.user &&
          latestMessage.user.id === currentUser.id) ||
        this.isAtBottom()
      ) {
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
    const scrollTop = Math.ceil(scroller.scrollTop);

    // Reaching the top when scrolling with a scrollable viewport
    if (
      scrollTop < FETCH_HISTORY_TRESHOLD &&
      scroller.scrollHeight > scroller.offsetHeight
    ) {
      if (
        this.props.messagesState.hasMore &&
        !this.props.messagesState.loadingMore
      ) {
        this.loadMore();
      }
    }

    // If at the bottom we can clear dimensions.
    // we can't use `isAtBottom()` here as it would always be true, and we would
    // never get new dimensions.
    const treshold = Math.abs(
      scrollTop + scroller.clientHeight - scroller.scrollHeight
    );
    if (treshold >= 0 && treshold < MESSAGE_LIST_BOTTOM_TRESHOLD) {
      DimensionActionCreators.clearDimensions(this.props.room);
    } else {
      // Otherwise keep track of the current dimensions to use to offset calculation.
      DimensionActionCreators.updateDimensions(this.props.room, {
        scrollTop,
        scrollHeight: scroller.scrollHeight,
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
      this.scrollTo(
        this.scroller.scrollHeight - this.props.dimensions.scrollHeight
      );
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
    let lastMessage;

    messages.forEach((message) => {
      const lastMessageGroup = messageGroups[messageGroups.length - 1];

      if (
        lastMessageGroup == null ||
        lastMessageGroup[0].type !== message.type ||
        (message.type !== MESSAGE_TYPES.SYSTEM_MESSAGE &&
          lastMessageGroup[0].user &&
          lastMessageGroup[0].user.id !== message.user.id) ||
        (lastMessage &&
          +message.dateCreated >
            +lastMessage.dateCreated + MESSAGE_GROUP_DURATION)
        // lastMessageGroup[0].dateCreated.day() !== message.dateCreated.day() ||
        // lastMessageGroup[0].dateCreated.hour() !== message.dateCreated.hour()
      ) {
        messageGroups.push([message]);
      } else {
        lastMessageGroup.push(message);
      }
      lastMessage = message;
    });

    let lastTimestamp;
    const messageStream = [];
    messageGroups.forEach((group) => {
      const timestamp = group[0].dateCreated.format("dddd, LL");
      if (timestamp !== lastTimestamp) {
        if (lastTimestamp != null) {
          messageStream.push({
            type: MESSAGE_STREAM_TYPES.DIVIDER_TIME_STAMP,
            content: timestamp,
          });
        }
        lastTimestamp = timestamp;
      }

      if (group[0].type === MESSAGE_TYPES.SYSTEM_MESSAGE) {
        messageStream.push({
          type: MESSAGE_STREAM_TYPES.SYSTEM_MESSAGE,
          content: group,
        });
      } else {
        messageStream.push({
          type: MESSAGE_STREAM_TYPES.MESSAGE_GROUP,
          content: group,
        });
      }
    });
    return messageStream;
  }

  render() {
    const messageGroup = this.regroupMessages(this.props.messages);
    const messageGroupFinal = messageGroup.map(({ type, content }, i) => {
      if (type === MESSAGE_STREAM_TYPES.DIVIDER_TIME_STAMP) {
        return (
          <MessageTimestamp key={i}>
            <h4>{content}</h4>
          </MessageTimestamp>
        );
      } else if (type === MESSAGE_STREAM_TYPES.SYSTEM_MESSAGE) {
        return <MessageSystemGroup key={i} messages={content} />;
      }

      return (
        <MessageGroup
          key={content[0].id}
          room={this.props.room}
          viewer={this.props.viewer}
          messages={content}
          renderEmbeds={this.props.renderEmbeds}
          inlineImages={this.props.inlineImages}
          emphasisMe={this.props.emphasisMe}
          clock24={this.props.clock24}
        />
      );
    });
    if (
      this.props.messagesState.loadingMore ||
      !this.props.messagesState.ready
    ) {
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
          <span
            role="link"
            title="Click to retrieve more messages"
            onClick={this.onHandleLoadMore}
          >
            And more...
          </span>
        </div>
      );
    } else {
      messageGroupFinal.unshift(
        <WelcomeMessage key="welcome-message" room={this.props.room} />
      );
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

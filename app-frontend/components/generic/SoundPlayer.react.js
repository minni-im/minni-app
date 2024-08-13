import React from "react";
import { Container } from "flux/utils";
import DocumentTitle from "react-document-title";

import { USER_STATUS } from "../../Constants";

import { playSound } from "../../utils/SoundUtils";

import UnreadMessageStore from "../../stores/UnreadMessageStore";
import UserStore from "../../stores/UserStore";
import UserSettingsStore from "../../stores/UserSettingsStore";

class SoundPlayer extends React.Component {
  static getStores() {
    return [UnreadMessageStore];
  }

  static calculateState() {
    return {
      unreadCount: UnreadMessageStore.getTotalUnreadCount(),
    };
  }

  static playSound(sound) {
    playSound(sound, UserSettingsStore.getSoundVolume());
  }

  componentDidUpdate(prevProps, prevState) {
    const me = UserStore.getConnectedUser();
    if (
      prevState.unreadCount < this.state.unreadCount &&
      me.status !== USER_STATUS.DND &&
      me.status !== USER_STATUS.AWAY &&
      UserSettingsStore.hasSoundNotifications()
    ) {
      SoundPlayer.playSound("notification");
    }
    this.setAppBadge();
  }

  render() {
    return null;
  }

  setAppBadge() {
    if ("setAppBadge" in navigator) {
      if (this.state.unreadCount > 0) {
        navigator.setAppBadge(this.state.unreadCount);
      } else {
        navigator.clearAppBadge();
      }
    }
  }
}

const container = Container.create(SoundPlayer);
export default container;

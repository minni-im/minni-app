import React from "react";
import { Container } from "flux/utils";

import { playSound } from "../../utils/SoundUtils";

import UnreadMessageStore from "../../stores/UnreadMessageStore";

class SoundPlayer extends React.Component {
  static getStores() {
    return [ UnreadMessageStore ];
  }

  static calculateState() {
    return {
      unreadCount: UnreadMessageStore.getTotalUnreadCount()
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.unreadCount < this.state.unreadCount) {
      this.playSound("notification");
    }
  }

  playSound(sound) {
    playSound(sound, 0.4);
  }

  render() {
    return null;
  }
}

const container = Container.create(SoundPlayer);
export default container;

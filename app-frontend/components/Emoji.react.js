import React, { PropTypes } from "react";
import { Container } from "flux/utils";
import {
  ALL as EMOJIS,
  MASK_BY_PROVIDER,
  SKIN_TONE_INDEX
} from "emojify";

import UserSettingsStore from "../stores/UserSettingsStore";

import Emoji from "./generic/Emoji.react";

class EmojiContainer extends React.Component {
  static propTypes = {
    shortname: PropTypes.string.isRequired,
    skinTone: PropTypes.oneOf(["1-2", "3", "4", "5", "6"])
  }

  static getStores() {
    return [UserSettingsStore];
  }

  static calculateState() {
    return {
      provider: UserSettingsStore.getEmojiProviderInfo()
    };
  }

  render() {
    const { shortname, skinTone } = this.props;
    const emoji = EMOJIS[shortname];
    const { provider } = this.state;
    let name = shortname;
    let src;
    let unicode;
    if (emoji && MASK_BY_PROVIDER[provider.name] & emoji.mask) {
      if (skinTone) {
        unicode = emoji.skin_variations[SKIN_TONE_INDEX[skinTone]];
        src = `/images/emoji/${provider.name}/${unicode}.${provider.type}`;
      } else {
        unicode = emoji.unicode[0];
        src = `/images/emoji/${provider.name}/${unicode}.${provider.type}`;
      }
    }
    return (
      <Emoji
        name={name}
        unicode={unicode}
        skinTone={skinTone}
        src={src}
      />
    );
  }
}

const container = Container.create(EmojiContainer);
export default container;

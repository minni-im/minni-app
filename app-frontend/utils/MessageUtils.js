import Long from "long";

import { PLUGIN_TYPES } from "../Constants";

import PluginsStore from "../stores/PluginsStore";
import UserStore from "../stores/UserStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

function createNonce() {
  return Long.fromNumber(new Date().getTime())
    .multiply(1000.0)
    .subtract(1420070400000)
    .shiftLeft(22);
}

export function createMessage(roomId, content) {
  const composerPlugins = PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_TEXT);
  const preProcessors = composerPlugins.map(plugin => plugin.encodeMessage);

  const message = {
    id: createNonce().toString(),
    roomId,
    content,
    type: "chat",
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };

  return preProcessors.reduce((onGoing, processor) =>
    onGoing.then(processor), Promise.resolve(message));
}

export function createSystemMessage(roomId, content, subType) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    type: "system",
    subType,
    accountId: SelectedAccountStore.getAccount().id,
    userId: UserStore.getConnectedUser().id
  };
}

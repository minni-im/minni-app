import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

import ConnectionStore from "./ConnectionStore";
import SelectedAccountStore from "./SelectedAccountStore";

function handleLoadInvites(state, { invites }) {
  return state.withMutations((map) => {
    invites.forEach((invite) => {
      map.set(invite.token, invite);
    });
  });
}

function handleInviteReceived(state, { invite }) {
  return state.set(invite.token, invite);
}

class InviteStore extends MapStore {
  initialize() {
    this.waitFor(ConnectionStore, SelectedAccountStore);
    this.addAction(ActionTypes.LOAD_INVITATIONS_SUCCESS, handleLoadInvites);
    this.addAction(ActionTypes.INVITATION_CREATE_SUCCESS, handleInviteReceived);
  }

  getList(accountId) {
    return this.getState().filter(invite => invite.accountId === accountId);
  }
}

export default new InviteStore(Dispatcher);

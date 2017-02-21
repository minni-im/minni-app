import moment from "moment";
import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

import Invitation from "../models/Invitation";

import ConnectionStore from "./ConnectionStore";
import SelectedAccountStore from "./SelectedAccountStore";
import UserStore from "./UserStore";

function createInvitationRecord(invitation) {
  return new Invitation({
    ...invitation,
    inviter: UserStore.getUser(invitation.inviterId),
    dateCreated: moment(invitation.dateCreated)
  });
}

function handleLoadInvites(state, { invites }) {
  return state.withMutations((map) => {
    invites.forEach((invitation) => {
      map.set(invitation.token, createInvitationRecord(invitation));
    });
  });
}

function handleInviteReceived(state, { invite }) {
  return state.set(invite.token, createInvitationRecord(invite));
}

function handleInvitationDelete(state, { inviteToken }) {
  return state.delete(inviteToken);
}

class InviteStore extends MapStore {
  initialize() {
    this.waitFor(ConnectionStore, SelectedAccountStore);
    this.addAction(ActionTypes.LOAD_INVITATIONS_SUCCESS, handleLoadInvites);
    this.addAction(ActionTypes.INVITATION_CREATE_SUCCESS, handleInviteReceived);
    this.addAction(ActionTypes.INVITATION_DELETE, handleInvitationDelete);
  }

  getList(accountId) {
    const { id: userId } = UserStore.getConnectedUser();
    return this
      .getState()
      .filter((invite) => {
        if (invite.accountId !== accountId) {
          return false;
        }
        if (!invite.isExpired) {
          return true;
        }
        if (invite.inviterId === userId) {
          return true;
        }
        return false;
      })
      .sortBy(invite => invite.isExpired ? "z" : "a");
  }
}

export default new InviteStore(Dispatcher);

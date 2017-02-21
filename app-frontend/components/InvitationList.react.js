import React from "react";

import { createInvite } from "../actions/InvitationActionCreators";
import SelectedAccountStore from "../stores/SelectedAccountStore";

import Invitation, { InvitationHeader } from "./Invitation.react";

export default class InvitationList extends React.Component {
  onGenerateClick() {
    const { id: accountId } = SelectedAccountStore.getAccount();
    createInvite(accountId);
  }

  renderList() {
    const inviteList = this.props.invitations
      .map((invitation) => {
        const props = {
          token: invitation.token,
          dateCreated: invitation.dateCreated,
          inviter: invitation.inviter,
          expired: invitation.isExpired,
          expirationDate: invitation.getExpiresAt(),
          usage: invitation.usage,
          maxUsage: invitation.maxUsage
        };
        return <Invitation key={invitation.token} {...props} />;
      })
      .toArray();

    return (
      <div className="flex-vertical">
        <InvitationHeader />
        <div className="flex-spacer">
          {inviteList}
        </div>
      </div>
    );
  }

  renderEmpty() {
    return <div>No invitation links</div>;
  }

  render() {
    return (
      <div className="invitation-list">
        {this.props.invitations.isEmpty() ? this.renderEmpty() : this.renderList()}
        <div className="invitation-list--create">
          <button className="button-highlight" onClick={() => this.onGenerateClick()}>
            Create invitation link
          </button>
        </div>
      </div>
    );
  }
}

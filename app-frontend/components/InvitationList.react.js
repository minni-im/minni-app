import React from "react";
import classNames from "classnames";

import SelectedAccountStore from "../stores/SelectedAccountStore";

import { createInvite } from "../actions/InvitationActionCreators";

import Avatar from "./generic/Avatar.react";
import Countdown from "./generic/Countdown.react";

export default class InvitationList extends React.Component {
  onGenerateClick() {
    const { id: accountId } = SelectedAccountStore.getAccount();
    createInvite(accountId);
  }

  renderList() {
    const inviteList = this.props.invitations.map(invite => (
      <div
        key={invite.token}
        className={classNames("flex-horizontal invite", {
          "invite-expired": invite.isExpired
        })}
      >
        <div className="flex-spacer invite--token">
          <div className="user-select" title={`Created on ${invite.dateCreated.format()}`}>
            {invite.isExpired ? <strike>{invite.token}</strike> : invite.token}
          </div>
          <div className="invite--inviter flex-horizontal">
            <Avatar className="user-avatar" size={Avatar.SIZE.SMALL} user={invite.inviter} />
            <div className="flex-spacer">{`${invite.inviter.fullname} (${invite.inviter.nickname})`}</div>
          </div>
        </div>
        <div className="invite--usage">
          {invite.usage}
          {invite.maxUsage ? `/${invite.maxUsage}` : ""}
        </div>
        <div className="invite--expires"><Countdown expiration={invite.getExpiresAt()} /></div>
        <div className="invite--revoke">
          {invite.isExpired ?
            <button className="button-small">Delete</button> :
            <button className="button-danger button-small">Revoke</button>}
        </div>
      </div>
    )).toArray();

    return (
      <div className="flex-vertical">
        <div className="header flex-horizontal">
          <h3 className="flex-spacer invite--token">Code</h3>
          <h3 className="invite--usage">Uses</h3>
          <h3 className="invite--expires">Expires</h3>
          <h3 className="invite--revoke">&nbsp;</h3>
        </div>
        <div className="flex-spacer">
          {inviteList}
        </div>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div>No invitation links</div>
    );
  }

  render() {
    return (
      <div className="invitation-list">
        {this.props.invitations.isEmpty() ?
          this.renderEmpty() :
          this.renderList()}
        <div className="invitation-list--create">
          <button
            className="button-highlight"
            onClick={() => this.onGenerateClick()}
          >
            Create invitation link
          </button>
        </div>
      </div>
    );
  }
}

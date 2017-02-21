import React from "react";
import classNames from "classnames";

import { deleteInvite } from "../actions/InvitationActionCreators";

import Avatar from "./generic/Avatar.react";
import Countdown from "./generic/Countdown.react";

import UserStore from "../stores/UserStore";

export function InvitationHeader() {
  return (
    <div className="header flex-horizontal">
      <h3 className="flex-spacer invite--token">Code</h3>
      <h3 className="invite--usage">Uses</h3>
      <h3 className="invite--expires">Expires</h3>
      <h3 className="invite--revoke">&nbsp;</h3>
    </div>
  );
}

export default function Invitation(props) {
  const currentUser = UserStore.getConnectedUser();
  const { inviter, expired, token, dateCreated, usage, maxUsage, expirationDate } = props;
  return (
    <div
      className={classNames("flex-horizontal invite", {
        "invite-other": inviter.id !== currentUser.id,
        "invite-expired": expired
      })}
    >
      <div className="flex-spacer invite--token">
        <div className="user-select" title={`Created on ${dateCreated.format()}`}>
          {expired ? <strike>{token}</strike> : token}
        </div>
        <div className="invite--inviter flex-horizontal">
          <Avatar className="user-avatar" size={Avatar.SIZE.SMALL} user={inviter} />
          <div className="flex-spacer">{`${inviter.fullname} (${inviter.nickname})`}</div>
        </div>
      </div>
      <div className="invite--usage">
        {usage}
        {maxUsage ? `/${maxUsage}` : ""}
      </div>
      <div className="invite--expires"><Countdown expiration={expirationDate} /></div>
      <div className="invite--revoke">
        {inviter.id === currentUser.id &&
          (expired
            ? <button
              className="button-small"
              onClick={() => deleteInvite(props.token)}
              title="Delete this expired invitation token"
            >
                Delete
              </button>
            : <button
              className="button-danger button-small"
              onClick={() => deleteInvite(props.token)}
              title="Revoke this invitation token"
            >
                Revoke
              </button>)}
      </div>
    </div>
  );
}

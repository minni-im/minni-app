import React from "react";

import * as InvitationActionCreators from "../actions/InvitationActionCreators";

export default class AccountJoin extends React.Component {
  static propTypes = {
    onBack: React.PropTypes.func.isRequired,
    onJoin: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onJoinClick = this.onJoinClick.bind(this);
  }

  state = {
    valid: true,
    errorMessage: ""
  }

  onJoinClick() {
    const link = this.inviteLink.value.trim();
    const inviteId = link.split("/").pop();
    if (link.length > 0) {
      InvitationActionCreators.validateInvite(inviteId)
        .then(({ ok, message }) => {
          if (!ok) {
            throw message;
          }
          return inviteId;
        })
        .then(InviteActionCreators.acceptInvite)
        .then(({ ok, invite, message }) => {
          if (!ok) {
            throw message;
          }
          this.onJoin(invite);
        })
        .catch(message => this.showErrorMessage(message));
    }
  }

  showErrorMessage(message) {
    this.setState({
      valid: false,
      errorMessage: message
    }, () => {
      this.inviteLink.focus();
    });
  }

  render() {
    return (
      <div className="join-choice flex-vertical">
        <div className="join">
          <h3>Get ready to join a team</h3>
          <form>
            <p>Just paste in the input below an invite link to join an existing Team.</p>
            <p className="block">
              <label htmlFor="inviteLink">
                <input
                  autoFocus
                  ref={(link) => { this.inviteLink = link; }}
                  type="text"
                  placeholder="Enter an invite link"
                />
              </label>
            </p>
            <p className="info">
              Invite links are usually like these:<br />
              http://minni.im/invites/YjU4Y2I0<br />
              YjU4Y2I0
            </p>
          </form>
        </div>
        <div className="actions flex-horizontal">
          <button onClick={this.props.onBack}>Back</button>
          <span className="flex-spacer" />
          <button
            onClick={this.onJoinClick}
            className="button-highlight"
          >Join</button>
        </div>
      </div>
    );
  }
}

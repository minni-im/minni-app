import React from "react";

import * as InvitationActionCreators from "../actions/InvitationActionCreators";

export default class AccountJoin extends React.Component {
  static propTypes = {
    onBack: React.PropTypes.func.isRequired,
    onJoin: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onJoinClick = this.onJoinClick.bind(this);
    this.onTokenBlur = this.onTokenBlur.bind(this);
    this.showErrorMessage = this.showErrorMessage.bind(this);
  }

  state = {
    valid: true,
    errorMessage: ""
  };

  onTokenBlur() {
    this.setState({
      valid: true
    });
  }

  onJoinClick() {
    const link = this.inviteLink.value.trim();
    const inviteToken = link.split("/").pop();
    if (link.length > 0) {
      InvitationActionCreators.validateInvite(inviteToken)
        .then(({ ok, message }) => {
          if (!ok) {
            throw new Error(message);
          }
          return inviteToken;
        })
        .then(InvitationActionCreators.acceptInvite)
        .then(({ ok, invite, account, message }) => {
          if (!ok) {
            throw new Error(message);
          }
          this.props.onJoin(account, invite);
        })
        .catch(this.showErrorMessage);
    }
  }

  showErrorMessage(error) {
    this.setState(
      {
        valid: false,
        errorMessage: error.message
      },
      () => {
        this.inviteLink.focus();
      }
    );
  }

  render() {
    return (
      <div className="join-choice flex-vertical">
        <div className="join">
          <h3>Get ready to join a team</h3>
          <div className="alerts">
            {this.state.valid
              ? <p>Just paste in the input below an invite link to join an existing Team.</p>
              : <p className="alert alert-error">{this.state.errorMessage}</p>}
          </div>
          <form>
            <p className="block">
              <label htmlFor="inviteLink">
                <input
                  autoFocus
                  ref={(link) => {
                    this.inviteLink = link;
                  }}
                  type="text"
                  placeholder="Enter an invite link"
                  onBlur={this.onTokenBlur}
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
          <button onClick={this.onJoinClick} className="button-highlight">Join</button>
        </div>
      </div>
    );
  }
}

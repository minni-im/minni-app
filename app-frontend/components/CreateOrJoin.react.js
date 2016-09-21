import React from "react";
import TransitionGroup from "react-addons-css-transition-group";

import AccountCreate from "./AccountCreate.react";
import { GroupAddIcon, GroupIcon } from "../utils/IconsUtils";

function CreateOrJoin(props) {
  return (
    <div className="create-or-join-choice flex-horizontal">
      <div className="create">
        <h3>Create</h3>
        <GroupIcon />
        <p>Create a new team &amp; invite your teammates to join.</p>
        <button
          className="button-primary"
          onClick={props.onCreate}
        >Create a Team</button>
      </div>
      <div className="separator" data-text="or" />
      <div className="join">
        <h3>Join</h3>
        <GroupAddIcon />
        <p>Enter an invite link &amp; join an existing to team setup.</p>
        <button
          className="button-highlight"
          onClick={props.onJoin}
        >Join a Team</button>
      </div>
    </div>
  );
}
CreateOrJoin.propTypes = {
  onCreate: React.PropTypes.func,
  onJoin: React.PropTypes.func
};

function Join(props) {
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
                id="inviteLink"
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
        <button onClick={props.onBack}>Back</button>
        <span className="flex-spacer" />
        <button className="button-highlight">Join</button>
      </div>
    </div>
  );
}
Join.propTypes = {
  onBack: React.PropTypes.func.isRequired
};

export default class CreateOrJoinContainer extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onJoinClick = this.onJoinClick.bind(this);
  }

  state = {
    step: 0
  }

  onCreateClick(account) {
    this.context.router.push(`/chat/${account.name}/lobby`);
  }

  onJoinClick() {

  }

  render() {
    let element;

    switch (this.state.step) {
      case 1:
        element = (
          <AccountCreate
            key="create"
            onBack={() => this.setState({ step: 0 })}
            onCreate={this.onCreateClick}
          />
        );
        break;
      case 2:
        element = (
          <Join
            key="join"
            onBack={() => this.setState({ step: 0 })}
            onJoin={this.onJoinClick}
          />
        );
        break;
      default:
        element = (
          <CreateOrJoin
            key="createorjoin"
            onCreate={() => this.setState({ step: 1 })}
            onJoin={() => this.setState({ step: 2 })}
          />
        );
    }
    return (
      <TransitionGroup
        className="create-or-join"
        transitionName="slide"
        component="div"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {element}
      </TransitionGroup>
    );
  }
}

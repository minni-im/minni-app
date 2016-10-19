import React from "react";
import TransitionGroup from "react-addons-css-transition-group";

import AccountCreate from "./AccountCreate.react";
import AccountJoin from "./AccountJoin.react";
import { GroupAddIcon, GroupIcon } from "../utils/IconsUtils";

function CreateOrJoin(props) {
  return (
    <div className="create-or-join-choice flex-horizontal">
      <div className="create">
        <h3>Create</h3>
        <GroupIcon />
        <p>Create a new team &amp; invite teammates to join.</p>
        <button
          className="button-primary"
          onClick={props.onCreate}
        >Create a Team</button>
      </div>
      <div className="separator" data-text="or" />
      <div className="join">
        <h3>Join</h3>
        <GroupAddIcon />
        <p>Enter an invitation link &amp; join an existing team.</p>
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
    this.context.router.transitionTo(`/chat/${account.name}/lobby`);
  }

  onJoinClick() {
    // Full reload here, as we want to fetch proper fresh info
    document.location = "/";
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
          <AccountJoin
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

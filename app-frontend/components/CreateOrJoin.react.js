import React from "react";
import TransitionGroup from "react-addons-css-transition-group";

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
          onClick={props.onCreateClick}
        >Create a Team</button>
      </div>
      <div className="separator" />
      <div className="join">
        <h3>Join</h3>
        <GroupAddIcon />
        <p>Enter an invite link &amp; join an existing to team setup.</p>
        <button
          className="button-highlight"
          onClick={props.onJoinClick}
        >Join a Team</button>
      </div>
    </div>
  );
}
CreateOrJoin.propTypes = {
  onCreateClick: React.PropTypes.func,
  onJoinClick: React.PropTypes.func
};

function Create(props) {
  return (
    <div className="create-choice flex-vertical">
      <div className="create">
        <h3>Create your team</h3>
        <p>Give us some information about your environment</p>
        <form>
          <p className="block">
            <label htmlFor="name">
              <input
                autoFocus
                id="name"
                placeholder="Give your team a name"
                // onBlur={this.onNameBlur}
              />
              <span className="info">
                Valid characters are only letters from a-z, numbers from 0-9 and -.
                Any spaces will be kept visually but transformed to an - internally.
              </span>
            </label>
          </p>

          <p className="block">
            <label htmlFor="desc">
              <input
                id="desc"
                placeholder="Describe your team, what do you do ? Just a few words"
              />
            </label>
          </p>
        </form>
      </div>
      <div className="actions flex-horizontal">
        <button onClick={props.onBackClick}>Back</button>
        <span className="flex-spacer" />
        <button className="button-primary">Create</button>
      </div>
    </div>
  );
}
Create.propTypes = {
  onBackClick: React.PropTypes.func.isRequired
};


function Join(props) {
  return (
    <div className="join-choice flex-vertical">
      <div className="join">
        <h3>Get ready &amp; join a team</h3>
        <form>
          <p>Simply enter an invite link below to join an existing Team.</p>
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
        </form>
      </div>
      <div className="actions flex-horizontal">
        <button onClick={props.onBackClick}>Back</button>
        <span className="flex-spacer" />
        <button className="button-highlight">Join</button>
      </div>
    </div>
  );
}
Join.propTypes = {
  onBackClick: React.PropTypes.func.isRequired
};

export default class CreateOrJoinContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onJoinClick = this.onJoinClick.bind(this);
  }
  state = {
    step: 0
  }

  onCreateClick() {
    this.setState({ step: 1 });
  }

  onJoinClick() {
    this.setState({ step: 2 });
  }

  render() {
    let element;

    switch (this.state.step) {
      case 1:
        element = (
          <Create
            key="create"
            onBackClick={() => this.setState({ step: 0 })}
          />
        );
        break;
      case 2:
        element = (
          <Join
            key="join"
            onBackClick={() => this.setState({ step: 0 })}
          />
        );
        break;
      default:
        element = (
          <CreateOrJoin
            key="createorjoin"
            onCreateClick={this.onCreateClick}
            onJoinClick={this.onJoinClick}
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

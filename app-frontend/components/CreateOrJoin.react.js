import React from "react";
import TransitionGroup from "react-addons-css-transition-group";

import AccountCreate from "./AccountCreate.react";

function CreateOrJoin(props) {
  return (
    <div className="create-or-join flex-horizontal">
      <div className="create">
        <h3>Create</h3>
        <img src="/images/svgs/group-of-people.svg" />
        <p>Create a new team &amp; invite your teammates to join.</p>
        <button
          className="button-primary"
          onClick={props.onCreateClick}
        >Create a Team</button>
      </div>
      <div className="separator" />
      <div className="join">
        <h3>Join</h3>
        <img src="/images/svgs/group-of-people-add.svg" />
        <p>Enter an invite link &amp; join an existing to team setup.</p>
        <button
          className="button-primary"
          onClick={props.onJoinClick}
        >Join a Team</button>
      </div>
    </div>
  );
}

function Create(props) {
  return (
    <div className="create-or-join flex-vertical">
      <div className="create">
        <h3>Create a new team</h3>
        <form>
        <p className="block">
          <label>
            <span>Name</span>
            <input
              autoFocus
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
          <label>
            <span>Description</span>
            <input
              placeholder="Describe your team, what do you do ? Just a few words"
            />
          </label>
        </p>

        </form>

        <div className="actions">
          <button onClick={props.onBackClick}>Back</button>
          &nbsp;
          <button className="button-primary">Create</button>
        </div>
      </div>
    </div>
  );
}
Create.propTypes = {
  onBackClick: React.PropTypes.func.isRequired
};


function Join(props) {
  return (
    <div className="create-or-join flex-vertical">
      <div className="join">
        <h3>Get ready &amp; join a team</h3>
        <form>
          <p>Simply enter an invite link below to join an existing Team.</p>
          <input type="text" placeholder="Enter an invite link" />
        </form>
        <div className="actions">
          <button onClick={props.onBackClick}>Back</button>
          &nbsp;
          <button className="button-primary">Join</button>
        </div>
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
        element = <Create onBackClick={() => this.setState({ step: 0 })} />;
        break;
      case 2:
        element = <Join onBackClick={() => this.setState({ step: 0 })} />;
        break;
      default:
        element = (
          <CreateOrJoin
            onCreateClick={this.onCreateClick}
            onJoinClick={this.onJoinClick}
          />
        );
    }
    return (
      <TransitionGroup
        transitionName="slide"
        component="div"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        {element}
      </TransitionGroup>
    );
  }
}

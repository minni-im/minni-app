import React from "react";

import RoomAccessControl from "./RoomAccessControl.react";

import SelectedAccountStore from "../stores/SelectedAccountStore";

import * as AccountActionCreators from "../actions/AccountActionCreators";


class RoomCreate extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onRoomTypeChanged = this.onRoomTypeChanged.bind(this);
    this.onUsersChanged = this.onUsersChanged.bind(this);
  }

  state = {
    type: 1,
    usersId: []
  }

  onCreateClick(event) {
    event.preventDefault();
    const account = SelectedAccountStore.getAccount();
    if (this.name.value.length === 0) {
      this.setState({
        message: "You must specify a name"
      });
      this.name.focus();
      return;
    }
    AccountActionCreators.createRoom(
      account,
      this.name.value,
      this.topic.value,
      this.state.type,
      this.state.usersId
    ).then(
      ({ ok, errors }) => {
        if (ok) {
          this.context.router.transitionTo({ pathname: `/chat/${account.slug}/lobby` });
          return;
        }
        if (errors) {
          this.setState({ message: errors });
        }
        this.name.focus();
      });
  }

  onRoomTypeChanged(type) {
    this.setState({ type });
  }

  onUsersChanged(usersId) {
    this.setState({ usersId });
  }

  render() {
    let errors;
    if (this.state.message) {
      errors = (
        <div className="alerts">
          <div className="alert alert-error">{this.state.message}</div>
        </div>
      );
    }

    return (
      <main className="flex-spacer">
        <section className="room-create flex-spacer">
          <header>
            <div className="header-info">
              <h2>Create a new room</h2>
              <h3>Let's invite people!</h3>
            </div>
          </header>
          <section className="panel panel--contrast panel--wrapper">
            <form>
              {errors}
              <p className="block">
                <label>
                  <span>Name</span>
                  <input
                    ref={(input) => { this.name = input; }}
                    autoFocus
                    placeholder="Give a name to your room"
                  />
                </label>
              </p>

              <p className="block">
                <label>
                  <span>Topic</span>
                  <input
                    ref={(input) => { this.topic = input; }}
                    placeholder="Describe your room, what should it be used for ?"
                  />
                </label>
              </p>

              <h3>Access Control</h3>

              <RoomAccessControl
                type={this.state.type}
                onTypeChange={this.onRoomTypeChanged}
                onUsersChange={this.onUsersChanged}
              />

              <p className="actions">
                <button className="button-primary" onClick={this.onCreateClick}>Create</button>
              </p>
            </form>
          </section>
        </section>
      </main>
    );
  }
}

RoomCreate.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default RoomCreate;

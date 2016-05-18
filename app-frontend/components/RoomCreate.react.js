import React from "react";
import { browserHistory } from "react-router";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import UserStore from "../stores/UserStore";

import AccountActionCreators from "../actions/AccountActionCreators";


class RoomCreate extends React.Component {
  constructor(props) {
    super(props);

    this.onCreateClick = this.onCreateClick.bind(this);
    this.onRoomTypeChanged = this.onRoomTypeChanged.bind(this);
  }

  state = {
    type: 1,
    usersId: []
  }

  onCreateClick() {
    const account = SelectedAccountStore.getAccount();
    const { name, topic } = this.refs;
    if (name.value.length === 0) {
      this.setState({
        message: "You must specify a name"
      });
      this.refs.name.focus();
      return;
    }
    AccountActionCreators.createRoom(
      account,
      name.value,
      topic.value,
      this.state.type,
      this.state.usersId
    ).then(
      ({ ok, errors }) => {
        if (ok) {
          browserHistory.push({ pathname: `/chat/${account.slug}/lobby` });
          return;
        }
        this.setState({
          message: errors
        });
        this.refs.name.focus();
      });
  }

  onRoomTypeChanged(event) {
    const type = parseInt(event.target.value, 10);
    if (type !== this.state.type) {
      this.setState({ type });
    }
  }

  render() {
    const account = SelectedAccountStore.getAccount();
    let errors;
    if (this.state.message) {
      errors = (
        <div className="alerts">
          <div className="alert alert-error">{this.state.message}</div>
        </div>
      );
    }

    return (
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
                  ref="name"
                  autoFocus
                  placeholder="Give a name to your room"
                />
              </label>
            </p>

            <p className="block">
              <label>
                <span>Topic</span>
                <input
                  ref="topic"
                  placeholder="Describe your room, what should it be used for ?"
                />
              </label>
            </p>

            <h3>Access Control</h3>

            <div className="inline-block">
              <label>
                <input
                  type="radio"
                  value={1}
                  defaultChecked
                  name="type"
                  onChange={this.onRoomTypeChanged}
                />
                <span>Public room</span>
              </label>
              <span className="info">Anyone in the team can access this room.</span>
            </div>

            <div className="inline-block">
              <label>
                <input
                  type="radio"
                  value={2}
                  name="type"
                  onChange={this.onRoomTypeChanged}
                />
                <span>Private room</span>
              </label>
              <span className="info">Only selected team members will see the room
              in their lobby.</span>
            </div>

            {
              this.state.type === 2 ?
              (
                <div className="coworkers-picker">
                  {account.usersId
                    .filter(userId => userId !== UserStore.getConnectedUser().id)
                    .map(userId => <div key={userId} className="coworker">{userId}</div>)}
                </div>
              ) :
              false
            }

            <p className="actions">
              <button className="button-primary" onClick={this.onCreateClick}>Create</button>
            </p>
          </form>
        </section>
      </section>
    );
  }
}

export default RoomCreate;

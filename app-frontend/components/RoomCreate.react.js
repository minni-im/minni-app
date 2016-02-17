import React from "react";

import browserHistory from "react-router";
import { dispatch } from "../Dispatcher";

class RoomCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      usersId: []
    };
  }

  render() {
    let errors;
    if (this.state.message) {
      errors = <div className="alerts">
        <div className="alert alert-error">{this.state.message}</div>
      </div>;
    }

    return <section className="room-create flex-spacer">
      <header>
        <div className="header-info">
          <h2>Create a new room</h2>
          <h3>Let's invite people!</h3>
        </div>
      </header>
      <section className="panel panel--contrast panel--wrapper">
        <form onSubmit={this._onHandleSubmit.bind(this)}>
          {errors}
          <p className="block">
            <label>
              <span>Name</span>
              <input ref="name" placeholder="Give a name to your room" />
            </label>
          </p>

          <p className="block">
            <label>
              <span>Topic</span>
              <input ref="topic" placeholder="Describe your room, what should it be used for ?"/>
            </label>
          </p>

          <h3>Access Control</h3>

          <div className="inline-block">
            <label>
              <input type="radio" value={1} defaultChecked name="type" onChange={this._onRoomTypeChanged.bind(this)}/>
              <span>Public room</span>
            </label>
            <span className="info">Anyone in the team can access this room.</span>
          </div>

          <div className="inline-block">
            <label>
              <input type="radio" value={2} name="type" onChange={this._onRoomTypeChanged.bind(this)}/>
              <span>Private room</span>
            </label>
            <span className="info">Only selected team members will see the room in their lobby.</span>
          </div>

          {this.state.type === 2 ? <div className="coworkers-picker">
            {this.props.currentAccount.usersId.map(userId => {
              return <div className="coworker">{userId}</div>;
            })}
          </div> : false}

          <p>
            <button className="button-primary">Create</button>
          </p>

        </form>
      </section>
    </section>;
  }

  _onHandleSubmit(event) {
    event.preventDefault();
    const { name, topic } = this.refs;
    if (name.value.length === 0) {
      return;
    }
    fetch(`/api/accounts/${this.props.currentAccount.id}/rooms/`, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.value,
        topic: topic.value,
        type: this.state.type
      })
    }).then(response => {
      return response.json();
    }).then(payload => {
      if (payload.ok) {
        const room = payload.room;
        dispatch({
          type: "room/add",
          room
        });
        browserHistory.push(`/chat/${this.props.currentAccount.name}/lobby`);
      } else {
        this.setState({
          message: payload.message
        });
      }
    });
  }

  _onRoomTypeChanged(event) {
    const type = parseInt(event.target.value, 10);
    if (type !== this.state.type) {
      this.setState({
        "type": type
      });
    }
  }
}

export default RoomCreate;

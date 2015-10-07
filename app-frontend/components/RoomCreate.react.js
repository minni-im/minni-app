import React from "react";


class RoomCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      valid: true
    };
  }

  render() {
    let errors;
    if (!this.state.valid) {
      errors = <div className="alerts">
        <div className="alert alert-error">{this.state.message}</div>
      </div>;
    }

    return <section className="room-create">
      <header>
        <div className="header-info">
          <h2>Create a new room</h2>
          <h3>Let's invite people!</h3>
        </div>
      </header>
      <section className="panel panel--contrast">
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

          <p className="inline-block">
            <label>
              <input type="radio" value={1} defaultChecked name="type" onChange={this._onRoomTypeChanged.bind(this)}/>
              <span>Public room</span>
            </label>
            <span className="info">Anyone in the team can access this room.</span>
          </p>

          <p className="inline-block">
            <label>
              <input type="radio" value={2} name="type" onChange={this._onRoomTypeChanged.bind(this)}/>
              <span>Private room</span>
            </label>
            <span className="info">Only selected team members will see the room in their lobby.</span>
          </p>

          {this.state.type == 2 ? <div className="coworkers-picker">
            {this.props.currentAccount.usersId.map(userId => {
              return <div className="coworker">{userId}</div>;
            })}
          </div> : false}

          <div>
            <button disabled={!this.state.valid}>Create</button>
          </div>

        </form>
      </section>
    </section>;
  }

  _onHandleSubmit(event) {
    event.preventDefault();
    const name = this.refs.name.value, topic = this.refs.topic.value;
    if (name.length === 0) {
      this.setState({ valid: false, message: "You must provide a name" });
      return;
    }

  }

  _onRoomTypeChanged(event) {
    const type = event.target.value;
    if (type !== this.state.type) {
      this.setState({
        "type": type
      });
    }
  }
}

export default RoomCreate;

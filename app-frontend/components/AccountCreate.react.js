import React from "react";

export default class AccountCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      message: false
    };
  }

  render() {
    let errors = false;
    if (!this.state.valid) {
      errors = <div className="alerts">
        <div className="alert-error">{this.state.message}</div>
      </div>;
    }

    return <section className="panel panel--contrast">
      <div>
        <form onSubmit={this._onHandleSubmit.bind(this)}>
          <h3>Please name and describe your {Minni.name} team.</h3>
          {errors}
          <p className="block">
            <label>
              <span>Name</span>
              <input ref="name" placeholder="Give your team a name"
                onBlur={this._onNameBlur.bind(this)} />
              <span className="info">Valid characters are only letters from a-z, numbers from 0-9 and -. Any spaces will be kept visually but transformed to an - internally.</span>
            </label>
          </p>

          <p className="block">
            <label>
              <span>Description</span>
              <input ref="description" placeholder="Describe your team, what do you do ? Just a few words"/>
            </label>
          </p>

          <div>
            <button disabled={!this.state.valid}>Create</button>
          </div>

        </form>
      </div>

    </section>;
  }

  _onNameBlur() {
    this.refs.name.classList.remove("error");
    fetch(`/api/accounts/check_existence?name=${this.refs.name.value}`, {
      credentials: "include"
    })
    .then(response => {
      return response.json();
    })
    .then(status => {
      if (!status.ok) {
        this.setState({
          valid: false,
          message: status.message
        }, () => {
          this.refs.name.classList.add("error");
        });
      } else {
        this.setState({
          valid: true,
          message: false
        });
      }
    });
  }

  _onHandleSubmit(event) {
    event.preventDefault();
    console.log(this);
  }
}

AccountCreate.meta = {
  className: "account-create",
  title: `First thing first, create a new ${Minni.name} team`,
  description: "A team is a central place where you and your coworkers can collaborate and get things done."
};

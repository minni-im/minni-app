import React from "react";
import history from "../history";

import { dispatch } from "../dispatchers/Dispatcher";

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
        <div className="alert alert-error">{this.state.message}</div>
      </div>;
    }

    let title = `Create a new ${Minni.name} team`;
    if (this.props.location.state && this.props.location.state.welcome) {
      title = `First thing first, create a new ${Minni.name} team`;
    }

    return <main className="account-create">
      <section>
        <header>
          <div className="header-info">
            <h2>{title}</h2>
            <h3>A team is a central place where you and your coworkers can collaborate and get things done.</h3>
          </div>
        </header>
        <section className="panel panel--contrast">
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
        </section>
      </section>
    </main>;
  }

  _onNameBlur() {
    this.refs.name.classList.remove("error");
    fetch(`/api/accounts/check_existence?name=${this.refs.name.value}`, {
      credentials: "same-origin"
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
    if (this.refs.name.value.length === 0) {
      return;
    }
    fetch("/api/accounts/", {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.refs.name.value,
        description: this.refs.description.value
      })
    })
    .then(response => {
      return response.json();
    })
    .then(status => {
      if (status.ok) {
        dispatch({
          type: "account/new",
          account: status.account
        });
        history.pushState({ welcome: true }, `/dashboard`);
      } else {
        this.setState({
          message: status.message
        });
      }
    });
  }
}

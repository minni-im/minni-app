import React from "react";
import browserHistory from "react-router";

import { dispatch } from "../Dispatcher";
import { request } from "../utils/RequestUtils";

import * as AccountActionCreators from "../actions/AccountActionCreators";

export default class AccountCreate extends React.Component {
  static propTypes = {
    location: React.PropTypes.any
  }

  static context = {
    router: React.PropTypes.any
  }

  constructor(props) {
    super(props);

    this.onNameBlur = this.onNameBlur.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
  }

  state = {
    valid: true,
    message: false
  }

  componentWillUnmount() {
    AccountActionCreators.deselectCurrentAccount();
  }

  onNameBlur() {
    this.name.classList.remove("error");
    request(
      `/api/accounts/check_existence?name=${this.name.value}`
    ).then((status) => {
      if (!status.ok) {
        this.setState({
          valid: false,
          message: status.message
        }, () => {
          this.name.classList.add("error");
        });
        return;
      }
      this.setState({
        valid: true,
        message: false
      });
    });
  }

  onHandleSubmit(event) {
    event.preventDefault();
    if (this.name.value.length === 0) {
      return;
    }
    request("/api/accounts/", {
      method: "PUT",
      body: {
        name: this.name.value,
        description: this.description.value
      }
    }).then((status) => {
      if (status.ok) {
        dispatch({
          type: "account/new",
          account: status.account
        });
        this.context.router.transitionTo({ pathname: "/dashboard", state: { welcome: true } });
        return;
      }
      this.setState({
        message: status.message
      });
    });
  }

  render() {
    let errors = false;
    if (!this.state.valid) {
      errors = (
        <div className="alerts">
          <div className="alert alert-error">{this.state.message}</div>
        </div>
      );
    }

    let title = `Create a new ${Minni.name} team`;
    if (this.props.location.state && this.props.location.state.welcome) {
      title = `First thing first, create a new ${Minni.name} team`;
    }

    return (
      <main className="account-create flex-horizontal flex-spacer">
        <section className="flex-spacer flex-center">
          <header>
            <div className="header-info">
              <h2>{title}</h2>
              <h3>A team is a central place where you and your coworkers can
              collaborate and get things done.</h3>
            </div>
          </header>
          <section className="panel panel--contrast panel--wrapper">
            <div>
              <form onSubmit={this.onHandleSubmit}>
                <h3>Please name and describe your {Minni.name} team.</h3>
                {errors}
                <p className="block">
                  <label>
                    <span>Name</span>
                    <input
                      ref={(input) => { this.name = input; }}
                      autoFocus
                      placeholder="Give your team a name"
                      onBlur={this.onNameBlur}
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
                      ref={(input) => { this.description = input; }}
                      placeholder="Describe your team, what do you do ? Just a few words"
                    />
                  </label>
                </p>

                <div className="actions">
                  <button
                    className="button-primary"
                    disabled={!this.state.valid}
                  >Create</button>
                </div>
              </form>
            </div>
          </section>
        </section>
      </main>
    );
  }
}

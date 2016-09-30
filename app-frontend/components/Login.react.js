import React, { Component } from "react";
import Link from "react-router/Link";
import classNames from "classnames";

import { login } from "../actions/AuthActionCreators";

import AuthContainer from "./AuthContainer.react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    error: false
  }

  onSubmit(event) {
    this.setState({ error: false });
    event.preventDefault();
    login(
      this.username.value,
      this.password.value
    ).then((payload) => {
      if (!payload.ok) {
        const state = {
          error: true,
          message: payload.message,
          fields: false
        };
        if (payload.fields) {
          state.fields = Object.keys(payload.fields).map(key => payload.fields[key]);
        }
        this.setState(state);
        this.username.focus();
      }
    });
  }

  render() {
    return (
      <AuthContainer
        className="login"
        onSubmit={this.onSubmit}
      >
        <h1>Welcome</h1>
        { this.state.error ?
          <div className="alerts">
            <ul className="alert alert-error">
              { this.state.fields ?
                this.state.fields.map((msg, index) => <li key={index}>{msg}</li>) :
                <li>{this.state.message}</li>
              }
            </ul>
          </div> :
          <p>Simply login with your email</p>
        }

        <div className="email">
          <p>
            <input
              className={classNames({
                error: this.state.error
              })}
              autoFocus
              type="text"
              placeholder="Identifier (email)"
              ref={(username) => { this.username = username; }}
            />
          </p>
          <p>
            <input
              type="password"
              placeholder="Password"
              ref={(password) => { this.password = password; }}
            />
          </p>
          <div className="links">
            Forgot your password? <Link to="/login/reset-password">Reset</Link>
          </div>
          <p>
            <button className="button-highlight button-big">Login</button>
          </p>
        </div>
        <div className="links">
          Don't have yet an account? <Link to="/signup">Signup</Link>
        </div>
      </AuthContainer>
    );
  }
}

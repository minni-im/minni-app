import React, { Component } from "react";
import Link from "react-router/Link";

import AuthContainer from "./AuthContainer.react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {

  }

  render() {
    return (
      <AuthContainer className="login" onSubmit={this.onSubmit}>
        <h1>Welcome</h1>
        <p>Signin with your email</p>

        <div className="email">
          <p>
            <input
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
              name={(password) => { this.password = password; }}
            />
          </p>
          <div className="links">
            Forgot your password? <Link to="/login/reset-password">Reset</Link>
          </div>
          <p>
            <button className="button-highlight">Signin</button>
          </p>
        </div>
        <div className="links">
          Don't have yet an account? <Link to="/signup">Signup</Link>
        </div>
      </AuthContainer>
    );
  }
}

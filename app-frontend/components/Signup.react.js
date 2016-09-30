import React, { Component } from "react";
import Link from "react-router/Link";

import AuthContainer from "./AuthContainer.react";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {

  }

  render() {
    return (
      <AuthContainer className="signup" onSubmit={this.onSubmit}>
        <h1>Create an account</h1>
        <p>Signup with your email</p>

        <div className="email">
          <p>
            <input
              autoFocus
              type="text"
              placeholder="Username"
              ref={(username) => { this.username = username; }}
            />
          </p>
          <p>
            <input
              type="text"
              placeholder="Email"
              ref={(email) => { this.email = email; }}
            />
          </p>
          <p>
            <input
              type="password"
              placeholder="Password"
              ref={(password) => { this.password = password; }}
            />
          </p>
          <p>
            <button className="button-highlight button-big">Signup</button>
          </p>
        </div>
        <div className="links">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </AuthContainer>
    );
  }
}

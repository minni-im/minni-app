import React from "react";

import * as AccountActionCreators from "../actions/AccountActionCreators";

export default class AccountCreate extends React.Component {
  static propTypes = {
    onBack: React.PropTypes.func.isRequired,
    onCreate: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onNameBlur = this.onNameBlur.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  state = {
    valid: true,
    errorMessage: ""
  };

  onNameBlur() {
    const name = this.name.value.trim();
    this.setState({
      valid: true
    });
    if (name.length) {
      AccountActionCreators.checkExistence(name).then(({ ok, message }) => {
        if (!ok) {
          this.showErrorMessage(message);
        }
      });
    }
  }

  onCreateClick() {
    const name = this.name.value.trim();
    const description = this.desc.value.trim();
    if (name.length > 0) {
      AccountActionCreators.createAccount({ name, description }).then(({ ok, account, message }) => {
        if (ok) {
          this.props.onCreate(account);
        } else {
          this.showErrorMessage(message);
        }
      });
    }
  }

  showErrorMessage(message) {
    this.setState(
      {
        valid: false,
        errorMessage: message
      },
      () => {
        this.name.focus();
      }
    );
  }

  render() {
    return (
      <div className="create-choice flex-vertical">
        <div className="create">
          <h3>Create your team</h3>
          <div className="alerts">
            {this.state.valid
              ? <p>Give us some input about you and your teammates</p>
              : <p className="alert alert-error">{this.state.errorMessage}</p>}
          </div>
          <form>
            <p className="block">
              <label htmlFor="name">
                <input
                  autoFocus
                  id="name"
                  ref={(name) => {
                    this.name = name;
                  }}
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
              <label htmlFor="desc">
                <input
                  id="desc"
                  ref={(desc) => {
                    this.desc = desc;
                  }}
                  placeholder="Describe your team, what do you do ? Just a few words"
                />
              </label>
            </p>
          </form>
        </div>
        <div className="actions flex-horizontal">
          <button onClick={this.props.onBack}>Back</button>
          <span className="flex-spacer" />
          <button onClick={this.onCreateClick} className="button-primary">Create</button>
        </div>
      </div>
    );
  }
}

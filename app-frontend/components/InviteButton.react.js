import React from "react";

import Dialog from "./generic/Dialog.react";

import { createInvite } from "../actions/InviteActionCreators";

class InviteDialog extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool
  }

  static defaultProps = {
    visible: false
  }

  render() {
    return (
      <Dialog
        {...this.props}
        title="Invite teammates"
        subtitle="Create instant invite links to share with your coworkers"
        additionalClassNames="panel settings-dialog room-settings-dialog"
        onClose={this.props.onClose}
      >
        <h3>yo</h3>
      </Dialog>
    );
  }
}


export default class InviteButton extends React.Component {
  state = {
    visible: false
  }

  toggleDialog() {
    this.setState(({ visible }) => ({
      visible: !visible
    }));
  }

  render() {
    const { visible } = this.state;
    return (
      <span>
        <InviteDialog
          visible={visible}
          onClose={() => this.toggleDialog()}
        />
        <button
          className="button-highlight"
          onClick={() => this.toggleDialog()}
        >{this.props.children}</button>
      </span>
    );
  }
}

import React from "react";
import { Container } from "flux/utils";

import Dialog from "./generic/Dialog.react";

import { getInvitationList, createInvite } from "../actions/InvitationActionCreators";

import ConnectionStore from "../stores/ConnectionStore";
import InvitationStore from "../stores/InvitationStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

class InvitationDialog extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool,
    onClose: React.PropTypes.func
  }

  static defaultProps = {
    visible: false,
    invites: []
  }

  onGenerateClick() {
    const { id: accountId } = SelectedAccountStore.getAccount();
    createInvite(accountId);
  }

  render() {
    const inviteList = this.props.invites.map(invite => (
      <div key={invite.token}>
        <span className="invite--token">{invite.token}</span>
        <span className="invite--maxage">{invite.maxAge}</span>
      </div>
    ));

    const noInvite = (
      <div>
        No invitation link.
        <div>
          <button
            className="button-highlight"
            onClick={() => this.onGenerateClick()}
          >
            Generate an invitation link
          </button>
        </div>
      </div>
    );
    return (
      <Dialog
        buttons={[{
          label: "Close",
          action: "close"
        }]}
        {...this.props}
        title="Invite teammates"
        subtitle="Create invitation links for your coworkers"
        additionalClassNames="panel invite-dialog"
      >
        {this.props.invites.size === 0 ?
          noInvite :
          <div>
            <div><h3>Inivitation Code</h3></div>
            {inviteList}
          </div>
        }
      </Dialog>
    );
  }
}

class InvitationDialogContainer extends React.Component {
  static getStores() {
    return [InvitationStore];
  }

  static calculateState(prevState) {
    const userConnected = ConnectionStore.isConnected();
    let invites = [];
    if (userConnected) {
      const { id: accountId } = SelectedAccountStore.getAccount();
      invites = InvitationStore.getList(accountId).toArray();
    }

    return {
      visible: (prevState && prevState.visible) || false,
      invites
    };
  }

  static propTypes = {
    className: React.PropTypes.string
  }

  state = {
    visible: false
  }

  toggleDialog() {
    if (!this.state.visible) {
      const { id: accountId } = SelectedAccountStore.getAccount();
      getInvitationList(accountId);
    }

    this.setState(({ visible }) => ({
      visible: !visible
    }));
  }

  render() {
    const { visible, invites } = this.state;
    return (
      <span className={this.props.className}>
        <InvitationDialog
          invites={invites}
          visible={visible}
          onClose={() => this.toggleDialog()}
        />
        {React.cloneElement(this.props.children, {
          onClick: () => this.toggleDialog()
        })}
      </span>
    );
  }
}

export default Container.create(InvitationDialogContainer);

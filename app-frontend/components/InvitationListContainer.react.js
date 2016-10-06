import React from "react";
import { Container } from "flux/utils";

import { getInvitationList } from "../actions/InvitationActionCreators";

import InvitationList from "./InvitationList.react";

import InvitationStore from "../stores/InvitationStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

class InvitationListContainer extends React.Component {
  static getStores() {
    return [InvitationStore];
  }

  static calculateState() {
    const { id: accountId } = SelectedAccountStore.getAccount();
    return {
      invites: InvitationStore.getList(accountId)
    };
  }

  componentWillMount() {
    const { id: accountId } = SelectedAccountStore.getAccount();
    getInvitationList(accountId);
  }

  render() {
    return (
      <InvitationList invites={this.state.invites} />
    );
  }
}


export default Container.create(InvitationListContainer);

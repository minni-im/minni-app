import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

class AccountName extends React.Component {
  static getStores() {
    return [SelectedAccountStore, AccountStore];
  }

  static calculateState() {
    return {
      account: SelectedAccountStore.getAccount()
    };
  }

  static propTypes = {
    className: React.PropTypes.string
  }

  render() {
    return (
      <h2 className={this.props.className}>
        { this.state.account ?
          this.state.account.displayName :
          "..."
        }
      </h2>
    );
  }
}

export default Container.create(AccountName);

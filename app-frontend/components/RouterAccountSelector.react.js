import React from "react";
import { withRouter } from "react-router";

import { selectAccount } from "../actions/AccountActionCreators";

class AccountSelector extends React.Component {
  componentWillMount() {
    selectAccount(this.props.match.params.accountSlug);
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.accountSlug !== nextProps.match.params.accountSlug) {
      selectAccount(nextProps.match.params.accountSlug);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(AccountSelector);

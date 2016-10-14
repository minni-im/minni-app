import React from "react";

import { selectAccount } from "../actions/AccountActionCreators";

export default class AccountSelector extends React.Component {
  componentWillMount() {
    selectAccount(this.props.params.accountSlug);
  }

  componentWillUpdate(nextProps) {
    selectAccount(nextProps.params.accountSlug);
  }

  render() { return null; }
}

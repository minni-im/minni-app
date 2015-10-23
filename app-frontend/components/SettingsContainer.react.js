import React from "react";
import { Container } from "flux/utils";

import SelectedAccountStore from "../stores/SelectedAccountStore";

import Settings from "./Settings.react";

class SettingsContainer extends React.Component {
  static getStores() {
    return [ SelectedAccountStore ];
  }

  static calculateState() {
    return {
      account: SelectedAccountStore.getAccount()
    };
  }

  render() {
    return <Settings {...this.state} />;
  }
}

const container = Container.create(SettingsContainer);
export default container;

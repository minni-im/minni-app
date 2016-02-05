import React from "react";
import { Container } from "flux/utils";

import TabBar, { TabPanel } from "../components/generic/TabBar.react";

import SelectedAccountStore from "../stores/SelectedAccountStore";

class Settings extends React.Component {
  static getStores() {
    return [ SelectedAccountStore ];
  }

  static calculateState() {
    return {
      account: SelectedAccountStore.getAccount()
    };
  }

  render() {
    const { account } = this.state;
    return <main className="settings">
      <section>
        <header>
          <div className="header-info">
            <h2>Settings</h2>
            <h3>{account.displayName}</h3>
          </div>
        </header>
        <section className="panel">
          <TabBar>
            <TabPanel label="One">
              Prout
            </TabPanel>
            <TabPanel label="Two">
              Pouet
            </TabPanel>
            <TabPanel label="Three">
              Arf
            </TabPanel>
          </TabBar>
        </section>
      </section>
    </main>;
  }
}

const container = Container.create(Settings);
export default container;

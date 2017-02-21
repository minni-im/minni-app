import React from "react";

import TabBar, { TabPanel } from "./generic/TabBar.react";

class Settings extends React.Component {
  render() {
    const { account } = this.props;
    return (
      <main className="flex-spacer flex-vertical settings">
        <section className="flex-spacer flex-vertical">
          <header>
            <div className="header-info">
              <h2>Settings</h2>
              <h3>{account.toString()}</h3>
            </div>
          </header>
          <section className="panel flex-spacer flex-vertical">
            <TabBar className="flex-spacer">
              <TabPanel label="One">
                Prout
              </TabPanel>
              <TabPanel label="Two">
                Pouet{" "}
              </TabPanel>
              <TabPanel label="Three">
                Arf
              </TabPanel>
            </TabBar>
          </section>
        </section>
      </main>
    );
  }
}

export default Settings;

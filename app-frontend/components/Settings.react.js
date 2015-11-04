import React from "react";

import TabBar, { TabPanel } from "./generic/TabBar.react";

class Settings extends React.Component {
  render() {
    const { account } = this.props;
    return <main className="settings">
      <section>
        <header>
          <div className="header-info">
            <h2>Settings</h2>
            <h3>{account.displayName}</h3>
          </div>
        </header>
        <section className="panel panel--contrast">
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

export default Settings;

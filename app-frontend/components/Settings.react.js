import React from "react";

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

        </section>
      </section>
    </main>;
  }
}

export default Settings;

import React from "react";

import { camelize } from "../utils/TextUtils";

class Settings extends React.Component {
  render() {
    const { children, params } = this.props;
    const account = this.props.accounts.get(params.account);
    return <main className="settings">
      <section>
        <header>
          <div className="header-info">
            <h2>Settings</h2>
            <h3>{ camelize(account.name) }</h3>
          </div>
        </header>
        <section className="panel panel--contrast">

        </section>
      </section>
    </main>;
  }
}

export default Settings;

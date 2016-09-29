import React, { Component, PropTypes } from "react";
import { SettingsStore, UI } from "minni-plugins-toolkit";

const { SettingItem } = UI;

export default class Settings extends Component {
  static category = "plugins"

  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onActivateChange = this.onActivateChange.bind(this);
    this.catchAddAlias = this.catchAddAlias.bind(this);
    this.addAlias = this.addAlias.bind(this);
    this.removeAlias = this.removeAlias.bind(this);
  }

  state = {
    active: SettingsStore.getValue("plugins.aliases.active", false),
    aliases: SettingsStore.getValue("plugins.aliases.list", {})
  }

  onActivateChange(key, newValue) {
    this.props.onChange(key, newValue);
    this.setState({
      active: newValue
    });
  }

  addAlias() {
    const { alias, repl } = this;
    if (alias.value.length > 0 && repl.value.length > 0) {
      this.state.aliases[alias.value] = repl.value;
      this.setState({
        aliases: this.state.aliases
      });
      this.props.onChange("plugins.aliases.list", this.state.aliases);
      alias.value = repl.value = "";
    }
    alias.focus();
  }

  catchAddAlias(event) {
    if (event.keyCode === 13) {
      this.addAlias();
      event.preventDefault();
    }
  }

  removeAlias(event) {
    const alias = event.currentTarget.dataset.alias;
    delete this.state.aliases[alias];
    this.setState({
      aliases: this.state.aliases
    });
    this.alias.focus();
  }

  render() {
    const { active, aliases } = this.state;
    const rows = Object.keys(aliases)
      .map((alias, index) => (
        <tr key={index}>
          <td className="user-select">{alias}</td>
          <td className="user-select">{aliases[alias]}</td>
          <td className="user-noselect">
            <span
              data-alias={alias}
              title="delete this alias"
              className="item-action actionable"
              onClick={this.removeAlias}
            >×</span>
          </td>
        </tr>
      ));

    const table = active ? (
      <table className="setting-table">
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                autoFocus
                ref={(alias) => { this.alias = alias; }}
                type="text"
                placeholder="alias"
              />
            </td>
            <td>
              <input
                ref={(repl) => { this.repl = repl; }}
                type="text"
                placeholder="replacement"
                onKeyUp={this.catchAddAlias}
              />
            </td>
            <td>
              <button
                className="button-small button-secondary"
                onClick={this.addAlias}
              >Add</button>
            </td>
          </tr>
        </tfoot>
      </table>
    ) : false;

    return (
      <section className="aliases">
        <h3>Aliases</h3>
        <SettingItem
          setting="plugins.aliases.active"
          default={false}
          title="Replaces expressions in your outgoing messages"
          onChange={this.onActivateChange}
        />
        {table}
      </section>
    );
  }
}

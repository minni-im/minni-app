import React, { Component, PropTypes } from "react";
import { SettingsStore, SettingItem } from "../../libs/PluginsToolkit";

export default class Settings extends Component {
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
    active: SettingsStore.getValue("plugins.aliases.active"),
    aliases: SettingsStore.getValue("plugins.aliases.list")
  }

  onActivateChange(key, newValue) {
    this.props.onChange(key, newValue);
    this.setState({
      active: newValue
    });
  }

  addAlias() {
    const { alias, repl } = this.refs;
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
    this.refs.alias.focus();
  }

  render() {
    const { active, aliases } = this.state;
    const rows = Object.keys(aliases)
      .map((alias, index) => (
        <tr key={index}>
          <td>{alias}</td>
          <td>{aliases[alias]}</td>
          <td>
            <span
              data-alias={alias}
              title="delete this alias"
              className="item-action"
              onClick={this.removeAlias}
            >×</span>
          </td>
        </tr>
      ));

    const table = active ? (
      <table>
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <input
                ref="alias"
                type="text"
                placeholder="alias"
              />
            </td>
            <td>
              <input
                ref="repl"
                type="text"
                placeholder="replacement"
                onKeyUp={this.catchAddAlias}
              />
            </td>
            <td>
              <button
                className="highlight button-small"
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
          title="Replaces expressions in your outgoing messages"
          onChange={this.onActivateChange}
        />
        {table}
      </section>
    );
  }
}

import React from "react";

import InvitationDialog from "../InvitationDialog.react";
import UserList from "../UserList.react";

import { GroupAddIcon } from "../../utils/IconsUtils";

import Logger from "../../libs/Logger";

const logger = Logger.create("ContactList");

export default class ContactList extends React.Component {
  renderList() {
    const users = this.props.users.sortBy(user => user.fullname);
    return <UserList viewer={this.props.viewer} users={users} />;
  }

  renderEmptyList() {
    return (
      <div className="coworker-all-alone">
        You don&apos;t have any coworker ? That is sad !
        <InvitationDialog className="icon pointer">
          <GroupAddIcon />
        </InvitationDialog>
      </div>
    );
  }

  render() {
    const teamSize = this.props.users.size;
    return (
      <aside className="flex-vertical">
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>Coworkers</h2>
            <h3>{teamSize} teammate{teamSize > 1 ? "s" : ""}</h3>
          </div>
          {teamSize
            ? <div className="actions">
              <InvitationDialog className="icon pointer">
                <GroupAddIcon />
              </InvitationDialog>
            </div>
            : false}
        </header>
        <section className="panel panel--wrapper flex-vertical flex-spacer">
          {teamSize ? this.renderList() : this.renderEmptyList()}
        </section>
      </aside>
    );
  }
}

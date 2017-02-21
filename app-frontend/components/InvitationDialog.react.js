import React from "react";

import Dialog from "./generic/Dialog.react";
import InvitationListContainer from "./InvitationListContainer.react";

class InvitationDialog extends React.Component {
  static propTypes = {
    visible: React.PropTypes.bool,
    onClose: React.PropTypes.func
  };

  static defaultProps = {
    visible: false
  };

  render() {
    //
    // const noInvite = (
    //   <div>
    //     No invitation link.
    //     <div>
    //       <button
    //         className="button-highlight"
    //         onClick={() => this.onGenerateClick()}
    //       >
    //         Generate an invitation link
    //       </button>
    //     </div>
    //   </div>
    // );
    return (
      <Dialog
        buttons={[
          {
            label: "Close",
            action: "close"
          }
        ]}
        {...this.props}
        title="Invite teammates"
        subtitle="Create invitation links for your coworkers"
        additionalClassNames="panel invitation-dialog"
      >
        <InvitationListContainer />
      </Dialog>
    );
  }
}

export default class InvitationDialogWrapper extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  };

  state = {
    visible: false
  };

  toggleDialog() {
    this.setState(({ visible }) => ({
      visible: !visible
    }));
  }

  render() {
    const { visible } = this.state;
    return (
      <span className={this.props.className}>
        <InvitationDialog visible={visible} onClose={() => this.toggleDialog()} />
        {React.cloneElement(this.props.children, {
          onClick: () => this.toggleDialog()
        })}
      </span>
    );
  }
}

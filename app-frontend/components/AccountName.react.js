import React from "react";

export default function AccountName({ displayName }) {
  return (
    <h2 className={this.props.className}>
      {this.state.account ? this.state.account.toString() : "..."}
    </h2>
  );
}

import React from "react";
import { Container } from "flux/utils";

import ModalStore from "../../stores/ModalStore";

class Modal extends React.Component {
  render() {
    return <div className="modal" />;
  }
}

class ModalsContainer extends React.Component {
  static getStores() {
    return [ModalStore];
  }

  static calculateState() {
    return {
      modal: ModalStore.getModal()
    };
  }
}

const container = Container.create(ModalsContainer);
export default container;

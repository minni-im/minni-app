import Dispatcher from "../Dispatcher";
import { ReduceStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleModalPush(state, { modal }) {

}

function handleModalPop(state, { modal }) {

}

class ModalStore extends ReduceStore {
  initialize() {
    this.addAction(ActionTypes.MODAL_PUSH, handleModalPush);
    this.addAction(ActionTypes.MODAL_POP, handleModalPop);
  }

  getModal() {
    return this.getStore().last();
  }
}

export default new ModalStore(Dispatcher);

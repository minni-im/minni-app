import invariant from "invariant";
import { ReduceStore as FluxReduceStore, MapStore as FluxMapStore } from "flux/utils";
import { Mixin as mixin } from "./Mixin";
import { debounce } from "../utils/TimerUtils";

let storesStore = [];

export function withNoMutations(handler) {
  return function(state, ...args) {
    handler(...args);
    return state;
  };
}

const StoreOverlay = {
    addAction(...args) {
      const actionTypes = args.slice(0, args.length - 1);
      const handlerFn = args[args.length - 1];
      actionTypes.forEach(actionType => {
        this.__actionHandlers[actionType] = handlerFn;
      });
    },

    reduce(state, action) {
      const handlerFn = this.__actionHandlers[action.type];
      if (handlerFn) {
        if (this.__dependencies.length > 0) {
          this.getDispatcher().waitFor(this.__dependencies);
        }
        return handlerFn.call(this, state, action);
      }
      return state;
    },

    waitFor(...stores) {
      stores.forEach(store => this.__dependencies.push(store.getDispatchToken()));
    },

    syncWith(stores, callback) {
      const wrapper = () => {
        let startingState = this._state;
        let endingState = callback.call(this, startingState);

        invariant(
          endingState !== undefined,
          "%s returned undefined from a syncWith(...) callback, did you forget to return " +
          "state in the default case? (use null if this was intentional)",
          this.constructor.name
        );
        if (startingState !== endingState) {
          this._state = endingState;
          this.__emitter.emit(this.__changeEvent);
        }
      };
      stores.forEach(store => store.addListener(wrapper));
    }
};

export class ReduceStore extends mixin(FluxReduceStore, StoreOverlay) {
  constructor(dispatcher) {
    super(dispatcher);
    this.__dependencies = [];
    this.__actionHandlers = {};
    storesStore.push(this);
  }
}

export class MapStore extends mixin(FluxMapStore, StoreOverlay) {
  constructor(dispatcher) {
    super(dispatcher);
    this.__dependencies = [];
    this.__actionHandlers = {};
    storesStore.push(this);
  }
}

export default {
  initialize() {
    storesStore.forEach(store => store.initialize());
  }
};

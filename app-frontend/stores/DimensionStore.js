import Immutable from "immutable";

import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";

function handleScroll( state, { roomId, scrollTop } ) {
  if ( scrollTop == null ) {
    return state.delete( roomId );
  }
  return state.set( roomId, { scrollTop } );
}

class DimensionStore extends MapStore {
  initialize() {
    this.addAction( ActionTypes.UPDATE_DIMENSIONS, handleScroll );
  }

  getDimensions({ id }) {
    return this.getState().get(id, { scrollTop: null });
  }
}

const instance = new DimensionStore( Dispatcher );
export default instance;

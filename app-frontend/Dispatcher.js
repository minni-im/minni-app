import { Dispatcher } from "flux";

const instance = new Dispatcher();
export default instance;

export const dispatch = instance.dispatch.bind(instance);

export function dispatchAsync(payload) {
  if (instance.isDispatching()) {
    setImmediate(instance.dispatch.bind(instance, payload));
  } else {
    dispatch(payload);
  }
}

export function dispatchMaybe(payload) {
  if (!instance.isDispatching()) {
    dispatch(payload);
  }
}

import { Dispatcher } from "flux";

const instance = new Dispatcher();
export default instance;

export const dispatch = instance.dispatch.bind(instance);

export const dispatchAsync = (payload) => {
  setImmediate(instance.dispatch.bind(instance, payload));
};

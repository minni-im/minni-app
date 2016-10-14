import { Dispatcher } from "flux";

const STYLE = `
  font-weight: bold;
  color: green;
`;

const instance = new Dispatcher();
export default instance;

export const dispatch = (payload) => {
  console.group(`%c${payload.type}`, STYLE);
  try {
    instance.dispatch.call(instance, payload);
  } catch (ex) {
    console.error(ex);
  } finally {
    console.groupEnd();
  }
};

export function dispatchAsync(payload) {
  if (instance.isDispatching()) {
    setTimeout(() => dispatch(payload), 0);
  } else {
    dispatch(payload);
  }
}

export function dispatchMaybe(payload) {
  if (!instance.isDispatching()) {
    dispatch(payload);
  }
}

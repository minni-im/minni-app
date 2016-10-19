import { Dispatcher } from "flux";

const STYLE = `
  font-weight: bold;
  color: green;
`;

const instance = new Dispatcher();
export default instance;

export const dispatch = (payload) => {
  const data = { ...payload };
  delete data.type;
  console.group(`%c${payload.type}`, STYLE, JSON.stringify(data));
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
    setImmediate(dispatch.bind(instance, payload));
  } else {
    dispatch(payload);
  }
}

export function dispatchMaybe(payload) {
  if (!instance.isDispatching()) {
    dispatch(payload);
  }
}

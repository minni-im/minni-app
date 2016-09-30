import { dispatch } from "../Dispatcher";
import { request } from "../utils/RequestUtils";
import { ActionTypes, EndPoints } from "../Constants";

export function login(username, password) {
  dispatch({
    type: ActionTypes.LOGIN
  });
  return request(EndPoints.LOGIN, {
    method: "POST",
    body: {
      username,
      password
    }
  }).then((res) => {
    if (res.ok) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        token: res.token
      });
    } else {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE
      });
    }
    return res;
  });
}

export function register(username, email, password) {
  dispatch({
    type: ActionTypes.SIGNUP
  });
}

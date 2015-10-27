import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes } from "../Constants";

export default {
  registerComponent(name, component) {
    dispatch({
      type: ActionTypes.TYPEAHEAD_REGISTER,
      name,
      component
    });
  }
};

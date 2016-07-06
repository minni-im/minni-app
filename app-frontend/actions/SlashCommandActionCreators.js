import { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("SlashCommandActionCreators");


export function search(command, query) {
  dispatch({
    type: ActionTypes.SLASHCOMMAND_QUERY,
    command,
    query
  });
  return request(`${EndPoints.SLASH_COMMAND}/${command}/search?q=${encodeURIComponent(query)}`)
    .then(({ ok, results, errors }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.SLASHCOMMAND_QUERY_SUCCESS,
          command,
          query,
          results
        });
        return;
      }
      logger.error(errors);
      dispatch({
        type: ActionTypes.SLASHCOMMAND_QUERY_FAILURE,
        command,
        query,
        errors
      });
    });
}

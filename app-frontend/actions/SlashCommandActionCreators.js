import { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("SlashCommandActionCreators");


export function search(integration, query) {
  dispatch({
    type: ActionTypes.SLASHCOMMAND_QUERY,
    integration,
    query
  });
  return request(
    `${EndPoints.SLASH_COMMAND}/${integration}/search`, {
      method: "POST",
      params: {
        q: query
      }
    }).then(({ ok, results, errors }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.SLASHCOMMAND_QUERY_SUCCESS,
          integration,
          query,
          results
        });
        return;
      }
      logger.error(errors);
      dispatch({
        type: ActionTypes.SLASHCOMMAND_QUERY_FAILURE,
        integration,
        query,
        errors
      });
    });
}

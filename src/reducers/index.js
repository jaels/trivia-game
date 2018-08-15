import { alreadyAskedReducer, roundReducer, generalScoreReducer, currentRoundScoreReducer } from "./reducers";

import { combineReducers } from "redux";

const rootReducer =
  (state, action) =>
  combineReducers({
      alreadyAsked: alreadyAskedReducer,
      round: roundReducer,
      generalScore: generalScoreReducer,
      currentRoundScore: currentRoundScoreReducer
  })(action.type === 'NEW_GAME' ? undefined : state, action)

  export default rootReducer;

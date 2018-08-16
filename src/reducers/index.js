import { questionReducer, alreadyAskedReducer, roundReducer, generalScoreReducer, currentRoundScoreReducer, youWonReducer, wrongAnswerReducer } from "./reducers";
import { combineReducers } from "redux";

const rootReducer =
  (state, action) =>
  combineReducers({
      questionData: questionReducer,
      alreadyAsked: alreadyAskedReducer,
      round: roundReducer,
      generalScore: generalScoreReducer,
      currentRoundScore: currentRoundScoreReducer,
      wrongAnswer: wrongAnswerReducer,
      youWon: youWonReducer
  })(action.type === 'NEW_GAME' ? undefined : state, action)

  export default rootReducer;

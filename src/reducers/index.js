import { alreadyAskedReducer, roundReducer, generalScoreReducer, currentRoundScoreReducer } from "./reducers";

import { combineReducers } from "redux";


const rootReducer = combineReducers({
    alreadyAsked: alreadyAskedReducer,
    round: roundReducer,
    generalScore: generalScoreReducer,
    currentRoundScore: currentRoundScoreReducer,
})


export default rootReducer;

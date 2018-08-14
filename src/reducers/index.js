import { alreadyAskedReducer, roundReducer, generalScoreReducer } from "./reducers";

import { combineReducers } from "redux";


const rootReducer = combineReducers({
    alreadyAsked: alreadyAskedReducer,
    round: roundReducer,
    generalScore: generalScoreReducer
})


export default rootReducer;

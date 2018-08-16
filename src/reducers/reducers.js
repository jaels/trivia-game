
exports.questionReducer = (state=null, action) => {
    switch(action.type) {
        case "SET_QUESTION":
        return action.item;
        default:
        return state;
    }
}

exports.alreadyAskedReducer = (state=[], action) => {
    switch(action.type) {
        case "ADD_ONE":
        return [...state, action.item];
        default:
        return state;
    }
}

exports.roundReducer = (state=1, action) => {
    switch(action.type) {
        case "ADD_ROUND":
        return state + 1;
        default:
        return state;
    }
}

exports.generalScoreReducer = (state=0, action) => {
    switch(action.type) {
        case "ADD_SCORE":
        return state + action.item;
        default:
        return state;
    }
}

exports.currentRoundScoreReducer = (state=1, action) => {
    switch(action.type) {
        case "INCREASE_SCORE":
        return action.item;
        default:
        return state;
    }
}

exports.wrongAnswerReducer = (state=false, action) => {
    switch(action.type) {
        case "SET_WRONG_ANSWER":
        return true;
        default:
        return state;
    }
}

exports.youWonReducer = (state=false, action) => {
    switch(action.type) {
        case "SET_WIN":
        return true;
        default:
        return state;
    }
}

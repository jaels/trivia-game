

export var setQuestion = (item) => ({
    type: "SET_QUESTION",
    item
})

export var addAlreadyAsked = (item) => ({
    type: "ADD_ONE",
    item
})

export var nextRound = () => ({
    type: "ADD_ROUND"
})

export var addScore = (item) => ({
    type: "ADD_SCORE",
    item
})

export var increasePotentialScore = (item) => ({
    type: "INCREASE_SCORE",
    item
})

export var setWin = () => ({
    type: "SET_WIN"
})

export var setWrongAnswer = () => ({
    type: "SET_WRONG_ANSWER"
})

export var newGame = () => ({
    type: "NEW_GAME"
})



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

export var increaseScore = (item) => ({
    type: "INCREASE_SCORE",
    item
})

import React from 'react';
import '../styles/App.css';
import {connect} from "react-redux";

const GameOverModal = (props) => {
    return (
        <div className="modal">
            <div className="modal-content">
                {props.wrongAnswer ? <h3 style={{color: "#B00000"}}>Wrong! The correct answer is: {props.questionData.answer}</h3> : null}
                <h3>{props.youWon ? "YOU WON!" : "GAME OVER"}</h3>
                <button className="new-game-button" onClick={props.startNewGame}> Start Over </button>
            </div>
        </div>
    )
}

function mapStateToProps(state, prop) {
    return {
        youWon: state.youWon,
        questionData: state.questionData,
        wrongAnswer: state.wrongAnswer
    }
}

export default connect(mapStateToProps)(GameOverModal);

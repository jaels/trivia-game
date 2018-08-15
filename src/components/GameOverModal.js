import React from 'react';
import '../App.css';

const GameOverModal = (props) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{props.youWon ? "YOU WON!" : "GAME OVER"}</h3>
                <button className="new-game-button" onClick={props.startNewGame}> Start Over</button>
            </div>
        </div>
    )
}

export default GameOverModal;

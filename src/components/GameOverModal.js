import React from 'react';
import '../App.css';

const GameOverModal = (props) => {
    return (
        <div className="backdrop">
        <div className="modal">
          <h2>Modal</h2>

          <div className="footer">
            <button>
              Close
            </button>
          </div>
        </div>
      </div>
    )
}

export default GameOverModal;

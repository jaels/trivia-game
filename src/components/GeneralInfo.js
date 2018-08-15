import React from 'react';
import '../styles/App.css';

import {connect} from "react-redux";


const GeneralInfo = (props) => {
    return (
      <div className="general-info-area">
        <h2>{localStorage.getItem("highScore") ? `Your Highest Score: ${localStorage.getItem("highScore")}` : ""}</h2>
        <h2>Round: {props.round}</h2>
        <h2> Total Score: {props.generalScore} </h2>
        <h2> Current Round Score: {props.currentRoundScore}</h2>
      </div>
    )
}


function mapStateToProps(state, prop) {
    return {
        round: state.round,
        generalScore: state.generalScore,
        currentRoundScore: state.currentRoundScore
    }
}


export default connect(mapStateToProps)(GeneralInfo);

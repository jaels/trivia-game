import React from 'react';
import '../App.css';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actions from "../actions/actions";


const GeneralInfo = (props) => {
    return (
        <div>
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

function mapDispatchToProps(dispatch) {
    return {
        action: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralInfo);

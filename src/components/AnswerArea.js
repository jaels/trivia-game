import React, {Component} from 'react';
import '../styles/App.css';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actions from "../actions/actions";

class AnswerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAnswer: "",
            maxNumOfRounds: 30
        }
        this.answerArea = React.createRef();
    }

    handleAnswerTyping(e) {
        this.setState({userAnswer: e.target.value});
    }

    handleSubmitAnswer() {
        const { userAnswer } = this.state;
        if (userAnswer.length > 0) {
            // Cleans the answer from possible html tags and "\"
            const correctAnswer = this.props.questionData.answer.replace(/(<([^>]+)>)|"\\"/ig,"");
            if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                this.handleCorrectAnswer();
            }
            else {
                this.props.action.setWrongAnswer();
                this.props.handleGameOver();
            }
            this.answerArea.current.value = "";
        }
    }

    handleCorrectAnswer() {
        const { action, round, currentRoundScore, getTheQuestion, handleGameOver } = this.props;
        action.addScore(currentRoundScore);
        if (round < this.state.maxNumOfRounds) {
            getTheQuestion();
            action.nextRound();
            action.increasePotentialScore(Math.pow(2, round));
        }
        else {
            action.setWin();
            handleGameOver();
        }
    }

    render() {
        return (
            <div>
                <textarea rows="4" cols="50" className="answer-area" onChange={this.handleAnswerTyping.bind(this)} ref={this.answerArea}>
                </textarea>
                <button className="submit-button" onClick={this.handleSubmitAnswer.bind(this)}>Submit</button>
            </div>
        )
    }

}

function mapStateToProps(state, prop) {
    return {
        questionData: state.questionData,
        round: state.round,
        currentRoundScore: state.currentRoundScore,
        wrongAnswer: state.wrongAnswer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        action: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerArea);

import React, { Component } from 'react';
import '../styles/App.css';
import Timer from "./Timer";
import GameOverModal from "./GameOverModal";
import GeneralInfo from "./GeneralInfo";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actions from "../actions/actions";

class QuizArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionData: null,
            userAnswer: "",
            gameOver: false,
            youWon: false,
            secondsLeft: 30,
            maxNumOfQuestions: 30
        }

        this.answerArea = React.createRef();
        this.handleGameOver = this.handleGameOver.bind(this);
        this.handleCorrectAnswer = this.handleCorrectAnswer.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
    }

    componentDidMount() {
        this.getTheQuestion();
    }

    getTheQuestion() {
        const { action, alreadyAsked } = this.props;
        fetch("http://jservice.io/api/random").then(res => {
            res.json().then(data => {
                console.log(data[0]);
                //checking if the question was already asked
                if(alreadyAsked.indexOf(data[0].id) > -1) {
                    this.getTheQuestion();
                }
                else {
                    this.setState({questionData: data[0]})
                    action.addAlreadyAsked(data[0].id);
                    this.setState({secondsLeft: 30});
                }
            });
        });
    }

    handleAnswerTyping(e) {
        this.setState({userAnswer: e.target.value});
    }

    handleSubmitAnswer() {
        const { questionData, userAnswer } = this.state;
        // Cleans the answer from possible html tags and \
        const correctAnswer = questionData.answer.replace(/(<([^>]+)>)|"\\"/ig,"");
        if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            this.handleCorrectAnswer();
        }
        else {
            this.handleGameOver();
        }
    }

    handleCorrectAnswer() {
        const { action, round, currentRoundScore } = this.props;
        const { maxNumOfQuestions } = this.state;
        action.addScore(currentRoundScore);
        if (round < maxNumOfQuestions) {
            action.nextRound();
            action.increasePotentialScore(Math.pow(2, round));
            this.answerArea.current.value = "";
            this.getTheQuestion();
            this.setState({secondsLeft: 30});
        }
        else {
            this.setState({youWon: true});
            this.handleGameOver();
        }
    }



    handleGameOver() {
        const { generalScore, currentRoundScore } = this.props;
        this.setState({gameOver: true});
        if(!localStorage.getItem("highScore")) {
            localStorage.setItem("highScore", generalScore + currentRoundScore);
        }
        else if (localStorage.getItem("highScore") < generalScore + currentRoundScore) {
            localStorage.setItem("highScore", generalScore + currentRoundScore);
        }
    }

    startNewGame() {
        const { action } = this.props;
        action.newGame();
        this.setState({gameOver: false, secondsLeft: 30});
        this.answerArea.current.value = "";
    }

  render() {
     const { questionData, gameOver, youWon } = this.state;
     return (
       <div className="questionArea">
         {gameOver ?
         <GameOverModal youWon={youWon} startNewGame={this.startNewGame}/> : ""}
         <GeneralInfo/>
         {!gameOver ?
         <Timer handleGameOver={this.handleGameOver} secondsLeft={this.state.secondsLeft}/> : null}
         <h2 className="question">Please answer the following question:</h2>
         <h3>{questionData ? questionData.category.title : "" }</h3>
         <h2>{questionData ? questionData.question : ""}</h2>
         <textarea rows="4" cols="50" className="answer-area" onChange={this.handleAnswerTyping.bind(this)} ref={this.answerArea}>
         </textarea>
         <button className="submit-button" onClick={this.handleSubmitAnswer.bind(this)}>Submit</button>
       </div>
    );
  }
}


function mapStateToProps(state, prop) {
    return {
        alreadyAsked: state.alreadyAsked,
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

export default connect(mapStateToProps, mapDispatchToProps)(QuizArea);

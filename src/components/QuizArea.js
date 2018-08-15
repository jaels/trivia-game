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
            secondsLeft: 30
        }
        this.answerArea = React.createRef();
        this.countDown = this.countDown.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);
        this.handleCorrectAnswer = this.handleCorrectAnswer.bind(this);
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

    countDown() {
        const { secondsLeft } = this.state;
        this.setState({secondsLeft: secondsLeft -1});
        if (secondsLeft === 1) {
          clearInterval(this.interval);
          this.setState({gameOver: true});
        }
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
        action.addScore(currentRoundScore);
        if (round < 30) {
            action.nextRound();
            action.increaseScore(Math.pow(2, round));
            this.answerArea.current.value = "";
            this.getTheQuestion();
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
        window.location.reload();
    }

  render() {
     const { questionData, gameOver, youWon } = this.state;
     return (
       <div className="questionArea">
         {gameOver ?
         <GameOverModal youWon={youWon} startNewGame={this.startNewGame}/> : ""}
         <GeneralInfo/> {!gameOver ?
         <Timer countDown={this.countDown} secondsLeft={this.state.secondsLeft}/> : ""}
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

import React, { Component } from 'react';
import '../styles/App.css';
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
            secondsLeft: 0,
            maxNumOfRounds: 30
        }

        this.answerArea = React.createRef();
        this.handleGameOver = this.handleGameOver.bind(this);
        this.handleCorrectAnswer = this.handleCorrectAnswer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.startNewGame = this.startNewGame.bind(this);

        // localStorage.setItem("highScore", 0);
        // localStorage.clear();
    }

    componentDidMount() {
        this.getTheQuestion();
        this.interval = setInterval(this.countDown, 1000);
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
        const { maxNumOfRounds } = this.state;
        action.addScore(currentRoundScore);
        if (round < maxNumOfRounds) {
            this.getTheQuestion();
            action.nextRound();
            action.increasePotentialScore(Math.pow(2, round));
            this.answerArea.current.value = "";
        }
        else {
            this.setState({youWon: true});
            this.handleGameOver();
        }
    }

    countDown() {
        const { secondsLeft } = this.state;
        this.setState({secondsLeft: secondsLeft -1});
        if (secondsLeft === 1) {
          this.setState({gameOver: true});
          clearInterval(this.interval);
        }
    }

    handleGameOver() {
        const { generalScore } = this.props;
        this.setState({gameOver: true});
        clearInterval(this.interval);
        if(!localStorage.getItem("highScore")) {
            localStorage.setItem("highScore", generalScore);
        }
        else if (localStorage.getItem("highScore") < generalScore) {
            localStorage.setItem("highScore", generalScore);
        }
    }

    startNewGame() {
        const { action } = this.props;
        action.newGame();
        this.setState({gameOver: false, youWon: false, secondsLeft: 30});
        this.answerArea.current.value = "";
        this.interval = setInterval(this.countDown, 1000);
    }

  render() {
     const { questionData, gameOver, youWon, secondsLeft } = this.state;
     return (
       <div className="questionArea">
         {gameOver ?
         <GameOverModal youWon={youWon} startNewGame={this.startNewGame}/> : null}
         <GeneralInfo/>
         <div className="timer-circle">{secondsLeft}</div>
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

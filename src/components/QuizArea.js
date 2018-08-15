import React, { Component } from 'react';
import '../App.css';
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
                }
            });
        });
    }

    handleAnswerTyping(e) {
        this.setState({userAnswer: e.target.value});
    }

    handleGameOver() {
        let { generalScore, currentRoundScore } = this.props;
        this.setState({gameOver: true});
        if(!localStorage.getItem("highScore")) {
            localStorage.setItem("highScore", generalScore + currentRoundScore);
        }
        else if (localStorage.getItem("highScore") < generalScore + currentRoundScore) {
            localStorage.setItem("highScore", generalScore + currentRoundScore);
        }
    }

    handleSubmitAnswer() {
        let { questionData, userAnswer, gameOver } = this.state;
        let { action, round, generalScore, currentRoundScore } = this.props;
        // Cleans the answer from possible html tags and \
         let correctAnswer = questionData.answer.replace(/(<([^>]+)>)|"\\"/ig,"");
        if(userAnswer.toLowerCase() == correctAnswer.toLowerCase()) {
            action.addScore(currentRoundScore);
            if (round < 6) {
                action.nextRound();
                action.increaseScore(Math.pow(2, round));
                this.getTheQuestion();
                this.answerArea.current.value = "";
                this.setState({secondsLeft: 30});
            }
            else {
                this.setState({youWon: true});
                this.handleGameOver();
            }
        }
        else {
            this.handleGameOver();
        }
    }

    startNewGame() {
        console.log("start new");
        window.location.reload();
    }

    countDown() {
    let { secondsLeft } = this.state;
    this.setState({secondsLeft: secondsLeft -1});
    if (secondsLeft == 1) {
      clearInterval(this.interval);
      this.setState({gameOver: true});
    }
  }

  render() {
     let { questionData, gameOver, youWon } = this.state;
     return (
      <div className="questionArea">
      {gameOver ? <GameOverModal youWon={youWon} startNewGame={this.startNewGame}/> : ""}
      <GeneralInfo/>
        {!gameOver ? <Timer countDown={this.countDown} secondsLeft={this.state.secondsLeft}/>  : ""}
          <h1 className="question">Please answer the following question:</h1>
          <h4>{questionData ? questionData.category.title : "" }</h4>
          <h3>{questionData ? questionData.question : ""}</h3>
          <textarea rows="4" cols="50" onChange={this.handleAnswerTyping.bind(this)} ref={this.answerArea}>
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

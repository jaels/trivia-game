import React, { Component } from 'react';
import '../styles/App.css';
import GeneralInfo from "./GeneralInfo";
import Question from "./Question";
import AnswerArea from "./AnswerArea";
import GameOverModal from "./GameOverModal";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actions from "../actions/actions";

class QuizArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameOver: false,
            secondsLeft: 30
        }

        this.getTheQuestion = this.getTheQuestion.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.countDown = this.countDown.bind(this);
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
                //checking if the question was already asked, or if there is an empty question (happens sometimes), or if there was any problem with the response
                if(alreadyAsked.indexOf(data[0].id) > -1 ||
                data[0].question.length === 0 || res.status !== 200) {
                    this.getTheQuestion();
                }
                else {
                    action.setQuestion(data[0]);
                    action.addAlreadyAsked(data[0].id);
                    this.setState({secondsLeft: 30});
                }
            })
        })
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
        this.props.action.newGame();
        this.getTheQuestion();
        this.setState({gameOver: false});
        this.interval = setInterval(this.countDown, 1000);
    }

  render() {
     const { gameOver, secondsLeft } = this.state;
     return (
       <div className="quiz-area">
         {gameOver ?
         <GameOverModal startNewGame={this.startNewGame}/>
         : null}
         <GeneralInfo/>
         <div className="timer-circle">{secondsLeft}</div>
         <Question/>
         <AnswerArea
         getTheQuestion={this.getTheQuestion}
         handleGameOver={this.handleGameOver}/>
       </div>
    );
  }
}

function mapStateToProps(state, prop) {
    return {
        questionData: state.questionData,
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

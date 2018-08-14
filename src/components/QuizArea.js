import React, { Component } from 'react';
import '../App.css';
import Timer from "./Timer";
import GameOverModal from "./GameOverModal";


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
            restartTimer: false
        }
        this.answerArea = React.createRef();
    }

    componentDidMount() {
        this.getTheQuestion();
    }

    getTheQuestion() {
        const { action, alreadyAsked } = this.props;
        fetch("http://jservice.io/api/random").then(res => {
            res.json().then(data => {
                console.log(data[0]);
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

    handleSubmitAnswer() {
        let { questionData, userAnswer, gameOver } = this.state;
        let { action, round } = this.props;
        // In case the answer comes with <i> or other html tags, or with \
        let correctAnswer = questionData.answer.replace(/(<([^>]+)>)|"\\"/ig,"");
        console.log(correctAnswer);
        if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            if (round < 30) {
                action.nextRound();
                action.addScore(Math.pow(2, round - 1));
                this.getTheQuestion();
                this.answerArea.current.value = "";
                this.setState({restartTimer: true});
            }
            else {
                console.log("you won");
            }
        }
        else {
            console.log("game over");
            this.setState({gameOver: true});
        }
    }

    startNewGame() {
        console.log("start new");
    }


  render() {
     let { questionData, gameOver, youWon } = this.state;
     let { round, generalScore } = this.props;
     return (
      <div className="questionArea">
        <h2>Round: {round}</h2>
        <h2> Total Score: {generalScore} </h2>
        <h2> Current Round Score: {Math.pow(2, round - 1)}</h2>
        <Timer restartTimer={this.state.restartTimer}/>
        {gameOver ? <GameOverModal youWon={youWon} startNewGame={this.startNewGame}/> : "" }
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
        generalScore: state.generalScore
    }
}

function mapDispatchToProps(dispatch) {
    return {
        action: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizArea);

import React, { Component } from 'react';
import '../App.css';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as actions from "../actions/actions";


class QuizArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionData: null,
            userAnswer: ""
        }
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
        let { questionData, userAnswer } = this.state;
        let { action, round } = this.props;
        // In case the answer comes with <i> or other html tags
        let correctAnswer = questionData.answer.replace(/(<([^>]+)>)/ig,"").trim();
        console.log(correctAnswer);
        if(userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            if (round < 30) {
                action.nextRound();
                action.addScore(1);
            }
            else {
                console.log("you won");
            }
        }
        else {
            console.log("game over");
        }
    }

    addOne() {
        const { action, num } = this.props;
        action.addOne();
    }

    reduceOne () {
        const { action, num } = this.props;
        action.reduceOne();
    }

  render() {
     let { questionData } = this.state;
     let { round } = this.props;
    return (
      <div className="questionArea">
        <h2>Round: {round}</h2>
          <h1 className="question">Please answer the following question:</h1>
          <h4>{questionData ? questionData.category.title : "" }</h4>
          <h3>{questionData ? questionData.question : ""}</h3>
          <textarea rows="4" cols="50" onChange={this.handleAnswerTyping.bind(this)}>
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

import React, { Component } from 'react';
import './App.css';
import QuizArea from './components/QuizArea';



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStart: false
        }
    }

    startGame() {
        this.setState({gameStart: true});
    }

  render() {
    return (
      <div className="App">
          <h1 className="App-title">Welcome to the Trivia Game</h1>
          <button onClick = {this.startGame.bind(this)}>Start</button>
          {this.state.gameStart ? <QuizArea/> : ""}
      </div>
    );
  }
}

export default App;

import React from 'react';
import './App.css';
import QuizArea from './components/QuizArea';



const App = () => {
    return (
      <div className="App">
          <h1 className="App-title">Welcome to the Trivia Game</h1>
          <QuizArea/>
      </div>
    );
}

export default App;

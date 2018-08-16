import React from 'react';
import './styles/App.css';
import QuizArea from './components/QuizArea';

const App = () => {
    return (
      <div className="app">
          <h1 className="app-title">Welcome to the Trivia Game</h1>
          <QuizArea/>
      </div>
    );
}

export default App;

import React, {Component} from 'react';
import '../styles/App.css';

class Timer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            secondsLeft: this.props.secondsLeft
        }
        this.countDown = this.countDown.bind(this);
    }


    componentDidMount() {
        this.interval = setInterval(this.countDown, 1000);
    }

    countDown() {
    this.setState({secondsLeft: this.state.secondsLeft - 1});
    if (this.state.secondsLeft <= 0) {
      clearInterval(this.interval);
      this.props.handleGameOver();
    }
  }

    render() {
        return (
            <div className="timer-circle">{this.state.secondsLeft}</div>
        )
    }
}

export default Timer;

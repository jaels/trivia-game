import React, {Component} from 'react';
import '../styles/App.css';

class Timer extends Component {

    componentDidMount() {
        this.interval = setInterval(this.props.countDown, 1000);
    }

    render() {
        return (
            <div className="timer-circle">{this.props.secondsLeft}</div>
        )
    }
}

export default Timer;

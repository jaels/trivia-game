import React, {Component} from 'react';
import '../App.css';

class Timer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.interval = setInterval(this.props.countDown, 1000);
    }

    render() {
        return (
            <h3>{this.props.secondsLeft}</h3>
        )
    }
}

export default Timer;

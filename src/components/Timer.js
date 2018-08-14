import React, {Component} from 'react';
import '../App.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsLeft: 30
        }
        this.countDown = this.countDown.bind(this);
    }

    countDown() {
    let { secondsLeft } = this.state;
    this.setState({secondsLeft: secondsLeft -1});
    if (secondsLeft == 1) {
      clearInterval(this.interval);
      console.log("no seconds");
    }
  }

    componentDidMount() {
        this.interval = setInterval(this.countDown, 1000);
    }

    render() {
        let { secondsLeft } = this.state;
        console.log(this.props.restartTimer);
        return (
            <h3>{secondsLeft}</h3>
        )
    }
}

export default Timer;

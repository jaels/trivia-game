import React from 'react';
import '../styles/App.css';
import {connect} from "react-redux";

const Question = (props) => {
    return (
      <div className="question-area">
          <h2 className="question">Please answer the following question:</h2>
          <h3>{props.questionData ? props.questionData.category.title : "" }</h3>
          <h2>{props.questionData ? props.questionData.question : ""}</h2>
      </div>
    )
}

function mapStateToProps(state, prop) {
    return {
        questionData: state.questionData
    }
}

export default connect(mapStateToProps)(Question);

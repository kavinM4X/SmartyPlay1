import React, { useState, useRef } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Refs for the answer options
  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  // Array of option refs
  const Option_array = [Option1, Option2, Option3, Option4];

  // Function to handle answer check
  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        Option_array[question.ans - 1].current.classList.add("correct");
      }
      setLock(true);
    }
  };

  // Function to move to the next question
  const handleNext = () => {
    if (index < data.length - 1) {
      const newIndex = index + 1;

      // Reset styles for options
      Option_array.forEach((ref) => {
        if (ref.current) {
          ref.current.classList.remove("correct", "wrong");
        }
      });

      // Update the question and reset lock
      setIndex(newIndex);
      setQuestion(data[newIndex]);
      setLock(false);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {!quizCompleted ? (
        <>
          <h2>
            {index + 1}. {question.question}
          </h2>
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>
              {question.option1}
            </li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>
              {question.option2}
            </li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>
              {question.option3}
            </li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>
              {question.option4}
            </li>
          </ul>
          <button onClick={handleNext}>Next</button>
          <div className="index">
            {index + 1} of {data.length} Questions
          </div>
        </>
      ) : (
        <div className="result">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {data.length}</p>
        </div>
      )}
    </div>
  );
};

export default Quiz;

import React, { useState, useEffect } from 'react';
import '../styles/QuizSession.css';

const QuizSession = ({ quiz, onClose, currentUser }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    console.log('Selected option:', optionIndex);
    setSelectedOption(Number(optionIndex)); // Convert to number immediately
  };

  const handleNextQuestion = () => {
    // Store the selected answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    console.log('Storing answer for question', currentQuestion, {
      selectedAnswer: selectedOption,
      correctAnswer: quiz.questions[currentQuestion].correctAnswer,
      type: {
        selected: typeof selectedOption,
        correct: typeof quiz.questions[currentQuestion].correctAnswer
      }
    });
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    answers.forEach((selectedOptionIndex, questionIndex) => {
      const question = quiz.questions[questionIndex];
      const selected = Number(selectedOptionIndex);
      const correct = Number(question.correctAnswer);
      
      console.log('Question', questionIndex, {
        selectedAnswer: selected,
        correctAnswer: correct,
        selectedText: question.options[selectedOptionIndex],
        correctText: question.options[question.correctAnswer],
        isMatch: selected === correct
      });
      
      if (selected === correct) {
        score++;
      }
    });
    return score;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quiz.questions.length) * 100;
    const timeSpent = formatTime(timer);

    // Save result to localStorage
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    results.push({
      quizId: quiz.id,
      userId: currentUser?.name || 'anonymous',
      score,
      totalQuestions: quiz.questions.length,
      timeSpent: timer,
      date: new Date().toISOString()
    });
    localStorage.setItem('quizResults', JSON.stringify(results));

    return (
      <div className="quiz-session">
        <div className="quiz-content results-screen">
          <h2>Quiz Results</h2>
          <div className="results">
            <div className="score-circle">
              <div className="score-number">{percentage.toFixed(1)}%</div>
              <div className="score-text">Score: {score} out of {quiz.questions.length}</div>
            </div>
            <div className="result-details">
              <p>Time Spent: {timeSpent}</p>
              <p>Questions Correct: {score}</p>
              <p>Total Questions: {quiz.questions.length}</p>
            </div>
          </div>
          <div className="question-review">
            {quiz.questions.map((question, index) => {
              const selectedOption = answers[index];
              const isCorrect = Number(selectedOption) === Number(question.correctAnswer);
              return (
                <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <p><strong>Question {index + 1}:</strong> {question.question}</p>
                  <p>Your Answer: {selectedOption !== undefined ? question.options[selectedOption] : 'Not answered'}</p>
                  <p>Correct Answer: {question.options[question.correctAnswer]}</p>
                </div>
              );
            })}
          </div>
          <button className="try-again-btn" onClick={onClose}>
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-session">
      <div className="quiz-content">
        <div className="quiz-header">
          <h2>{quiz.title}</h2>
          <div className="quiz-meta">
            <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>
            <p className="timer">Time: {formatTime(timer)}</p>
          </div>
        </div>

        <div className="question">
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-footer">
          <div className="progress-bar">
            <div 
              className="progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button 
            className="next-btn"
            disabled={selectedOption === null}
            onClick={handleNextQuestion}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSession;

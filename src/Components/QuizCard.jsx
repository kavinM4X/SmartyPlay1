import React from 'react';
import '../styles/QuizCard.css';

const QuizCard = ({ quiz, onTakeQuiz, onDelete, isOwner, completedInfo }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <h3>{quiz.title}</h3>
        {isOwner && onDelete && (
          <button 
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this quiz?')) {
                onDelete();
              }
            }}
          >
            ×
          </button>
        )}
      </div>
      
      <div className="quiz-card-content">
        {quiz.description && (
          <p className="description">{quiz.description}</p>
        )}
        <div className="quiz-info">
          <p>Created by: {quiz.author}</p>
          <p>Questions: {quiz.questionCount}</p>
          <p className="date">Created: {formatDate(quiz.createdAt)}</p>
          {completedInfo && (
            <div className="completion-info">
              <p className="score">Score: {completedInfo.score}%</p>
              <p className="completion-date">
                Completed: {formatDate(completedInfo.completedAt)}
              </p>
            </div>
          )}
        </div>
      </div>

      <button 
        className={`take-quiz-btn ${completedInfo ? 'completed' : ''}`}
        onClick={onTakeQuiz}
      >
        {completedInfo ? 'Retake Quiz' : 'Take Quiz'}
      </button>
    </div>
  );
};

export default QuizCard;

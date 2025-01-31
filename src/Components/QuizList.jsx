import React, { useState } from 'react';
import QuizCard from './QuizCard';
import CreateQuiz from './CreateQuiz';
import QuizSession from './QuizSession';
import '../styles/QuizList.css';

const QuizList = ({ 
  quizzes, 
  onAddQuiz, 
  onDeleteQuiz, 
  onQuizComplete,
  completedQuizzes,
  currentUser 
}) => {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'my-quizzes', 'others'

  const handleTakeQuiz = (quiz) => {
    setActiveQuiz(quiz);
  };

  const handleCreateQuiz = (newQuiz) => {
    onAddQuiz(newQuiz);
    setShowCreateQuiz(false);
  };

  const handleQuizComplete = (quizId, score) => {
    onQuizComplete(quizId, score);
    setActiveQuiz(null);
  };

  const filteredQuizzes = quizzes
    .filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (filter) {
        case 'my-quizzes':
          return matchesSearch && quiz.author === currentUser.name;
        case 'others':
          return matchesSearch && quiz.author !== currentUser.name;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <section className="quizzes-section">
        <div className="quizzes-header">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Quizzes</option>
              <option value="my-quizzes">My Quizzes</option>
              <option value="others">Other's Quizzes</option>
            </select>
          </div>
          <button 
            className="create-quiz-btn"
            onClick={() => setShowCreateQuiz(true)}
          >
            Create New Quiz
          </button>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="no-quizzes">
            <p>No quizzes found. {filter === 'my-quizzes' ? 'Create your first quiz!' : 'Try a different search term.'}</p>
          </div>
        ) : (
          <div className="quiz-grid">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onTakeQuiz={() => handleTakeQuiz(quiz)}
                onDelete={onDeleteQuiz && (() => onDeleteQuiz(quiz.id))}
                isOwner={quiz.author === currentUser.name}
                completedInfo={completedQuizzes[quiz.id]}
              />
            ))}
          </div>
        )}
      </section>

      {showCreateQuiz && (
        <CreateQuiz 
          onClose={() => setShowCreateQuiz(false)}
          onSave={handleCreateQuiz}
          currentUser={currentUser}
        />
      )}

      {activeQuiz && (
        <QuizSession
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onComplete={(score) => handleQuizComplete(activeQuiz.id, score)}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default QuizList;

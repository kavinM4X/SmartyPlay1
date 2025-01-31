import React, { useState, useEffect } from 'react';
import './styles/App.css';
import CreateQuiz from './Components/CreateQuiz';
import AdminDashboard from './Components/admin/AdminDashboard';
import { quizApi } from './services/api';

const App = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState('');

  // Load quizzes from backend on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await quizApi.getAllQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        setMessage('Failed to load quizzes. Please try again.');
      }
    };
    fetchQuizzes();
  }, []);

  // Load admin status from localStorage
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleStartQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const handleAnswer = (answer) => {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setAnswers(prev => [...prev, { 
      question: currentQuestion.question,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const handleCreateQuiz = () => {
    setShowCreateQuiz(true);
  };

  const handleQuizCreated = async (savedQuiz) => {
    try {
      // Fetch the updated list of quizzes
      const updatedQuizzes = await quizApi.getAllQuizzes();
      setQuizzes(updatedQuizzes);
      
      // Hide the create quiz form
      setShowCreateQuiz(false);
      
      // Show success message
      setMessage('Quiz created successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating quiz list:', error);
    }
  };

  const handleSaveQuiz = async (newQuiz) => {
    try {
      const quizToSave = {
        ...newQuiz,
        author: isAdmin ? "Admin" : "User",
        status: isAdmin ? "active" : "pending",
        questions: newQuiz.questions.map((q, index) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.options[parseInt(q.correctAnswer)]
        }))
      };

      // Save quiz to backend
      const savedQuiz = await quizApi.createQuiz(quizToSave);
      
      // Update local state with the saved quiz
      handleQuizCreated(savedQuiz);
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz. Please try again.');
    }
  };

  const handleUpdateQuiz = async (updatedQuiz) => {
    try {
      // Update quiz in backend
      const updatedQuizResponse = await quizApi.updateQuiz(updatedQuiz);
      
      // Update local state with the updated quiz
      setQuizzes(prevQuizzes => prevQuizzes.map(quiz => quiz.id === updatedQuiz.id ? updatedQuizResponse : quiz));
    } catch (error) {
      console.error('Failed to update quiz:', error);
      alert('Failed to update quiz. Please try again.');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  // Filter quizzes based on status
  const activeQuizzes = quizzes.filter(quiz => quiz.status === 'active');

  const renderCreateQuiz = () => (
    <div className="modal">
      <div className="modal-content">
        <CreateQuiz 
          onSave={handleQuizCreated}
          onClose={() => setShowCreateQuiz(false)}
        />
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <AdminDashboard 
        quizzes={quizzes}
        setQuizzes={setQuizzes}
        onLogout={handleAdminLogout}
        onUpdateQuiz={handleUpdateQuiz}
      />
    );
  }

  return (
    <div className="app-container">
      {message && (
        <div className={`message ${message.includes('Error') || message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      {showAdminLogin && (
        <div className="admin-login-modal">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="button-group">
                <button type="button" onClick={() => setShowAdminLogin(false)}>Cancel</button>
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCreateQuiz ? (
        renderCreateQuiz()
      ) : !currentQuiz ? (
        <>
          <div className="welcome-section">
            <h1>Welcome to Programming Quiz!</h1>
            <p>Test your programming knowledge with our curated quizzes</p>
            <div className="welcome-buttons">
              <button className="create-quiz-btn" onClick={handleCreateQuiz}>
                Create New Quiz
              </button>
              <button className="admin-login-btn" onClick={() => setShowAdminLogin(true)}>
                Admin Login
              </button>
            </div>
          </div>
          <div className="quiz-list">
            {activeQuizzes.length === 0 ? (
              <p className="no-quizzes">No active quizzes available. Create one or wait for admin approval.</p>
            ) : (
              activeQuizzes.map(quiz => (
                <div key={quiz.id} className="quiz-card">
                  <h2>{quiz.title}</h2>
                  <p>{quiz.questions.length} questions</p>
                  <p className="quiz-author">By: {quiz.author}</p>
                  <button onClick={() => handleStartQuiz(quiz)}>Start Quiz</button>
                </div>
              ))
            )}
          </div>
        </>
      ) : showResults ? (
        <div className="results-container">
          <h2>Quiz Results</h2>
          <div className="final-score">
            Score: {score} out of {currentQuiz.questions.length}
          </div>
          <div className="answers-review">
            {answers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <p><strong>Question:</strong> {answer.question}</p>
                <p><strong>Your Answer:</strong> {answer.userAnswer}</p>
                {!answer.isCorrect && (
                  <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleRestartQuiz} className="restart-btn">
            Try Another Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h2>{currentQuiz.title}</h2>
          <div className="question-card">
            <h3>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</h3>
            <p>{currentQuestion.question}</p>
            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="score">
            Score: {score}/{currentQuestionIndex + 1}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import './styles/QuizManager.css';

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'JavaScript Basics', author: 'John', status: 'active', participants: 45 },
    { id: 2, title: 'HTML & CSS', author: 'Sarah', status: 'active', participants: 32 },
    { id: 3, title: 'Python Programming', author: 'Mike', status: 'draft', participants: 0 },
  ]);

  const [newQuiz, setNewQuiz] = useState({ title: '', author: '', status: 'draft' });

  const handleAddQuiz = (e) => {
    e.preventDefault();
    setQuizzes([
      ...quizzes,
      {
        id: quizzes.length + 1,
        ...newQuiz,
        participants: 0,
      },
    ]);
    setNewQuiz({ title: '', author: '', status: 'draft' });
  };

  const handleDeleteQuiz = (id) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === id ? { ...quiz, status: newStatus } : quiz
    ));
  };

  return (
    <div className="quiz-manager">
      <h2>Quiz Management</h2>
      
      <div className="quiz-form">
        <h3>Add New Quiz</h3>
        <form onSubmit={handleAddQuiz}>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={newQuiz.author}
            onChange={(e) => setNewQuiz({ ...newQuiz, author: e.target.value })}
            required
          />
          <select
            value={newQuiz.status}
            onChange={(e) => setNewQuiz({ ...newQuiz, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
          <button type="submit">Add Quiz</button>
        </form>
      </div>

      <div className="quiz-list">
        <h3>Existing Quizzes</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Participants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td>{quiz.title}</td>
                <td>{quiz.author}</td>
                <td>
                  <select
                    value={quiz.status}
                    onChange={(e) => handleStatusChange(quiz.id, e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td>{quiz.participants}</td>
                <td>
                  <button onClick={() => handleDeleteQuiz(quiz.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizManager;

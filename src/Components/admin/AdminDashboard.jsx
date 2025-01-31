// Import required React hooks and CSS
import React, { useState, useEffect } from 'react';
import { quizApi } from '../../services/api';
import './styles/AdminDashboard.css';

// Main AdminDashboard component
const AdminDashboard = ({ quizzes, setQuizzes, onLogout }) => {
  // State to track which tab is currently active
  const [currentTab, setCurrentTab] = useState('quizzes');
  const [loading, setLoading] = useState(true);
  const [updatingQuizId, setUpdatingQuizId] = useState(null);

  // Load quizzes from API when component mounts
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const fetchedQuizzes = await quizApi.getAllQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [setQuizzes]);

  // Function to update quiz status
  const updateQuizStatus = async (quizId, newStatus) => {
    if (!quizId) {
      console.error('Quiz ID is undefined');
      return;
    }

    try {
      setUpdatingQuizId(quizId);

      // Update quiz status in backend
      const response = await quizApi.updateQuiz(quizId, { status: newStatus });

      // Update local state with the response from server
      setQuizzes(prevQuizzes => 
        prevQuizzes.map(quiz => 
          quiz._id === quizId ? response : quiz
        )
      );
    } catch (error) {
      console.error('Failed to update quiz status:', error);
      // Refresh quiz list to ensure UI shows correct state
      try {
        const fetchedQuizzes = await quizApi.getAllQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (refreshError) {
        console.error('Failed to refresh quizzes:', refreshError);
      }
    } finally {
      setUpdatingQuizId(null);
    }
  };

  // Function to delete a quiz
  const deleteQuiz = async (quizId) => {
    if (!quizId) {
      console.error('Quiz ID is undefined');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmed) return;

    try {
      await quizApi.deleteQuiz(quizId);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
    } catch (error) {
      console.error('Failed to delete quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  // Calculate dashboard statistics
  const getDashboardStats = () => ({
    total: quizzes.length,
    active: quizzes.filter(q => q.status === 'active').length,
    inactive: quizzes.filter(q => q.status === 'inactive').length,
    questions: quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)
  });

  // Render quiz list
  const renderQuizList = () => (
    <div className="quiz-list">
      <h2>Manage Quizzes</h2>
      <table>
        <thead>
          <tr>
            <th>Quiz Title</th>
            <th>Questions</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map(quiz => (
            <tr key={quiz._id}>
              <td>{quiz.title}</td>
              <td>{quiz.questions.length}</td>
              <td>
                <select
                  value={quiz.status || 'active'}
                  onChange={(e) => updateQuizStatus(quiz._id, e.target.value)}
                  disabled={updatingQuizId === quiz._id}
                  className={`status-${quiz.status || 'active'}`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td>
                <button 
                  onClick={() => deleteQuiz(quiz._id)}
                  className="delete-btn"
                  disabled={updatingQuizId === quiz._id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <nav>
        <button 
          onClick={() => setCurrentTab('quizzes')}
          className={currentTab === 'quizzes' ? 'active' : ''}
        >
          Quizzes
        </button>
        <button 
          onClick={() => setCurrentTab('stats')}
          className={currentTab === 'stats' ? 'active' : ''}
        >
          Statistics
        </button>
      </nav>

      <main className="dashboard-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          currentTab === 'quizzes' ? renderQuizList() : (
            <div className="dashboard-stats">
              <h2>Statistics</h2>
              <div className="stats-grid">
                {Object.entries(getDashboardStats()).map(([key, value]) => (
                  <div key={key} className="stat-box">
                    <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

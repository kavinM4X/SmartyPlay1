import React from 'react';
import './styles/Statistics.css';

const Statistics = () => {
  // Mock data for statistics
  const stats = {
    totalUsers: 156,
    totalQuizzes: 25,
    activeQuizzes: 18,
    completedQuizzes: 432,
    averageScore: 78.5,
    monthlyActivity: [
      { month: 'Jan', quizzes: 45 },
      { month: 'Feb', quizzes: 52 },
      { month: 'Mar', quizzes: 48 },
      { month: 'Apr', quizzes: 65 },
    ],
  };

  return (
    <div className="statistics">
      <h2>Dashboard Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p className="stat-number">{stats.totalQuizzes}</p>
        </div>
        <div className="stat-card">
          <h3>Active Quizzes</h3>
          <p className="stat-number">{stats.activeQuizzes}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Quizzes</h3>
          <p className="stat-number">{stats.completedQuizzes}</p>
        </div>
      </div>

      <div className="detailed-stats">
        <div className="performance-stats">
          <h3>Quiz Performance</h3>
          <div className="stat-row">
            <span>Average Score:</span>
            <span>{stats.averageScore}%</span>
          </div>
          <div className="stat-row">
            <span>Completion Rate:</span>
            <span>{((stats.completedQuizzes / (stats.totalUsers * stats.totalQuizzes)) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="monthly-activity">
          <h3>Monthly Activity</h3>
          <div className="activity-chart">
            {stats.monthlyActivity.map((month) => (
              <div key={month.month} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ height: `${(month.quizzes / 65) * 100}%` }}
                >
                  <span className="quiz-count">{month.quizzes}</span>
                </div>
                <span className="month">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

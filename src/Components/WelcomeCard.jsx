import React from 'react';
import '../styles/WelcomeCard.css';

const WelcomeCard = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = () => {
    // Here you would typically handle authentication
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="welcome-card">
      <h2>Your Ultimate Quiz Platform</h2>
      <p>Create, share, and take quizzes on any topic. Test your knowledge and challenge your friends!</p>
      <button className="login-button" onClick={handleLogin}>
        {isLoggedIn ? 'Logout' : 'Login to Start'}
      </button>
    </div>
  );
};

export default WelcomeCard;

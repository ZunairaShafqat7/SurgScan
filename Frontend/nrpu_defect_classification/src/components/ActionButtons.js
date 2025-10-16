import React from 'react';
import './ActionButtons.css';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegisterClick = () => {
    navigate('/register/'); // Use navigate to change routes
  };

  return (
    <div className="action">
      <button type="button" className="link" onClick={handleRegisterClick}>
        Register
      </button>
      <input type="submit" id="submit-btn" value="Sign in" />
    </div>
  );
};

export default ActionButtons;

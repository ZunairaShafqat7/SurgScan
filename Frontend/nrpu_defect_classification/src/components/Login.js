import React from 'react';
import './Login.css';

const Login = () => {
  const handleRegisterClick = () => {
    window.location.href = '/register/';
  };

  return (
    <div className="login-form">
      <h1>Surg Scan</h1>
      <form id="formlogin" method="POST" action="/">
        <div className="content">
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Email" name="email" required />
          </div>
          <div className="input-field">
            <input type="password" placeholder="Password" name="password" required />
          </div>
          <a href="#" className="link">Forgot Your Password?</a>
        </div>
        <div className="action">
          <button type="button" className="link" onClick={handleRegisterClick}>
            Register
          </button>
          <input type="submit" id="submit-btn" value="Sign in" />
        </div>
      </form>
    </div>
  );
};

export default Login;

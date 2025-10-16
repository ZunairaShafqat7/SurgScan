import React from 'react';
import './RegisterFormContainer.css';

const RegisterFormContainer = ({ children }) => {
  return (
    <div className="register-form">
      {children}
    </div>
  );
};

export default RegisterFormContainer;

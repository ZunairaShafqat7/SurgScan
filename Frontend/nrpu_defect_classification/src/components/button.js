import React from 'react';
import './button.css'; // Ensure Button styles are defined

const Button = ({ label, onClick, type, className }) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;

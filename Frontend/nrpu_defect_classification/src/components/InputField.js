import React from 'react';
import './InputField.css';

const InputField = ({ type, placeholder, value, onChange, accept, required }) => {
  return (
    <div className="input-field">
      {type === 'file' ? (
        <input
          type={type}
          onChange={onChange}
          accept={accept}
          required={required}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;

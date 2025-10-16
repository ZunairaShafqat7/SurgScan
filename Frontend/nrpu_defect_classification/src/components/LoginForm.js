import React, { useState } from 'react';
import './LoginForm.css';
import LoginHeader from './LoginHeader';
import InputField from './InputField';
import ErrorMessage from './ErrorMessage';
import Button from './button';
import { Layout } from './login/layout';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';

const LoginForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegisterClick = () => {
    const status = 'user'
    navigate('/register/', { state: { status } }); // Use navigate to change routes
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        

        // Navigate with state
        if (data.status === 'admin') {
          // const userDetails = {
          //   name: data.name,
          //   email: data.email,
          //   number: data.number,
          //   pictureUrl: data.picture_url,
          //   designation: data.designation,
          //   contact: data.contact,
          //   total_users: data.total_users,
          //   total_batches: data.total_batches,
          //   inprogress_batches: data.inprogress_batches,
          //   completed_batches: data.completed_batches,
          // };
          const userDetails = {
            name: data.name,
            id: data.id,
            email: data.email,
            number: data.number,
            status: data.status,
            pictureUrl: data.picture_url,
            date: data.created_at_date,
            time: data.created_at_time,
            batchDetails: data.batch_details,
          };
          navigate('/admin-dashboard/', { state: { userDetails } });
        } else if (data.status === 'user') {
          const userDetails = {
            name: data.name,
            id: data.id,
            email: data.email,
            number: data.number,
            status: data.status,
            pictureUrl: data.picture_url,
            date: data.created_at_date,
            time: data.created_at_time,
            batchDetails: data.batch_details,
          };
          navigate('/user-dashboard/', { state: { userDetails } });
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <Layout>
    <div className="login-form">
      <LoginHeader />
      <form onSubmit={handleSubmit}>
            <div className="content">
                    <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <OutlinedInput
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label="Email Address"
                      error={Boolean(message)} // Optional: Change based on your validation error
                    />
                    {/* {message && <FormHelperText error>{message}</FormHelperText>} */}
                  </FormControl>



                  {/* <div className="input-field">
                        <label htmlFor="email">Email:</label>
                        <InputField
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                  </div> */}
                  {/* Password Field */}
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                      error={Boolean(message)}
                    />
                  </FormControl>

                  {/* <div className="input-field">
                        <label htmlFor="password">Password:</label>
                        <InputField
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                    </div> */}
              {message && <FormHelperText error>{message}</FormHelperText>}
              {/* {message && <ErrorMessage message={message} />} */}
              <a href="#" className="link">Forgot Your Password?</a>
            </div>
            <div className='action'>  
              <Button label="Login" onClick={handleSubmit} className="primary" />
              <Button label="Register" onClick={handleRegisterClick} className="primary" />
            </div>
      </form>
    </div>
    </Layout>
  );
};

export default LoginForm;

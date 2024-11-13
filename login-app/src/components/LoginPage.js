import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic regex for email validation
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;  // Minimum password length of 6 characters
  };

  const handleValidation = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!handleValidation()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Login successful!');
        // Handle successful login (e.g., redirect, store token, etc.)
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!handleValidation()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Sign-Up successful! You can now log in.');
        setIsSignup(false); // Switch to login form after successful sign-up
      } else {
        setError(data.message || 'Sign-Up failed');
      }
    } catch (error) {
      setError('An error occurred during sign-up. Please try again.');
    }
  };

  const toggleForm = () => {
    setError(''); // Clear any errors
    setIsSignup(!isSignup);
  };

  return (
    <div className="login-container">
      {!isSignup ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
          <p>
            Don't have an account?{' '}
            <span className="toggle-link" onClick={toggleForm}>
              Sign Up
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="signup-form">
          <h2>Sign Up</h2>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{' '}
            <span className="toggle-link" onClick={toggleForm}>
              Login
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

export default LoginPage;

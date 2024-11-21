// src/components/UserProfileSetup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileSetup.css';

function UserProfileSetup() {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProfileSetup = async (event) => {
    event.preventDefault();

    if (!age || !sex || !height || !weight) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age, sex, height, weight }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Profile setup successful!');
        navigate('/landing'); // Redirect to landing page
      } else {
        setError(data.message || 'Profile setup failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="profile-setup-container">
      <form onSubmit={handleProfileSetup} className="profile-setup-form">
        <h2>Profile Setup</h2>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <input
            type="text"
            id="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (cm):</label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UserProfileSetup;
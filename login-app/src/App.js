import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import UserProfileSetup from './components/UserProfileSetup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/profile-setup" element={<UserProfileSetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

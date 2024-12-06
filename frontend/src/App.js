import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/loginPage';
import UserStatForm from './components/UserStatForm';
import LandingPage from './components/LandingPage';
import UserSettings from './components/UserSettings';
import About from './components/AboutPage';
import MedicationHistory from './components/MedicationHistory';
import SetReminder from './components/SetReminder';
import EditMedication from './components/EditMedication';
import MedicationDetails from './components/MedicationDetails';

function App() {
  const userId = 1; // Replace with the actual user ID

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/user-stats" element={<UserStatForm />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/user-settings" element={<UserSettings />} />
          <Route path="/about" element={<About />} />
          <Route path="/medication-history" element={<MedicationHistory userId={userId} />} />
          <Route path="/set-reminder" element={<SetReminder />} />
          <Route path="/edit-medication" element={<EditMedication />} />
          <Route path="/medication-details" element={<MedicationDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
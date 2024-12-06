// frontend/src/components/LandingPage.js
import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 5000); // Hide the popup after 5 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <div className="landing-page">
            {showPopup && (
                <div className="landing-page-popup">
                    <h1>Welcome to Xcript</h1>
                    <p>Your user statistics have been successfully submitted.</p>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
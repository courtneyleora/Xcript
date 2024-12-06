import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showPopup, setShowPopup] = useState(true);

    const carouselSlides = [
        {
            title: 'Medications',
            description: 'Add details about medications, including name, dosage, and side effects.',
            fields: ['Name', 'Dosage', 'Prescribed Frequency', 'Ingredient List', 'Uses', 'Side Effects'],
        },
        {
            title: 'Prescriptions',
            description: 'Manage prescriptions with details like start date, end date, and reminder time.',
            fields: ['User ID', 'Medication ID', 'Start Date', 'End Date', 'Reminder Time', 'Goals'],
        },
        {
            title: 'Educational Facts',
            description: 'Add facts related to medications to help users understand their treatments better.',
            fields: ['Medication ID', 'Fact Detail'],
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 5000); // Hide the popup after 5 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="landing-page">
            <header>
                <div className="header-left">
                    <h1 className="page-title">Xcript</h1>
                </div>
                <nav className="header-right">
                    <ul>
                        <li>
                            <div className="dropdown">
                                <button className="dropbtn">Menu</button>
                                <div className="dropdown-content">
                                    <Link to="/user-settings">User Settings</Link>
                                    <Link to="/about">About</Link>
                                    <Link to="/medication-history">Medication History</Link>
                                    <Link to="/set-reminder">Set Reminder</Link>
                                    <Link to="/edit-medication">Edit Medication</Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>

            {showPopup && (
                <div className="landing-page-popup">
                    <h2>Welcome to Xcript</h2>
                    <p>Your user statistics have been successfully submitted.</p>
                </div>
            )}

            <div className="carousel">
                <button className="carousel-button prev" onClick={prevSlide}>
                    &lt;
                </button>

                <div className="carousel-slide">
                    <h2>{carouselSlides[currentSlide].title}</h2>
                    <p>{carouselSlides[currentSlide].description}</p>
                    <form>
                        {carouselSlides[currentSlide].fields.map((field, index) => (
                            <div className="form-group" key={index}>
                                <label>{field}</label>
                                <input type="text" placeholder={`Enter ${field}`} />
                            </div>
                        ))}
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>

                <button className="carousel-button next" onClick={nextSlide}>
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default LandingPage;

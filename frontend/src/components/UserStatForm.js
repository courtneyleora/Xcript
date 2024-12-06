import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserStatForm.css';

const UserStatForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || {};

    const [formData, setFormData] = useState({
        heightFeet: '',
        heightInches: '',
        weight: '',
        age: '',
        illnesses: '',
        background: '',
        sex: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine height in feet and inches into a single value
        const height = parseInt(formData.heightFeet || 0) * 12 + parseInt(formData.heightInches || 0);

        const userStatData = {
            user_id: user.user_id,
            height,
            weight: parseFloat(formData.weight),
            age: parseInt(formData.age),
            illnesses: formData.illnesses,
            background: formData.background,
            sex: formData.sex
        };

        try {
            const response = await fetch('http://localhost:5000/user_stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userStatData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('User statistics added successfully!');
                navigate('/landing'); // Navigate to the landing page
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit user statistics.');
        }
    };

    return (
        <div className="user-stat-form">
            <h2>Enter User Statistics</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Height:
                    <div className="height-input">
                        <input
                            type="number"
                            name="heightFeet"
                            placeholder="Feet"
                            value={formData.heightFeet}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="heightInches"
                            placeholder="Inches"
                            value={formData.heightInches}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </label>
                <label>
                    Weight (in pounds):
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Age:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Illnesses (if any):
                    <textarea
                        name="illnesses"
                        value={formData.illnesses}
                        onChange={handleChange}
                    ></textarea>
                </label>
                <label>
                    Background (e.g., smoker, athlete, etc.):
                    <input
                        type="text"
                        name="background"
                        value={formData.background}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Sex:
                    <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default UserStatForm;

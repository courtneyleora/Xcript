// frontend/src/components/UserSettings.js
import React, { useState, useEffect } from 'react';
import './UserSettings.css';

const UserSettings = () => {
    const [userStats, setUserStats] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        heightFeet: '',
        heightInches: '',
        weight: '',
        age: '',
        illnesses: '',
        background: '',
        sex: ''
    });

    useEffect(() => {
        // Fetch user stats from the server
        const fetchUserStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/user_stats');
                const data = await response.json();
                setUserStats(data);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combine height in feet and inches into a single value
        const height = parseInt(formData.heightFeet || 0) * 12 + parseInt(formData.heightInches || 0);

        const userStatData = {
            userId: formData.userId,
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
                setFormData({
                    userId: '',
                    heightFeet: '',
                    heightInches: '',
                    weight: '',
                    age: '',
                    illnesses: '',
                    background: '',
                    sex: ''
                });
                setUserStats([...userStats, result]);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit user statistics.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Combine height in feet and inches into a single value
        const height = parseInt(formData.heightFeet || 0) * 12 + parseInt(formData.heightInches || 0);

        const userStatData = {
            userId: formData.userId,
            height,
            weight: parseFloat(formData.weight),
            age: parseInt(formData.age),
            illnesses: formData.illnesses,
            background: formData.background,
            sex: formData.sex
        };

        try {
            const response = await fetch(`http://localhost:5000/user_stats/${formData.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userStatData),
            });
            const result = await response.json();
            if (response.ok) {
                alert('User statistics updated successfully!');
                setUserStats(userStats.map(stat => (stat.userId === formData.userId ? result : stat)));
                setFormData({
                    userId: '',
                    heightFeet: '',
                    heightInches: '',
                    weight: '',
                    age: '',
                    illnesses: '',
                    background: '',
                    sex: ''
                });
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update user statistics.');
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/user_stats/${userId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setUserStats(userStats.filter(stat => stat.userId !== userId));
                alert('User statistics deleted successfully!');
            } else {
                alert('Failed to delete user statistics.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete user statistics.');
        }
    };

    const handleEdit = (stat) => {
        setFormData({
            userId: stat.userId,
            heightFeet: Math.floor(stat.height / 12),
            heightInches: stat.height % 12,
            weight: stat.weight,
            age: stat.age,
            illnesses: stat.illnesses,
            background: stat.background,
            sex: stat.sex
        });
    };

    return (
        <div className="user-settings">
            <h2>User Settings</h2>
            <form onSubmit={formData.userId ? handleUpdate : handleSubmit}>
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
                <button type="submit">{formData.userId ? 'Update' : 'Submit'}</button>
            </form>

            <h3>Existing User Statistics</h3>
            <ul>
                {userStats.map(stat => (
                    <li key={stat.userId}>
                        <p>Height: {stat.height} inches</p>
                        <p>Weight: {stat.weight} lbs</p>
                        <p>Age: {stat.age}</p>
                        <p>Illnesses: {stat.illnesses}</p>
                        <p>Background: {stat.background}</p>
                        <p>Sex: {stat.sex}</p>
                        <button onClick={() => handleEdit(stat)}>Edit</button>
                        <button onClick={() => handleDelete(stat.userId)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSettings;
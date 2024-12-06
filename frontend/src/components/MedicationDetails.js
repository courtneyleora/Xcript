import React, { useState, useEffect } from 'react';

const SetReminder = ({ prescriptionId }) => {
    const [reminderTime, setReminderTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/reminders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prescription_id: prescriptionId, reminder_time: reminderTime }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Reminder Time:</label>
            <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
            />
            <button type="submit">Set Reminder</button>
        </form>
    );
};

const MedicationDetails = () => {
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            const response = await fetch('/medications');
            const data = await response.json();
            setMedications(data);
        };

        fetchMedications();
    }, []);

    return (
        <div>
            <h2>Medication Details</h2>
            <ul>
                {medications.map((medication, index) => (
                    <li key={index}>
                        <h3>{medication.name}</h3>
                        <p>Dosage: {medication.dosage} mg</p>
                        <p>Prescribed Frequency: {medication.prescribed_frequency}</p>
                        <p>Ingredients: {medication.ingredient_list}</p>
                        <p>Uses: {medication.uses}</p>
                        <p>Side Effects: {medication.side_effects}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicationDetails;

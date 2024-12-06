import React, { useState } from 'react';

const SetReminder = ({ prescriptionId }) => {
    const [reminderTime, setReminderTime] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/reminders', {
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

export default SetReminder;
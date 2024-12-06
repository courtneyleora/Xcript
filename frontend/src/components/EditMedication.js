import React, { useState, useEffect } from 'react';

const EditMedication = ({ prescriptionId }) => {
    const [formData, setFormData] = useState({
        medication_id: '',
        start_date: '',
        end_date: '',
        reminder_time: '',
        goals: ''
    });

    useEffect(() => {
        const fetchMedication = async () => {
            const response = await fetch(`/medications/${prescriptionId}`);
            const data = await response.json();
            setFormData(data);
        };

        fetchMedication();
    }, [prescriptionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`/medications/${prescriptionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        alert(data.message);
    };

    const handleDelete = async () => {
        const response = await fetch(`/medications/${prescriptionId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Medication ID:</label>
            <input
                type="text"
                name="medication_id"
                value={formData.medication_id}
                onChange={handleChange}
                required
            />
            <label>Start Date:</label>
            <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
            />
            <label>End Date:</label>
            <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
            />
            <label>Reminder Time:</label>
            <input
                type="time"
                name="reminder_time"
                value={formData.reminder_time}
                onChange={handleChange}
                required
            />
            <label>Goals:</label>
            <input
                type="text"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
            />
            <button type="submit">Update Medication</button>
            <button type="button" onClick={handleDelete}>Delete Medication</button>
        </form>
    );
};

export default EditMedication;
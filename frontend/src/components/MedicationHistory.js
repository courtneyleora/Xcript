import React, { useEffect, useState } from 'react';
import './MedicationHistory.css';

const MedicationHistory = () => {
    const [medications, setMedications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await fetch('/medications');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch medications: ${errorText}`);
                }
                const data = await response.json();
                setMedications(data);
            } catch (error) {
                console.error('Error fetching medications:', error);
                setError('Failed to load medication history. Please try again later.');
            }
        };

        fetchMedications();
    }, []);

    return (
        <div className="medication-history-container">
            <h1>Medication History</h1>
            {error && <div className="error-message">{error}</div>}
            {!error && medications.length === 0 && <p>Loading medications...</p>}
            {!error && medications.length > 0 && (
                <table className="medication-history-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Dosage (mg)</th>
                            <th>Prescribed Frequency</th>
                            <th>Ingredients</th>
                            <th>Uses</th>
                            <th>Side Effects</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((medication) => (
                            <tr key={medication.medication_id}>
                                <td>{medication.name}</td>
                                <td>{medication.dosage}</td>
                                <td>{medication.prescribed_frequency}</td>
                                <td>{medication.ingredient_list}</td>
                                <td>{medication.uses}</td>
                                <td>{medication.side_effects}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MedicationHistory;

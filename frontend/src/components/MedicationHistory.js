import React, { useEffect, useState } from 'react';

const MedicationHistory = ({ userId }) => {
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await fetch(`/medication-history/${userId}`);
                const data = await response.json();
                setMedications(data);
            } catch (error) {
                console.error('Error fetching medication history:', error);
            }
        };

        fetchMedications();
    }, [userId]);

    return (
        <div>
            <h2>Medication History</h2>
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

export default MedicationHistory;

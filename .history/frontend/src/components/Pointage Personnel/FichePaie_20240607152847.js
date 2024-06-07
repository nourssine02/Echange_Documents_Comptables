// src/components/FichePaie.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FichePaie = () => {
    const [slips, setSlips] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/-slips');
                setSlips(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Salary Slips</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date de Saisie</th>
                        <th>Code Tiers</th>
                        <th>Nbre Jours Travailles1</th>
                        <th>Nbre Jours Travailles2</th>
                        <th>Nbre Jours Absence1</th>
                        <th>Nbre Jours Absence2</th>
                        <th>Nbre Jours Conges1</th>
                        <th>Nbre Jours Conges2</th>
                        <th>Supplement Recus</th>
                        <th>Sommes Rejetees</th>
                        <th>Remboursement Divers</th>
                        <th>Autre Deduction</th>
                        <th>Observations</th>
                    </tr>
                </thead>
                <tbody>
                    {slips.map((slip) => (
                        <tr key={slip.id}>
                            <td>{slip.date_de_saisie}</td>
                            <td>{slip.code_tiers}</td>
                            <td>{slip.nbre_jours_travailles1}</td>
                            <td>{slip.nbre_jours_travailles2}</td>
                            <td>{slip.nbre_jours_absence1}</td>
                            <td>{slip.nbre_jours_absence2}</td>
                            <td>{slip.nbre_jours_conges1}</td>
                            <td>{slip.nbre_jours_conges2}</td>
                            <td>{slip.supplement_recus}</td>
                            <td>{slip.sommes_rejetees}</td>
                            <td>{slip.remboursement_divers}</td>
                            <td>{slip.autre_deduction}</td>
                            <td>{slip.observations}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FichePaie;

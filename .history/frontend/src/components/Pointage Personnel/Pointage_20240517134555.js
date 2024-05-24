// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [formData, setFormData] = useState({
        date_de_saisie: '',
        code_tiers: '',
        nbre_jours_travailles1: '',
        nbre_jours_travailles2: '',
        nbre_jours_absence1: '',
        nbre_jours_absence2: '',
        nbre_jours_conges1: '',
        nbre_jours_conges2: '',
        supplement_recus: '',
        sommes_rejetees: '',
        remboursement_divers: '',
        autre_deduction: '',
        observations: ''
    });

    const [personnelRecords, setPersonnelRecords] = useState([]);
    const [searchCodeTiers, setSearchCodeTiers] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/personnel', formData)
            .then(response => {
                alert('Record added successfully!');
            })
            .catch(error => {
                console.error('There was an error adding the record!', error);
            });
    };

    const handleSearchChange = (e) => {
        setSearchCodeTiers(e.target.value);
    };

    const fetchRecords = () => {
        axios.get(`http://localhost:5000/api/personnel/${searchCodeTiers}`)
            .then(response => {
                setPersonnelRecords(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the records!', error);
            });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Personnel Time Tracking</h1>
            
            <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-3">
                    <label>Date de Saisie:</label>
                    <input type="date" name="date_de_saisie" value={formData.date_de_saisie} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Code Tiers:</label>
                    <input type="text" name="code_tiers" value={formData.code_tiers} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours Travaillés 1:</label>
                    <input type="number" name="nbre_jours_travailles1" value={formData.nbre_jours_travailles1} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours Travaillés 2:</label>
                    <input type="number" name="nbre_jours_travailles2" value={formData.nbre_jours_travailles2} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours d'Absence 1:</label>
                    <input type="number" name="nbre_jours_absence1" value={formData.nbre_jours_absence1} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours d'Absence 2:</label>
                    <input type="number" name="nbre_jours_absence2" value={formData.nbre_jours_absence2} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours de Congés 1:</label>
                    <input type="number" name="nbre_jours_conges1" value={formData.nbre_jours_conges1} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Nombre de Jours de Congés 2:</label>
                    <input type="number" name="nbre_jours_conges2" value={formData.nbre_jours_conges2} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Supplement Reçus:</label>
                    <input type="number" name="supplement_recus" value={formData.supplement_recus} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Sommes Rejetées:</label>
                    <input type="number" name="sommes_rejetees" value={formData.sommes_rejetees} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Remboursement Divers:</label>
                    <input type="number" name="remboursement_divers" value={formData.remboursement_divers} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Autre Déduction:</label>
                    <input type="number" name="autre_deduction" value={formData.autre_deduction} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label>Observations:</label>
                    <textarea name="observations" value={formData.observations} onChange={handleChange} className="form-control"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            
            <div className="mb-5">
                <h2>Search Personnel Records</h2>
                <div className="input-group mb-3">
                    <input type="text" value={searchCodeTiers} onChange={handleSearchChange} className="form-control" placeholder="Enter Code Tiers" />
                    <button className="btn btn-outline-secondary" onClick={fetchRecords}>Search</button>
                </div>
            </div>

            <div>
                <h2>Personnel Records</h2>
                {personnelRecords.length > 0 ? (
                    <table className="table table-responsive table-striped">
                        <thead>
                            <tr>
                                <th>Date de Saisie</th>
                                <th>Code Tiers</th>
                                <th>Jours Travaillés 1</th>
                                <th>Jours Travaillés 2</th>
                                <th>Jours d'Absence 1</th>
                                <th>Jours d'Absence 2</th>
                                <th>Jours de Congés 1</th>
                                <th>Jours de Congés 2</th>
                                <th>Supplement Reçus</th>
                                <th>Sommes Rejetées</th>
                                <th>Remboursement Divers</th>
                                <th>Autre Déduction</th>
                                <th>Observations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personnelRecords.map(record => (
                                <tr key={record.id}>
                                    <td>{record.date_de_saisie}</td>
                                    <td>{record.code_tiers}</td>
                                    <td>{record.nbre_jours_travailles1}</td>
                                    <td>{record.nbre_jours_travailles2}</td>
                                    <td>{record.nbre_jours_absence1}</td>
                                    <td>{record.nbre_jours_absence2}</td>
                                    <td>{record.nbre_jours_conges1}</td>
                                    <td>{record.nbre_jours_conges2}</td>
                                    <td>{record.supplement_recus}</td>
                                    <td>{record.sommes_rejetees}</td>
                                    <td>{record.remboursement_divers}</td>
                                    <td>{record.autre_deduction}</td>
                                    <td>{record.observations}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No records found.</p>
                )}
            </div>
        </div>
    );
}

export default Pointa;

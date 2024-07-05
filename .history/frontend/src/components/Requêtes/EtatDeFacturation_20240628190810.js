import React, { useState } from 'react';
import axios from 'axios';
 
const EtatDeFacturation = ({isSidebarOpen}) => {
  const [totalCA, setTotalCA] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchTotalCA = async () => {
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner les dates de début et de fin.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('La date de début ne peut pas être supérieure à la date de fin.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/etat-de-facturation', {
        params: { startDate, endDate }
      });
      setTotalCA(response.data[0]?.totalCA || 0);
      setError('');
    } catch (error) {
      console.error('Error fetching total CA', error);
      setError('Une erreur est survenue lors de la récupération du chiffre d\'affaires total.');
    }
  };

  return (
    <div className="main-panel">
    <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">État de Facturation par Période</h2>
      <input
        className="form-control-group"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      &nbsp;
      <input
        className="form-control-group"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      &nbsp;
      <button className="btn btn-behance btn-sm" onClick={fetchTotalCA}>
        Récupérer le CA
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <br />
      <h3>Total Chiffre d'Affaires: {totalCA}</h3>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default EtatDeFacturation;

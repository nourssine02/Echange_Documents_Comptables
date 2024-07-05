import React, { useState } from 'react';
import axios from 'axios';

const EtatDeFacturation = () => {
  const [totalCA, setTotalCA] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchTotalCA = async () => {
    try {
      const response = await axios.get('http://localhost:5000/etat-de-facturation', {
        params: { startDate, endDate }
      });
      setTotalCA(response.data[0].totalCA || 0);
      setError('');
    } catch (error) {
      console.error('Error fetching total CA', error);
      setError('An error occurred while fetching the total CA.');
    }
  };

  return (
    <div>
      <h3>État de Facturation par Période</h3>
      <input
        className="form-control-lg"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      &nbsp;
      <input
        className="form-control-lg"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      &nbsp;
      <button className="btn btn-dribbble" onClick={fetchTotalCA}>
        Fetch Total CA
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <br />
      <h3>Total Chiffre d'Affaires: {totalCA}</h3>
    </div>
  );
};

export default EtatDeFacturation;

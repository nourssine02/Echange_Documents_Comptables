import React, { useState } from 'react';
import axios from 'axios';

const TotalCommandesParPeriode = () => {
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const fetchTotal = async () => {
    try {
      const response = await axios.get('http://localhost:5000/total-commandes-par-periode', {
        params: { startDate, endDate }
      });
      if (response.data.length > 0) {
        setTotal(response.data[0].total);
      } else {
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching total commandes', error);
      setError('An error occurred while fetching the total commandes.');
    }
  };

  return (
    <div className="main-panel">
    <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
      <h3>Total des Commandes par Période</h3>
      <input
        className="form-control-group"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <input
        className="form-control-group"
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      &nbsp;
      <button className="btn btn-behance btn-sm" onClick={fetchTotal}>
        Fetch Total
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <br />
      <h3>Total: {total}</h3>
      </div></div></div></div></div></div>
  );
};
export default TotalCommandesParPeriode;

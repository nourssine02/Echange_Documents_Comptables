import React, { useState } from 'react';
import axios from 'axios';

const ListeClientsParPeriodeCreation = () => {
  const [clients, setClients] = useState([]);
  const [dateCreation, setDateCreation] = useState('');
  const [error, setError] = useState('');

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/liste-clients-par-periode-creation', {
        params: { dateCreation }
      });
      setClients(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching clients', error);
      setError('An error occurred while fetching the clients.');
    }
  };

  return (
    <div>
      <h3>Liste des Clients par Période de Création</h3>
      <input
        className="form-control-lg"
        type="date"
        value={dateCreation}
        onChange={e => setDateCreation(e.target.value)}
      />
      &nbsp;
      <button className="btn btn-dribbble" onClick={fetchClients}>
        Fetch Clients
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <br />
      <h3>Clients :</h3>
      {clients.length > 0 ? (
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              {client.nom} - {client.date_creation}
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found for this date.</p>
      )}
    </div>
  );
};

export default ListeClientsParPeriodeCreation;

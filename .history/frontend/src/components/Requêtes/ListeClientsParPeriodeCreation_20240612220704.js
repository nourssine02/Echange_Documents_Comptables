import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListeClientsParPeriodeCreation = () => {
  const [clients, setClients] = useState([]);
  const [dateCreation, setDateCreation] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(UserContext);

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
      <div className="table-responsive pt-3">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Code Entreprise</th>
              <th>Date de Creation</th>
              <th>Identite</th>
              <th>Responsable</th>
              <th>Adresse</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((ent) => (
              <tr key={ent.id}>
                <td>{ent.code_entreprise}</td>
                <td>{new Date(ent.date_creation).toLocaleDateString()}</td>
                <td>{ent.identite}</td>
                <td>{ent.responsable}</td>
                <td>{ent.adresse}</td>
                <td>
                  <Link to={`/detailsEntreprise/${ent.id}`}>
                    <button type="button" className="btn btn-primary">
                      Détails
                    </button>
                  </Link>
                  &nbsp;
                  {user.role !== "client" && (
                    <Link to={`/updateEntreprise/${ent.id}`}>
                      <button type="button" className="btn btn-success">
                        Modifier
                      </button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeClientsParPeriodeCreation;

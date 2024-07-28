import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

function SelectionClient() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClients(res.data);
      } catch (err) {
        console.log(err);
        setError("Erreur lors du chargement des clients.");
      }
    };

    fetchClients();
  }, [setError]); // Ajout de setError comme dépendance

  const handleClientChange = (e) => {
    setSelectedClientId(e.target.value);
  };

  const handleClientSubmit = () => {
    if (selectedClientId) {
      navigate(`/achats/${selectedClientId}`);
    } else {
      setError("Veuillez sélectionner un client.");
    }
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="client">Sélectionnez un client :</label>
        <select
          id="client"
          className="form-control"
          value={selectedClientId}
          onChange={handleClientChange}
        >
          <option value="">--Sélectionner--</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.identite}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleClientSubmit} className="btn btn-primary">
        Voir les Achats
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Afficher le message d'erreur */}
    </div>
  );
}

export default SelectionClient;

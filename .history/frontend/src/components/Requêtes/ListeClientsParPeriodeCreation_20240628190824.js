import React, { useState } from "react";
import axios from "axios";

const ListeClientsParPeriodeCreation = ({isSidebarOpen}) => {
  const [clients, setClients] = useState([]);
  const [dateCreation, setDateCreation] = useState("");
  const [error, setError] = useState("");

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/liste-clients-par-periode-creation",
        {
          params: { dateCreation },
        }
      );
      setClients(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching clients", error);
      setError("An error occurred while fetching the clients.");
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">
                  Liste des Clients par Période de Création
                </h2>
                <input
                  className="form-control-group"
                  type="date"
                  value={dateCreation}
                  onChange={(e) => setDateCreation(e.target.value)}
                />
                &nbsp;
                <button
                  className="btn btn-behance btn-sm"
                  onClick={fetchClients}
                >
                  Fetch Clients
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <br />
                <br />
                {clients.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Code Entreprise</th>
                          <th>Date de Creation</th>
                          <th>Identite</th>
                          <th>Responsable</th>
                          <th>Adresse</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((ent) => (
                          <tr key={ent.id}>
                            <td>{ent.code_entreprise}</td>
                            <td>
                              {new Date(ent.date_creation).toLocaleDateString()}
                            </td>
                            <td>{ent.identite}</td>
                            <td>{ent.responsable}</td>
                            <td>{ent.adresse}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No clients found for this date.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeClientsParPeriodeCreation;

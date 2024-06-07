import React, { useState } from "react";
import axios from "axios";

function Pointage({ isSidebarOpen }) {
  const [personnelRecords, setPersonnelRecords] = useState([]);
  const [searchCodeTiers, setSearchCodeTiers] = useState("");

  const handleSearchChange = (e) => {
    setSearchCodeTiers(e.target.value);
  };

  const fetchRecords = () => {
    axios
      .get(`http://localhost:5000/personnel/${searchCodeTiers}`)
      .then((response) => {
        setPersonnelRecords(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the records!", error);
      });
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1>Le Pointage Personnel</h1>
            <br />

            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                type="search"
                className="form-control"
                placeholder="Rechercher..."
                value={searchCodeTiers}
                onChange={fetchRecords}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
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
                    {personnelRecords.map((record) => (
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
        </div>
      </div>
    </div>
  );
}

export default Pointage;

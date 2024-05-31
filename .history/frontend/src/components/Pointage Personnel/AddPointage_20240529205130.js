import React, { useState } from "react";
import axios from "axios";

function AddPointage() {
  const [formData, setFormData] = useState({
    date_de_saisie: "",
    code_tiers: "",
    nbre_jours_travailles1: "",
    nbre_jours_travailles2: "",
    nbre_jours_absence1: "",
    nbre_jours_absence2: "",
    nbre_jours_conges1: "",
    nbre_jours_conges2: "",
    supplement_recus: "",
    sommes_rejetees: "",
    remboursement_divers: "",
    autre_deduction: "",
    observations: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/pointage", formData)
      .then((response) => {
        alert("Record added successfully!");
      })
      .catch((error) => {
        console.error("There was an error adding the record!", error);
      });
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Pointage</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <label>
                Date de Saisie:
                <input
                  type="date"
                  className="form-c"
                  name="date_de_saisie"
                  value={formData.date_de_saisie}
                  onChange={handleChange}
                />
              </label>
              <label>
                Code Tiers:
                <input
                  type="text"
                  name="code_tiers"
                  value={formData.code_tiers}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours Travaillés 1:
                <input
                  type="number"
                  name="nbre_jours_travailles1"
                  value={formData.nbre_jours_travailles1}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours Travaillés 2:
                <input
                  type="number"
                  name="nbre_jours_travailles2"
                  value={formData.nbre_jours_travailles2}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours d'Absence 1:
                <input
                  type="number"
                  name="nbre_jours_absence1"
                  value={formData.nbre_jours_absence1}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours d'Absence 2:
                <input
                  type="number"
                  name="nbre_jours_absence2"
                  value={formData.nbre_jours_absence2}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours de Congés 1:
                <input
                  type="number"
                  name="nbre_jours_conges1"
                  value={formData.nbre_jours_conges1}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre de Jours de Congés 2:
                <input
                  type="number"
                  name="nbre_jours_conges2"
                  value={formData.nbre_jours_conges2}
                  onChange={handleChange}
                />
              </label>
              <label>
                Supplement Reçus:
                <input
                  type="number"
                  name="supplement_recus"
                  value={formData.supplement_recus}
                  onChange={handleChange}
                />
              </label>
              <label>
                Sommes Rejetées:
                <input
                  type="number"
                  name="sommes_rejetees"
                  value={formData.sommes_rejetees}
                  onChange={handleChange}
                />
              </label>
              <label>
                Remboursement Divers:
                <input
                  type="number"
                  name="remboursement_divers"
                  value={formData.remboursement_divers}
                  onChange={handleChange}
                />
              </label>
              <label>
                Autre Déduction:
                <input
                  type="number"
                  name="autre_deduction"
                  value={formData.autre_deduction}
                  onChange={handleChange}
                />
              </label>
              <label>
                Observations:
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleChange}
                ></textarea>
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPointage;

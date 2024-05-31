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
              <div className="col-md-4">
                <div className="form-group">
                  <label>Date de Saisie: </label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_de_saisie"
                    value={formData.date_de_saisie}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Code Tiers:</label>
                <input
                  type="text"
                  className="form-control"
                  name="code_tiers"
                  value={formData.code_tiers}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours Travaillés 1:</label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_travailles1"
                  value={formData.nbre_jours_travailles1}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours Travaillés 2:</label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_travailles2"
                  value={formData.nbre_jours_travailles2}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours d'Absence 1:</label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_absence1"
                  value={formData.nbre_jours_absence1}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours d'Absence 2: </label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_absence2"
                  value={formData.nbre_jours_absence2}
                  onChange={handleChange}
                />
                </div>
             </div>
             <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours de Congés 1: </label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_conges1"
                  value={formData.nbre_jours_conges1}
                  onChange={handleChange}
                />
             </div>
             </div>
             <div className="col-md-4">
                <div className="form-group">
              <label>
                Nombre de Jours de Congés 2: </label>
                <input
                  type="number"
                  className="form-control"
                  name="nbre_jours_conges2"
                  value={formData.nbre_jours_conges2}
                  onChange={handleChange}
                />
             </div>
             </div>
             <div className="col-md-4">
                <div className="form-group">
              <label>
                Supplement Reçus:  </label>
                <input
                  type="number"
                  className="form-control"
                  name="supplement_recus"
                  value={formData.supplement_recus}
                  onChange={handleChange}
                />
            </div>
            </div>
            <div className="col-md-4">
                <div className="form-group">
              <label>
                Sommes Rejetées:</label>
                <input
                  type="number"
                  className="form-control"
                  name="sommes_rejetees"
                  value={formData.sommes_rejetees}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Remboursement Divers: </label>
                <input
                  type="number"
                  className="form-control"
                  name="remboursement_divers"
                  value={formData.remboursement_divers}
                  onChange={handleChange}
                />
             </div>
             </div>
             <div className="col-md-4">
                <div className="form-group">
              <label>
                Autre Déduction:</label>
                <input
                  type="number"
                  className="form-control"
                  name="autre_deduction"
                  value={formData.autre_deduction}
                  onChange={handleChange}
                />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
              <label>
                Observations:</label>
                <textarea
                  name="observations"
                  className="form-control"
                  value={formData.observations}
                  onChange={handleChange}
                ></textarea>
              </div>
              </div>
              <br></br>
              <div className="col-md-4">
               <button type="submit" className="btn btn-outline-dribbble">Submit</button>
               <button type="button" className="btn btn-outline-light">Submit</button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPointage;

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEntreprise = () => {
  const [entreprise, setEntreprise] = useState({
    code_entreprise: "",
    date_creation: new Date().toISOString().split("T")[0],
    identite: "",
    MF_CIN: "",
    responsable: "",
    cnss: "",
    tel: "",
    email: "",
    adresse: "",
  });

  const [errors, setErrors] = useState({
    code_entreprise: "",
    date_creation: "",
    identite: "",
    MF_CIN: "",
    responsable: "",
    cnss: "",
    tel: "",
    email: "",
    adresse: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEntreprise((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validation
    let formValid = true;
    const newErrors = { ...errors };

    if (!entreprise.code_entreprise) {
      formValid = false;
      newErrors.code_entreprise = "Code Entreprise is required";
    } else {
      newErrors.code_entreprise = "";
    }

    if (!entreprise.date_creation) {
      formValid = false;
      newErrors.date_creation = "Date De Creation is required";
    } else {
      newErrors.date_creation = "";
    }

    if (!entreprise.identite) {
      formValid = false;
      newErrors.identite = "Identite is required";
    } else {
      newErrors.identite = "";
    }

    if (!entreprise.MF_CIN) {
      formValid = false;
      newErrors.MF_CIN = "MF/ CIN is required";
    } else {
      newErrors.MF_CIN = "";
    }
    if (!entreprise.responsable) {
      formValid = false;
      newErrors.responsable = "Responsable is required";
    } else {
      newErrors.responsable = "";
    }

    if (!entreprise.cnss) {
      formValid = false;
      newErrors.cnss = "CNSS is required";
    } else {
      newErrors.cnss = "";
    }

    if (!entreprise.tel) {
      formValid = false;
      newErrors.tel = "Telephone is required";
    } else {
      newErrors.tel = "";
    }

    if (!entreprise.email) {
      formValid = false;
      newErrors.email = "Email is required";
    } else {
      newErrors.email = "";
    }

    if (!entreprise.adresse) {
      formValid = false;
      newErrors.adresse = "Adresse is required";
    } else {
      newErrors.adresse = "";
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5000/entreprises", entreprise);
      navigate("/entreprises");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate("/entreprises");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter une Entreprise</h1>
            <br></br>
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Entreprise:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code_entreprise"
                      onChange={handleChange}
                      placeholder="Code entreprise"
                    />
                    {errors.code_entreprise && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.code_entreprise}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_creation"
                      value={entreprise.date_creation}
                      onChange={handleChange}
                    />
                    {errors.date_creation && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.date_creation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identité"
                    />
                    {errors.identite && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.identite}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>MF/CIN:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF/CIN"
                    />
                    {errors.MF_CIN && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.MF_CIN}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Responsable :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="responsable"
                      onChange={handleChange}
                      placeholder="Responsable"
                    />
                    {errors.responsable && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.responsable}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>CNSS :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cnss"
                      onChange={handleChange}
                      placeholder="CNSS"
                    />
                    {errors.cnss && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.cnss}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Telephone :</label>
                    <input
                      type="number"
                      className="form-control"
                      name="tel"
                      onChange={handleChange}
                      placeholder="Telephone"
                    />
                    {errors.tel && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.tel}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      onChange={handleChange}
                      placeholder="Adresse"
                    />
                    {errors.adresse && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.adresse}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div
                className="button d-flex align-items-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                  style={{ marginBottom: "5px" }}
                >
                  Submit
                </button>
                &nbsp; &nbsp;
                <button className="btn btn-light" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntreprise;

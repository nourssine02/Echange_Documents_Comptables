import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEntreprise = ({ isSidebarOpen }) => {
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
    const { name, value } = e.target;
    setEntreprise({ ...entreprise, [name]: value });

    // Validate field immediately
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_entreprise":
        error = value ? "" : "Code Entreprise est obligatoire";
        break;
      case "date_creation":
        error = value ? "" : "Date De Creation est obligatoire";
        break;
      case "identite":
        error = value ? "" : "Identité est obligatoire";
        break;
      case "MF_CIN":
        error = value ? "" : "MF/CIN est obligatoire";
        break;
      case "responsable":
        error = value ? "" : "Responsable est obligatoire";
        break;
      case "cnss":
        error = value ? "" : "CNSS est obligatoire";
        break;
      case "tel":
        error = value
          ? value.length === 8
            ? ""
            : "Le numéro de téléphone doit contenir 8 chiffres"
          : "Téléphone est obligatoire";
        break;
      case "email":
        error = value ? "" : "Email est obligatoire";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    Object.keys(entreprise).forEach((key) => validateField(key, entreprise[key]));

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
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
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter une Entreprise</h1>
            <br />
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
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

                  <div className="form-group">
                    <label>Code Entreprise:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code_entreprise"
                      value={entreprise.code_entreprise}
                      onChange={handleChange}
                      placeholder="Code entreprise"
                    />
                    {errors.code_entreprise && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.code_entreprise}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identite"
                      value={entreprise.identite}
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
                      value={entreprise.MF_CIN}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Responsable :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="responsable"
                      value={entreprise.responsable}
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
                      value={entreprise.cnss}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={entreprise.email}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Téléphone :</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="tel"
                      value={entreprise.tel}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      style={{ borderColor: errors.tel ? 'red' : 'green' }}
                    />
                    {errors.tel && (
                      <div className="error" style={{ color: 'red' }}>
                        {errors.tel}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      value={entreprise.adresse}
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
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
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

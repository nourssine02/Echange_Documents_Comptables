import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEntreprise = ({isSidebarOpen}) => {
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

  const [inputColor, setInputColor] = useState('');

  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setEntreprise((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntreprise({ ...entreprise, [name]: value });

    if (value === '') {
      setErrors({ ...errors, [name]: 'Telephone est obligatoire' });
      setInputColor('red');
    } else if (value.length !== 8) {
      setErrors({ ...errors, [name]: 'le numéro de téléphone doit contenir 8 chiffres' });
      setInputColor('red');
    } else {
      setErrors({ ...errors, [name]: '' });
      setInputColor('green');
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Validation
    let formValid = true;
    const newErrors = { ...errors };

    if (!entreprise.code_entreprise) {
      formValid = false;
      newErrors.code_entreprise = "Code Entreprise est obligatoire";
    } else {
      newErrors.code_entreprise = "";
    }

    if (!entreprise.date_creation) {
      formValid = false;
      newErrors.date_creation = "Date De Creation est obligatoire";
    } else {
      newErrors.date_creation = "";
    }

    if (!entreprise.identite) {
      formValid = false;
      newErrors.identite = "Identite est obligatoire";
    } else {
      newErrors.identite = "";
    }

    if (!entreprise.MF_CIN) {
      formValid = false;
      newErrors.MF_CIN = "MF/ CIN est obligatoire";
    } else {
      newErrors.MF_CIN = "";
    }
    if (!entreprise.responsable) {
      formValid = false;
      newErrors.responsable = "Responsable est obligatoire";
    } else {
      newErrors.responsable = "";
    }

    if (!entreprise.cnss) {
      formValid = false;
      newErrors.cnss = "CNSS est obligatoire";
    } else {
      newErrors.cnss = "";
    }

    // if (!entreprise.tel) {
    //   formValid = false;
    //   newErrors.tel = "Telephone est obligatoire" && "le numéro de téléphone doit contenir 8 chiffres";
    // } else {
    //   newErrors.tel = "";
    // }

    if (!entreprise.tel) {
      formValid = false;
      newErrors.tel = 'Telephone est obligatoire';
    } else if (entreprise.tel.length !== 8) {
      formValid = false;
      newErrors.tel = 'le numéro de téléphone doit contenir 8 chiffres';
    }

    if (!entreprise.email) {
      formValid = false;
      newErrors.email = "Email est obligatoire";
    } else {
      newErrors.email = "";
    }

    if (!entreprise.adresse) {
      formValid = false;
      newErrors.adresse = "Adresse est obligatoire";
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
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter une Entreprise</h1>
            <br></br>
            <br></br>
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
                <div className="col-md-4">
                 
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
                <div className="col-md-4">
                <div className="form-group">
      <label>Telephone :</label>
      <input
        type="number"
        className="form-control"
        name="tel"
        onChange={handleChange}
        placeholder="Telephone"
        style={{ borderColor: inputColor }}
      />
      {errors.tel && (
        <div className="error" style={{ color: 'red' }}>
          {errors.tel}
        </div>
      )}
    </div>
                  {/* <div className="form-group">
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
                  </div> */}

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
                <div className="col-md-4">
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
                className="d-flex justify-content-center"
              >
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

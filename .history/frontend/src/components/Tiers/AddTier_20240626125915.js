import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTier = ({isSidebarOpen}) => {
  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: new Date().toISOString().split("T")[0],
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    observations: "",
  });

  const [errors, setErrors] = useState({
    code_tiers: "",
    date_creation: "",
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  

  const validateField = (name, value) => {
    let error = "";
  
    switch (name) {
      case "code_tiers":
        error = value ? "" : "Code Tiers est obligatoire";
        break;
      case "date_creation":
        error = value ? "" : "Date de Création est obligatoire";
        break;
      case "type":
        error = value ? "" : "Type est obligatoire";
        break;
      case "identite":
        error = value ? "" : "Identité est obligatoire";
        break;
      case "MF_CIN":
        error = value ? "" : "MF/CIN est obligatoire";
        break;
      case "tel":
        error = /^\d{8}$/.test(value) ? "" : "Le numéro de téléphone doit contenir 8 chiffres";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Email doit être valide";
        break;
      // Adresse n'est pas validé car il est facultatif
      default:
        break;
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  
  const handleClick = async (e) => {
  e.preventDefault();

  // Valider tous les champs avant la soumission
  Object.keys(tier).forEach((key) => validateField(key, tier[key]));

  // Vérifier s'il y a des erreurs
  const hasErrors = Object.values(errors).some((error) => error !== "");

  if (!hasErrors) {
    try {
      await axios.post("http://localhost:5000/tiers", tier);
      navigate("/tiers");
    } catch (err) {
      console.log(err);
    }
  }
};


  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter un Tier</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                <div className="form-group">
    <label>Date de Création:</label>
    <input
      type="date"
      className={`form-control ${errors.date_creation && "is-invalid"}`}
      name="date_creation"
      onChange={handleChange}
      value={tier.date_creation}
    />
    {errors.date_creation && (
      <div className="invalid-feedback">{errors.date_creation}</div>
    )}
  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.code_tiers && "is-invalid"}`}
                      name="code_tiers"
                      onChange={handleChange}
                      placeholder="Code Tiers"
                    />
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
                  </div>

                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      style={{ color: "black" }}  
                      className="form-control"
                      name="type"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="client">Client</option>
                      <option value="personnel">Personnel</option>
                      <option value="associe">Associé</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identité"
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      onChange={handleChange}
                      placeholder="Adresse"
                    />
                  </div>
                  
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>MF / CIN:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF/CIN"
                    />
                  </div>

                  <div className="form-group">
                    <label>Telephone :</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="tel"
                      onChange={handleChange}
                      placeholder="Telephone"
                    />
                  </div>
                
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Entrez vos observations ici..."
                      cols={50}
                      rows={2}
                    />
                  </div>
                </div>
               
              </div>
              <div
                className="d-flex justify-content-center"
                >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                >
                  Enregistrer
                </button>
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

export default AddTier;

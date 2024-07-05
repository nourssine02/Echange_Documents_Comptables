import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddReglement = ({ user }) => {
  const [reglement, setReglement] = useState({
    code_reglement: "",
    date_creation: new Date().toISOString().split("T")[0],
    montant: "",
    moyen_de_paiement: "",
  });

  const [errors, setErrors] = useState({
    code_reglement: "",
    date_creation: "",
    montant: "",
    moyen_de_paiement: "",
  });

  const [inputValidity, setInputValidity] = useState({
    code_reglement: false,
    date_creation: false,
    montant: false,
    moyen_de_paiement: false,
  });

  const navigate = useNavigate();
  const [alert, setAlert] = useState(null); // State for alert messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReglement((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    let valid = false;
    switch (name) {
      case "code_reglement":
        error = value ? "" : "Code Réglement est obligatoire";
        valid = value !== "";
        break;
      case "date_creation":
        error = value ? "" : "Date de Création est obligatoire";
        valid = value !== "";
        break;
      case "montant":
        error = value ? "" : "Montant est obligatoire";
        valid = value !== "";
        break;
      case "moyen_de_paiement":
        error = value ? "" : "Moyen de Paiement est obligatoire";
        valid = value !== "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    setInputValidity((prevValidity) => ({ ...prevValidity, [name]: valid }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    Object.keys(reglement).forEach((key) => validateField(key, reglement[key]));

    if (Object.values(inputValidity).every((valid) => valid)) {
      try {
        await axios.post("http://localhost:5000/reglements", reglement);
        setAlert({
          type: "success",
          message: "Réglement ajouté avec succès",
        });

        if (user.role === "comptable") {
          // Add notification
          const notificationMessage = `${user.identite} a ajouté un achat`;

          // Ensure both userId and message are included in the request body
          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };

          await axios.post("http://localhost:5000/notifications", notificationData);
        }

        setTimeout(() => {
          navigate("/reglements");
        }, 2000);
      } catch (err) {
        console.log(err);
        setAlert({
          type: "danger",
          message: "L'ajout du réglement a échoué",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate("/reglements");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter un Réglement</h1>
            <br />
            {alert && (
              <div className={`alert alert-${alert.type} d-flex align-items-center`} role="alert">
                <div>{alert.message}</div>
              </div>
            )}
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_creation ? "is-invalid" : ""}`}
                      name="date_creation"
                      value={reglement.date_creation}
                      onChange={handleChange}
                    />
                    {errors.date_creation && (
                      <div className="invalid-feedback">{errors.date_creation}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Code Réglement:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.code_reglement ? "is-invalid" : ""}`}
                      name="code_reglement"
                      value={reglement.code_reglement}
                      onChange={handleChange}
                      placeholder="Code réglement"
                    />
                    {errors.code_reglement && (
                      <div className="invalid-feedback">{errors.code_reglement}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.montant ? "is-invalid" : ""}`}
                      name="montant"
                      value={reglement.montant}
                      onChange={handleChange}
                      placeholder="Montant"
                    />
                    {errors.montant && (
                      <div className="invalid-feedback">{errors.montant}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Moyen de Paiement:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.moyen_de_paiement ? "is-invalid" : ""}`}
                      name="moyen_de_paiement"
                      value={reglement.moyen_de_paiement}
                      onChange={handleChange}
                      placeholder="Moyen de Paiement"
                    />
                    {errors.moyen_de_paiement && (
                      <div className="invalid-feedback">{errors.moyen_de_paiement}</div>
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
                  Soumettre
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

export default AddReglement;

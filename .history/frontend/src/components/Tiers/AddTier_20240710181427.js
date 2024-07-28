import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddTier = ({ isSidebarOpen }) => {
  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: new Date().toISOString().split("T")[0],
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "",
    observations: "",
    autreType: "",
    banques: [],
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

  const [banquesOptions, setBanquesOptions] = useState([]);

  useEffect(() => {
    // Fetch banks from the database
    axios.get("http://localhost:5000/banques").then((response) => {
      setBanquesOptions(response.data.map((banque) => ({
        value: banque.id,
        label: banque.nom,
      })));
    }).catch((error) => {
      console.error("Error fetching banques:", error);
    });
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setTier((prev) => ({ ...prev, banques: selectedOptions }));
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
        error = /^\d{8,}$/.test(value)
          ? ""
          : "Le numéro de téléphone doit contenir au moins 8 chiffres";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Email doit être valide";
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

    // Valider tous les champs avant la soumission
    const formValid = Object.keys(tier).reduce((acc, key) => {
      validateField(key, tier[key]);
      return acc && (key === "observations" || !errors[key]);
    }, true);

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (formValid && !hasErrors) {
      try {
        const fullAddress = `${tier.adresse}, Tunisie`;
        await axios.post("http://localhost:5000/tiers", {
          ...tier,
          adresse: fullAddress,
        });
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
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter un Tier</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                {/* Votre code pour les autres champs */}
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Banque:</label>
                    <Select
                      isMulti
                      name="banques"
                      options={banquesOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                    />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary mr-2" onClick={handleClick}>
                Soumettre
              </button>
              <button className="btn btn-light" onClick={handleCancel}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTier;

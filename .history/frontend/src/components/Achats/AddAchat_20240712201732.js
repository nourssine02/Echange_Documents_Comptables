import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form } from 'react-bootstrap';

const AddAchat = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const [achat, setAchat] = useState({
    date_saisie: new Date().toISOString().split("T")[0],
    code_tiers: "",
    tiers_saisie: "",
    type_piece: "",
    num_piece: "",
    date_piece: "",
    statut: "",
    montant_HT_piece: "",
    FODEC_piece: "",
    TVA_piece: "",
    timbre_piece: "",
    autre_montant_piece: "",
    montant_total_piece: "",
    observations: "",
    document_fichier: "",
  });

  const [errors, setErrors] = useState({});
  const [codeTiers, setCodeTiers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newTier, setNewTier] = useState({
    code_tiers: "",
    identite: "",
    // Ajoutez les autres champs nécessaires pour la création de tiers
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setAchat((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setAchat((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_tiers":
        // Code tiers n'est plus obligatoire
        break;
      case "type_piece":
        error = value ? "" : "Type de la Pièce est obligatoire";
        break;
      case "statut":
        error = value ? "" : "Statut de la Pièce est obligatoire";
        break;
      case "date_piece":
        error = value ? "" : "Date de la Pièce est obligatoire";
        break;
      case "num_piece":
        error = value ? "" : "N° de la Pièce est obligatoire";
        break;
      case "montant_HT_piece":
        error = value && !isNaN(value) ? "" : "Montant HT doit être un nombre valide";
        break;
      case "FODEC_piece":
        error = value && !isNaN(value) ? "" : "FODEC doit être un nombre valide";
        break;
      case "TVA_piece":
        error = value && !isNaN(value) ? "" : "TVA doit être un nombre valide";
        break;
      case "timbre_piece":
        error = value && !isNaN(value) ? "" : "Timbre doit être un nombre valide";
        break;
      case "autre_montant_piece":
        error = value && !isNaN(value) ? "" : "Autres Montants doit être un nombre valide";
        break;
      case "montant_total_piece":
        error = value && !isNaN(value) ? "" : "Montant Total doit être un nombre valide";
        break;
      case "document_fichier":
        error = value ? "" : "Document de la Pièce est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const axiosWithAuth = () => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: "http://localhost:5000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    Object.keys(achat).forEach((key) => validateField(key, achat[key]));

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      const axiosInstance = axiosWithAuth();

      try {
        let postData = { ...achat };

        await axiosInstance.post("http://localhost:5000/achats", postData);

        if (user.role === "comptable") {
          const notificationMessage = `${user.identite} a ajouté un achat`;

          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };

          await axiosInstance.post("http://localhost:5000/notifications", notificationData);
        }

        setAlert({
          type: "success",
          message: "Achat est ajouté avec succès",
        });

        setTimeout(() => {
          navigate("/achats");
        }, 2000);
      } catch (err) {
        console.log(err);
        setAlert({
          type: "danger",
          message: "Achat n'est pas ajouté avec succès",
        });
      }
    }
  };

  const handleCancel = () => {
    navigate("/achats");
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewTier((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/tiers", newTier);
      const newTierData = res.data;

      setCodeTiers((prev) => [...prev, newTierData]);
      setAchat((prev) => ({
        ...prev,
        code_tiers: `${newTierData.code_tiers} - ${newTierData.identite}`,
      }));

      handleModalClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center" style={{fontSize: "35px"}}>Ajouter un achat de biens et de Services</h1>
            <br />
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
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_saisie && "is-invalid"
                      }`}
                      name="date_saisie"
                      onChange={handleChange}
                      value={achat.date_saisie}
                    />
                    {errors.date_saisie && (
                      <div className="invalid-feedback">
                        {errors.date_saisie}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_piece && "is-invalid"
                      }`}
                      name="date_piece"
                      onChange={handleChange}
                      placeholder="Date de la Pièce"
                    />
                    {errors.date

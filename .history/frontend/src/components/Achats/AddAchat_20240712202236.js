import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form } from "react-bootstrap";

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

  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission

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
        error =
          value && !isNaN(value) ? "" : "Montant HT doit être un nombre valide";
        break;
      case "FODEC_piece":
        error =
          value && !isNaN(value) ? "" : "FODEC doit être un nombre valide";
        break;
      case "TVA_piece":
        error = value && !isNaN(value) ? "" : "TVA doit être un nombre valide";
        break;
      case "timbre_piece":
        error =
          value && !isNaN(value) ? "" : "Timbre doit être un nombre valide";
        break;
      case "autre_montant_piece":
        error =
          value && !isNaN(value)
            ? ""
            : "Autres Montants doit être un nombre valide";
        break;
      case "montant_total_piece":
        error =
          value && !isNaN(value)
            ? ""
            : "Montant Total doit être un nombre valide";
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

    setIsSubmitting(true); // Start form submission

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

          await axiosInstance.post(
            "http://localhost:5000/notifications",
            notificationData
          );
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
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center" style={{ fontSize: "35px" }}>
              Ajouter un achat de biens et de Services
            </h1>
            <br />
            <br />
            {alert && (
              <div
                className={`alert alert-${alert.type} d-flex align-items-center`}
                role="alert"
              >
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
                    {errors.date_piece && (
                      <div className="invalid-feedback">
                        {errors.date_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_total_piece && "is-invalid"
                      }`}
                      name="montant_total_piece"
                      onChange={handleChange}
                      placeholder="Montant Total de la Pièce"
                    />
                    {errors.montant_total_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_total_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers:</label>
                    <div className="input-group">
                      <select
                        className={`form-control ${
                          errors.code_tiers && "is-invalid"
                        }`}
                        name="code_tiers"
                        onChange={handleChange}
                        value={achat.code_tiers}
                      >
                        <option value="">Sélectionner un code tiers</option>
                        {codeTiers.map((tiers) => (
                          <option
                            key={tiers.code_tiers}
                            value={`${tiers.code_tiers} - ${tiers.identite}`}
                          >
                            {`${tiers.code_tiers} - ${tiers.identite}`}
                          </option>
                        ))}
                      </select>
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={handleModalShow}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_HT_piece && "is-invalid"
                      }`}
                      name="montant_HT_piece"
                      onChange={handleChange}
                      placeholder="Montant HT de la Pièce"
                    />
                    {errors.montant_HT_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_HT_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>FODEC de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.FODEC_piece && "is-invalid"
                      }`}
                      name="FODEC_piece"
                      onChange={handleChange}
                      placeholder="FODEC de la Pièce"
                    />
                    {errors.FODEC_piece && (
                      <div className="invalid-feedback">
                        {errors.FODEC_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Autres Montants de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.autre_montant_piece && "is-invalid"
                      }`}
                      name="autre_montant_piece"
                      onChange={handleChange}
                      placeholder="Autres Montants de la Pièce"
                    />
                    {errors.autre_montant_piece && (
                      <div className="invalid-feedback">
                        {errors.autre_montant_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Type de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.type_piece && "is-invalid"
                      }`}
                      name="type_piece"
                      onChange={handleChange}
                      placeholder="Type de la Pièce"
                    />
                    {errors.type_piece && (
                      <div className="invalid-feedback">
                        {errors.type_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>N° de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_piece && "is-invalid"
                      }`}
                      name="num_piece"
                      onChange={handleChange}
                      placeholder="N° de la Pièce"
                    />
                    {errors.num_piece && (
                      <div className="invalid-feedback">{errors.num_piece}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Statut de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.statut && "is-invalid"
                      }`}
                      name="statut"
                      onChange={handleChange}
                      placeholder="Statut de la Pièce"
                    />
                    {errors.statut && (
                      <div className="invalid-feedback">{errors.statut}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Timbre de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.timbre_piece && "is-invalid"
                      }`}
                      name="timbre_piece"
                      onChange={handleChange}
                      placeholder="Timbre de la Pièce"
                    />
                    {errors.timbre_piece && (
                      <div className="invalid-feedback">
                        {errors.timbre_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>TVA de la Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.TVA_piece && "is-invalid"
                      }`}
                      name="TVA_piece"
                      onChange={handleChange}
                      placeholder="TVA de la Pièce"
                    />
                    {errors.TVA_piece && (
                      <div className="invalid-feedback">{errors.TVA_piece}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Document de la Pièce:</label>
                    <input
                      type="file"
                      className={`form-control-file ${
                        errors.document_fichier && "is-invalid"
                      }`}
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    {errors.document_fichier && (
                      <div className="invalid-feedback">
                        {errors.document_fichier}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Observations"
                    />
                  </div>
                </div>
              </div>
              <br />
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="primary"
                  onClick={handleClick}
                  disabled={isSubmitting}
                >
                  Ajouter un achat
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="secondary" onClick={handleCancel}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un nouveau tiers */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Nouveau Tier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCodeTiers">
              <Form.Label>Code Tiers:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code Tiers"
                name="code_tiers"
                value={newTier.code_tiers}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="formIdentite">
              <Form.Label>Identité:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Identité"
                name="identite"
                value={newTier.identite}
                onChange={handleModalChange}
              />
            </Form.Group>
            {/* Ajoutez les autres champs nécessaires pour la création de tiers ici */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAchat;

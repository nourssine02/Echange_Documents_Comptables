import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select"; // Import React Select

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
  const [alert, setAlert] = useState(null); // State for alert messages
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newTier, setNewTier] = useState({
    code_tiers: "",
    identite: "",
    // Add other necessary fields for creating a new tier
  });

  // Define 'villesTunisie' and 'paysOptions'
  const villesTunisie = []; // Replace with your list of cities
  const paysOptions = []; // Replace with your options for countries

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

    // Show modal when tiers_saisie is entered
    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
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

    // Validate all fields before submission
    Object.keys(achat).forEach((key) => validateField(key, achat[key]));

    // Check for errors
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      const axiosInstance = axiosWithAuth();

      try {
        let postData = { ...achat };

        // Post the purchase data
        await axiosInstance.post("http://localhost:5000/achats", postData);

        if (user.role === "comptable") {
          // Add notification
          const notificationMessage = `${user.identite} a ajouté un achat`;

          // Ensure both userId and message are included in the request body
          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };

          await axiosInstance.post("http://localhost:5000/notifications", notificationData);
        }
        // Set success alert
        setAlert({
          type: "success",
          message: "Achat est ajouté avec succès",
        });

        // Navigate to the purchase page after a short delay
        setTimeout(() => {
          navigate("/achats");
        }, 2000);
      } catch (err) {
        console.log(err);
        // Set error alert
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
            <h1 className="text-center" style={{ fontSize: "35px" }}>Ajouter un achat de biens et de Services</h1>
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
                      <div className="invalid-feedback">{errors.date_saisie}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Tiers Saisie:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.tiers_saisie && "is-invalid"
                      }`}
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={achat.tiers_saisie}
                    />
                    {errors.tiers_saisie && (
                      <div className="invalid-feedback">{errors.tiers_saisie}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Type de la Pièce:</label>
                    <select
                      className={`form-control ${
                        errors.type_piece && "is-invalid"
                      }`}
                      name="type_piece"
                      onChange={handleChange}
                      value={achat.type_piece}
                    >
                      <option value="">Sélectionnez le type de pièce</option>
                      <option value="Facture">Facture</option>
                      <option value="Bon de commande">Bon de commande</option>
                      <option value="Bon de livraison">Bon de livraison</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.type_piece && (
                      <div className="invalid-feedback">{errors.type_piece}</div>
                    )}
                  </div>
                  {achat.type_piece === "Autre" && (
                    <div className="form-group">
                      <label>Nouveau Type:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nouveau_type"
                        onChange={handleChange}
                        value={achat.nouveau_type}
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label>N° de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_piece && "is-invalid"
                      }`}
                      name="num_piece"
                      onChange={handleChange}
                      value={achat.num_piece}
                    />
                    {errors.num_piece && (
                      <div className="invalid-feedback">{errors.num_piece}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_piece && "is-invalid"
                      }`}
                      name="date_piece"
                      onChange={handleChange}
                      value={achat.date_piece}
                    />
                    {errors.date_piece && (
                      <div className="invalid-feedback">{errors.date_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Statut:</label>
                    <select
                      className={`form-control ${
                        errors.statut && "is-invalid"
                      }`}
                      name="statut"
                      onChange={handleChange}
                      value={achat.statut}
                    >
                      <option value="">Sélectionnez le statut</option>
                      <option value="Payé">Payé</option>
                      <option value="En attente">En attente</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                    {errors.statut && (
                      <div className="invalid-feedback">{errors.statut}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_HT_piece && "is-invalid"
                      }`}
                      name="montant_HT_piece"
                      onChange={handleChange}
                      value={achat.montant_HT_piece}
                    />
                    {errors.montant_HT_piece && (
                      <div className="invalid-feedback">{errors.montant_HT_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>FODEC de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.FODEC_piece && "is-invalid"
                      }`}
                      name="FODEC_piece"
                      onChange={handleChange}
                      value={achat.FODEC_piece}
                    />
                    {errors.FODEC_piece && (
                      <div className="invalid-feedback">{errors.FODEC_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>TVA de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.TVA_piece && "is-invalid"
                      }`}
                      name="TVA_piece"
                      onChange={handleChange}
                      value={achat.TVA_piece}
                    />
                    {errors.TVA_piece && (
                      <div className="invalid-feedback">{errors.TVA_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Timbre de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.timbre_piece && "is-invalid"
                      }`}
                      name="timbre_piece"
                      onChange={handleChange}
                      value={achat.timbre_piece}
                    />
                    {errors.timbre_piece && (
                      <div className="invalid-feedback">{errors.timbre_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Autres Montants de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.autre_montant_piece && "is-invalid"
                      }`}
                      name="autre_montant_piece"
                      onChange={handleChange}
                      value={achat.autre_montant_piece}
                    />
                    {errors.autre_montant_piece && (
                      <div className="invalid-feedback">{errors.autre_montant_piece}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_total_piece && "is-invalid"
                      }`}
                      name="montant_total_piece"
                      onChange={handleChange}
                      value={achat.montant_total_piece}
                    />
                    {errors.montant_total_piece && (
                      <div className="invalid-feedback">{errors.montant_total_piece}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      value={achat.observations}
                    />
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
                      <div className="invalid-feedback">{errors.document_fichier}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Ville:</label>
                    {/* Example usage of Select component */}
                    <Select options={villesTunisie} /> {/* Ensure to pass valid options */}
                  </div>
                  <div className="form-group">
                    <label>Pays:</label>
                    {/* Example usage of Select component */}
                    <Select options={paysOptions} /> {/* Ensure to pass valid options */}
                  </div>
                  <button className="btn btn-success" onClick={handleClick}>
                    Ajouter
                  </button>
                  <button
                    className="btn btn-danger ml-3"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for adding new tier */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Nouveau Tiers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="code_tiers">
              <Form.Label>Code Tiers:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer le code tiers"
                name="code_tiers"
                value={newTier.code_tiers}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="identite">
              <Form.Label>Identité:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrer l'identité"
                name="identite"
                value={newTier.identite}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Ajouter Tiers
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAchat;

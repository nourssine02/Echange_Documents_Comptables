import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    type: "",
    autreType: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    banques: [],
  });

  const banquesOptions = [
    { value: "Al Baraka Bank", label: "Al Baraka Bank" },
    { value: "AMEN BANK", label: "AMEN BANK" },
    { value: "ARAB TUNISIAN BANK", label: "ARAB TUNISIAN BANK" },
    { value: "ATTIJARI BANK", label: "ATTIJARI BANK" },
    { value: "BANQUE DE TUNISIE", label: "BANQUE DE TUNISIE" },
    {
      value: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)",
      label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)",
    },
    { value: "BH BANK", label: "BH BANK" },
    { value: "BANQUE ZITOUNA", label: "BANQUE ZITOUNA" },
    {
      value: "UNION INTERNATIONALE DE BANQUES",
      label: "UNION INTERNATIONALE DE BANQUES",
    },
  ];

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

    // Valider tous les champs avant la soumission
    Object.keys(achat).forEach((key) => validateField(key, achat[key]));

    // Vérifier s'il y a des erreurs
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

          await axiosInstance.post(
            "http://localhost:5000/notifications",
            notificationData
          );
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
    setIsSubmitting(false); // End form submission
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

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedBanques = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setNewTier((prevState) => ({
      ...prevState,
      banques: selectedBanques,
    }));
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

      toast.success("Nouveau Tier ajouté avec succès");
      handleModalClose();
    } catch (err) {
      console.log(err);
      toast.error("Erreur lors de l'ajout du nouveau Tier");
    }
  };

  const isSubmitDisabled = () => {
    // Disable the submit button if any errors exist
    return Object.values(errors).some((error) => error !== "");
  };

  return (
    <div
      className={`container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
    >
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Ajouter Achat</h5>
          {alert && (
            <div
              className={`alert alert-${alert.type}`}
              role="alert"
            >
              {alert.message}
            </div>
          )}
          <form onSubmit={handleClick}>
            <div className="form-group">
              <label>Date Saisie</label>
              <input
                type="date"
                className="form-control"
                name="date_saisie"
                value={achat.date_saisie}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Code Tiers</label>
              <select
                className="form-control"
                name="code_tiers"
                value={achat.code_tiers}
                onChange={handleChange}
              >
                <option value="">Sélectionner le Code Tiers</option>
                {codeTiers.map((tier) => (
                  <option
                    key={tier.id}
                    value={`${tier.code_tiers} - ${tier.identite}`}
                  >
                    {`${tier.code_tiers} - ${tier.identite}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tiers Saisie</label>
              <input
                type="text"
                className="form-control"
                name="tiers_saisie"
                value={achat.tiers_saisie}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Type de la Pièce</label>
              <input
                type="text"
                className="form-control"
                name="type_piece"
                value={achat.type_piece}
                onChange={handleChange}
              />
              {errors.type_piece && (
                <div className="text-danger">{errors.type_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>N° de la Pièce</label>
              <input
                type="text"
                className="form-control"
                name="num_piece"
                value={achat.num_piece}
                onChange={handleChange}
              />
              {errors.num_piece && (
                <div className="text-danger">{errors.num_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>Date de la Pièce</label>
              <input
                type="date"
                className="form-control"
                name="date_piece"
                value={achat.date_piece}
                onChange={handleChange}
              />
              {errors.date_piece && (
                <div className="text-danger">{errors.date_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>Statut de la Pièce</label>
              <input
                type="text"
                className="form-control"
                name="statut"
                value={achat.statut}
                onChange={handleChange}
              />
              {errors.statut && (
                <div className="text-danger">{errors.statut}</div>
              )}
            </div>
            <div className="form-group">
              <label>Montant HT</label>
              <input
                type="text"
                className="form-control"
                name="montant_HT_piece"
                value={achat.montant_HT_piece}
                onChange={handleChange}
              />
              {errors.montant_HT_piece && (
                <div className="text-danger">{errors.montant_HT_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>FODEC</label>
              <input
                type="text"
                className="form-control"
                name="FODEC_piece"
                value={achat.FODEC_piece}
                onChange={handleChange}
              />
              {errors.FODEC_piece && (
                <div className="text-danger">{errors.FODEC_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>TVA</label>
              <input
                type="text"
                className="form-control"
                name="TVA_piece"
                value={achat.TVA_piece}
                onChange={handleChange}
              />
              {errors.TVA_piece && (
                <div className="text-danger">{errors.TVA_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>Timbre</label>
              <input
                type="text"
                className="form-control"
                name="timbre_piece"
                value={achat.timbre_piece}
                onChange={handleChange}
              />
              {errors.timbre_piece && (
                <div className="text-danger">{errors.timbre_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>Autres Montants</label>
              <input
                type="text"
                className="form-control"
                name="autre_montant_piece"
                value={achat.autre_montant_piece}
                onChange={handleChange}
              />
              {errors.autre_montant_piece && (
                <div className="text-danger">{errors.autre_montant_piece}</div>
              )}
            </div>
            <div className="form-group">
              <label>Montant Total</label>
              <input
                type="text"
                className="form-control"
                name="montant_total_piece"
                value={achat.montant_total_piece}
                onChange={handleChange}
              />
              {errors.montant_total_piece && (
                <div className="text-danger">
                  {errors.montant_total_piece}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Observations</label>
              <textarea
                className="form-control"
                name="observations"
                value={achat.observations}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Document de la Pièce</label>
              <input
                type="file"
                className="form-control"
                name="document_fichier"
                onChange={handleChange}
              />
              {errors.document_fichier && (
                <div className="text-danger">{errors.document_fichier}</div>
              )}
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || isSubmitDisabled()}
              >
                {isSubmitting ? "En cours..." : "Ajouter"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={handleCancel}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for adding new tier */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Nouveau Tier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code Tier</Form.Label>
              <Form.Control
                type="text"
                name="code_tiers"
                value={newTier.code_tiers}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Identité</Form.Label>
              <Form.Control
                type="text"
                name="identite"
                value={newTier.identite}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newTier.type}
                onChange={handleModalChange}
              >
                <option value="">Sélectionner le Type</option>
                <option value="Type1">Type1</option>
                <option value="Type2">Type2</option>
                <option value="Type3">Type3</option>
                <option value="Autre">Autre</option>
              </Form.Control>
              {newTier.type === "Autre" && (
                <Form.Group>
                  <Form.Label>Autre Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="autreType"
                    value={newTier.autreType}
                    onChange={handleModalChange}
                  />
                </Form.Group>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>MF/CIN</Form.Label>
              <Form.Control
                type="text"
                name="MF_CIN"
                value={newTier.MF_CIN}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="tel"
                value={newTier.tel}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={newTier.email}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="adresse"
                value={newTier.adresse}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Ville</Form.Label>
              <Form.Control
                type="text"
                name="ville"
                value={newTier.ville}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pays</Form.Label>
              <Form.Control
                type="text"
                name="pays"
                value={newTier.pays}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Banques</Form.Label>
              <Form.Control
                as="select"
                name="banques"
                multiple
                value={newTier.banques}
                onChange={handleModalChange}
              >
                <option value="">Sélectionner les Banques</option>
                {banques.map((banque, index) => (
                  <option key={index} value={banque}>
                    {banque}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleAddTier}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAchat;


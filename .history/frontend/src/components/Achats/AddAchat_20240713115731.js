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

  return (
    <div className={`container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <h2 className="text-center mt-2">Ajouter un Achat</h2>
      <form>
        <Row>
          <Col md={4}>
            <Form.Group controlId="date_saisie">
              <Form.Label>Date de Saisie</Form.Label>
              <Form.Control
                type="date"
                name="date_saisie"
                value={achat.date_saisie}
                onChange={handleChange}
                isInvalid={errors.date_saisie}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date_saisie}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="code_tiers">
              <Form.Label>Code de Tiers</Form.Label>
              <Form.Control
                as="select"
                name="code_tiers"
                value={achat.code_tiers}
                onChange={handleChange}
                isInvalid={errors.code_tiers}
              >
                <option value="">Sélectionner un tiers</option>
                {codeTiers.map((tier) => (
                  <option
                    key={tier.code_tiers}
                    value={`${tier.code_tiers} - ${tier.identite}`}
                  >
                    {tier.code_tiers} - {tier.identite}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.code_tiers}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="tiers_saisie">
              <Form.Label>Saisir Nouveau Tiers</Form.Label>
              <Form.Control
                type="text"
                name="tiers_saisie"
                value={achat.tiers_saisie}
                onChange={handleChange}
                isInvalid={errors.tiers_saisie}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tiers_saisie}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="type_piece">
              <Form.Label>Type de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="type_piece"
                value={achat.type_piece}
                onChange={handleChange}
                isInvalid={errors.type_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.type_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="statut">
              <Form.Label>Statut de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="statut"
                value={achat.statut}
                onChange={handleChange}
                isInvalid={errors.statut}
              />
              <Form.Control.Feedback type="invalid">
                {errors.statut}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="date_piece">
              <Form.Label>Date de la Pièce</Form.Label>
              <Form.Control
                type="date"
                name="date_piece"
                value={achat.date_piece}
                onChange={handleChange}
                isInvalid={errors.date_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="num_piece">
              <Form.Label>N° de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="num_piece"
                value={achat.num_piece}
                onChange={handleChange}
                isInvalid={errors.num_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.num_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="montant_HT_piece">
              <Form.Label>Montant HT</Form.Label>
              <Form.Control
                type="text"
                name="montant_HT_piece"
                value={achat.montant_HT_piece}
                onChange={handleChange}
                isInvalid={errors.montant_HT_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.montant_HT_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="FODEC_piece">
              <Form.Label>FODEC</Form.Label>
              <Form.Control
                type="text"
                name="FODEC_piece"
                value={achat.FODEC_piece}
                onChange={handleChange}
                isInvalid={errors.FODEC_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.FODEC_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="TVA_piece">
              <Form.Label>TVA</Form.Label>
              <Form.Control
                type="text"
                name="TVA_piece"
                value={achat.TVA_piece}
                onChange={handleChange}
                isInvalid={errors.TVA_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.TVA_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="timbre_piece">
              <Form.Label>Timbre</Form.Label>
              <Form.Control
                type="text"
                name="timbre_piece"
                value={achat.timbre_piece}
                onChange={handleChange}
                isInvalid={errors.timbre_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.timbre_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="autre_montant_piece">
              <Form.Label>Autres Montants</Form.Label>
              <Form.Control
                type="text"
                name="autre_montant_piece"
                value={achat.autre_montant_piece}
                onChange={handleChange}
                isInvalid={errors.autre_montant_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.autre_montant_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group controlId="montant_total_piece">
              <Form.Label>Montant Total</Form.Label>
              <Form.Control
                type="text"
                name="montant_total_piece"
                value={achat.montant_total_piece}
                onChange={handleChange}
                isInvalid={errors.montant_total_piece}
              />
              <Form.Control.Feedback type="invalid">
                {errors.montant_total_piece}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="observations">
              <Form.Label>Observations</Form.Label>
              <Form.Control
                as="textarea"
                name="observations"
                value={achat.observations}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="document_fichier">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                name="document_fichier"
                onChange={handleChange}
                isInvalid={errors.document_fichier}
              />
              <Form.Control.Feedback type="invalid">
                {errors.document_fichier}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Button
          variant="primary"
          type="submit"
          className="mr-2"
          onClick={handleClick}
          disabled={isSubmitting} // Disable the button during submission
        >
          {isSubmitting ? "En cours..." : "Ajouter"}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Annuler
        </Button>
      </form>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter Nouveau Tier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="code_tiers">
              <Form.Label>Code de Tiers</Form.Label>
              <Form.Control
                type="text"
                name="code_tiers"
                value={newTier.code_tiers}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="identite">
              <Form.Label>Identité</Form.Label>
              <Form.Control
                type="text"
                name="identite"
                value={newTier.identite}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newTier.type}
                onChange={handleModalChange}
              >
                <option value="">Sélectionner un type</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="Autre">Autre</option>
              </Form.Control>
              {newTier.type === "Autre" && (
                <Form.Control
                  type="text"
                  name="newType"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  placeholder="Saisir un nouveau type"
                />
              )}
            </Form.Group>
            <Form.Group controlId="ville">
              <Form.Label>Ville</Form.Label>
              <Form.Control
                type="text"
                name="ville"
                value={newTier.ville}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="pays">
              <Form.Label>Pays</Form.Label>
              <Form.Control
                type="text"
                name="pays"
                value={newTier.pays}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group controlId="banque">
              <Form.Label>Banque</Form.Label>
              <Form.Control
                as="select"
                name="banque"
                multiple
                value={newTier.banque}
                onChange={handleModalChange}
              >
                {banques.map((banque) => (
                  <option key={banque} value={banque}>
                    {banque}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddTier}>
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddAchat;

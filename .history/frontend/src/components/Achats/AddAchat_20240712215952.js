import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";

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
    ville: "", // Champ optionnel - ville
    pays: "", // Champ optionnel - pays
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

      setCodeTiers((prevCodeTiers) => [...prevCodeTiers, newTierData]);
      setAchat((prevAchat) => ({ ...prevAchat, code_tiers: newTierData._id }));
      setNewTier({
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
      setShowModal(false);
    } catch (err) {
      console.error("Error adding new tier:", err);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Nouveau Tiers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Identité
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  name="identite"
                  value={newTier.identite}
                  onChange={handleModalChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Type
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  name="type"
                  value={newTier.type}
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="Type1">Type1</option>
                  <option value="Type2">Type2</option>
                  <option value="Autre">Autre</option>
                </Form.Control>
              </Col>
            </Form.Group>
            {newTier.type === "Autre" && (
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Autre Type
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="autreType"
                    value={newTier.autreType}
                    onChange={handleModalChange}
                    required
                  />
                </Col>
              </Form.Group>
            )}
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                MF/CIN
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  name="MF_CIN"
                  value={newTier.MF_CIN}
                  onChange={handleModalChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Tel
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  name="tel"
                  value={newTier.tel}
                  onChange={handleModalChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Email
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="email"
                  name="email"
                  value={newTier.email}
                  onChange={handleModalChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Adresse
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  name="adresse"
                  value={newTier.adresse}
                  onChange={handleModalChange}
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="4">
                Banques
              </Form.Label>
              <Col sm="8">
                <Select
                  options={banquesOptions}
                  isMulti
                  name="banques"
                  onChange={handleMultiSelectChange}
                />
              </Col>
            </Form.Group>
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

      <div className={isSidebarOpen ? "contentOpen content" : "content"}>
        <div className="header">
          <h3>Ajouter un Achat</h3>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}

        <Form onSubmit={handleClick}>
          <Form.Row>
            <Form.Group as={Col} controlId="date_saisie">
              <Form.Label>Date Saisie</Form.Label>
              <Form.Control
                type="date"
                name="date_saisie"
                value={achat.date_saisie}
                onChange={handleChange}
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} controlId="code_tiers">
              <Form.Label>Code Tiers</Form.Label>
              <Form.Control
                as="select"
                name="code_tiers"
                value={achat.code_tiers}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un code</option>
                {codeTiers.map((code) => (
                  <option key={code._id} value={code._id}>
                    {code.code_tiers} - {code.identite}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="tiers_saisie">
              <Form.Label>Tiers Saisie</Form.Label>
              <Form.Control
                type="text"
                name="tiers_saisie"
                value={achat.tiers_saisie}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="type_piece">
              <Form.Label>Type de la Pièce</Form.Label>
              <Form.Control
                as="select"
                name="type_piece"
                value={achat.type_piece}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="Type1">Type1</option>
                <option value="Type2">Type2</option>
                <option value="Autre">Autre</option>
              </Form.Control>
            </Form.Group>
            {achat.type_piece === "Autre" && (
              <Form.Group as={Col} controlId="autreType">
                <Form.Label>Nouveau Type</Form.Label>
                <Form.Control
                  type="text"
                  name="autreType"
                  value={achat.autreType}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="num_piece">
              <Form.Label>N° de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="num_piece"
                value={achat.num_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="date_piece">
              <Form.Label>Date de la Pièce</Form.Label>
              <Form.Control
                type="date"
                name="date_piece"
                value={achat.date_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="statut">
              <Form.Label>Statut de la Pièce</Form.Label>
              <Form.Control
                as="select"
                name="statut"
                value={achat.statut}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un statut</option>
                <option value="Statut1">Statut1</option>
                <option value="Statut2">Statut2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="montant_HT_piece">
              <Form.Label>Montant HT de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="montant_HT_piece"
                value={achat.montant_HT_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="FODEC_piece">
              <Form.Label>FODEC de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="FODEC_piece"
                value={achat.FODEC_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="TVA_piece">
              <Form.Label>TVA de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="TVA_piece"
                value={achat.TVA_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="timbre_piece">
              <Form.Label>Timbre de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="timbre_piece"
                value={achat.timbre_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="montant_TTC_piece">
              <Form.Label>Montant TTC de la Pièce</Form.Label>
              <Form.Control
                type="text"
                name="montant_TTC_piece"
                value={achat.montant_TTC_piece}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="observation">
              <Form.Label>Observation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observation"
                value={achat.observation}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Row>

          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddAchat;

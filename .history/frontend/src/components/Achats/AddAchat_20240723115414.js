import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { UserContext } from "../Connexion/UserProvider";
import Select from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAchat = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  const [tierErrors, setTierErrors] = useState({});
  const [achat, setAchat] = useState({});
  const [errors, setErrors] = useState({});
  const [codeTiers, setCodeTiers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTier, setNewTier] = useState({
    date_creation: new Date().toISOString().split("T")[0],
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

  const bankOptions = [
    { id: 1, value: "Al Baraka Bank", label: "Al Baraka Bank" },
    { id: 2, value: "AMEN BANK", label: "AMEN BANK" },
    { id: 3, value: "ARAB TUNISIAN BANK", label: "ARAB TUNISIAN BANK" },
    { id: 4, value: "ATTIJARI BANK", label: "ATTIJARI BANK" },
    { id: 5, value: "BANQUE DE TUNISIE", label: "BANQUE DE TUNISIE" },
    {
      id: 6,
      value: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)",
      label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)",
    },
    { id: 7, value: "BH BANK", label: "BH BANK" },
    { id: 8, value: "BANQUE ZITOUNA", label: "BANQUE ZITOUNA" },
    {
      id: 9,
      value: "UNION INTERNATIONALE DE BANQUES",
      label: "UNION INTERNATIONALE DE BANQUES",
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/code_tiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodeTiers(response.data);
      } catch (error) {
        console.error("Error fetching code tiers:", error);
      }
    };
    fetchData();
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

    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const validateForm = () => {
    const newErrors = {};
    if (!newTier.code_tiers) newErrors.code_tiers = 'Le code du tiers est requis';
    if (!newTier.type) newErrors.type = 'Type du tiers est requis';
    if (!newTier.identite) newErrors.identite = 'L\'identité est requise';
    if (!newTier.MF_CIN) newErrors.MF_CIN = 'Le MF/CIN est requis';
    if (!newTier.tel) newErrors.tel = 'Le téléphone est requis';
    if (!newTier.email) newErrors.email = 'L\'email est requis';
    if (!newTier.adresse) newErrors.adresse = 'L\'adresse est requise';

    return newErrors;
  };

  const handleNewTierSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setTierErrors(formErrors);
      return;
    }

    try {
      const response = await axiosWithAuth().post("/tiers", newTier);
      const addedTier = response.data;

      toast.success("Tier ajouté avec succès !");

      setAchat((prevAchat) => ({
        ...prevAchat,
        tiers_saisie: `${addedTier.code_tiers} - ${addedTier.identite}`,
      }));

      setShowModal(false);
    } catch (error) {
      console.error("Error adding tier:", error);
      toast.error("Erreur lors de l'ajout du tier.");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewTier({ ...newTier, [name]: value });

    setTierErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setNewTier((prev) => ({
      ...prev,
      banques: selectedOptions.map((banque) => ({ value: banque.id })),
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

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
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate("/achats");
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
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
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
                    <label>Numéro de Pièce:</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.numero_piece && "is-invalid"
                      }`}
                      name="numero_piece"
                      onChange={handleChange}
                      placeholder="Numéro de Pièce"
                    />
                    {errors.numero_piece && (
                      <div className="invalid-feedback">
                        {errors.numero_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Document scanné:</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleChange}
                      placeholder="Document scanné"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Tiers Saisie:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={achat.tiers_saisie}
                      onCl
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      className={`form-control ${
                        errors.description && "is-invalid"
                      }`}
                      name="description"
                      rows="3"
                      onChange={handleChange}
                      placeholder="Description"
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    onClick={handleClick}
                    disabled={isSubmitting}
                  >
                    Ajouter
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau Tier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleNewTierSubmit}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Date de Création</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_creation"
                    value={newTier.date_creation}
                    onChange={handleModalChange}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Code Tiers</Form.Label>
                  <Form.Control
                    type="text"
                    name="code_tiers"
                    value={newTier.code_tiers}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.code_tiers}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.code_tiers}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Identité</Form.Label>
                  <Form.Control
                    type="text"
                    name="identite"
                    value={newTier.identite}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.identite}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.identite}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={newTier.type}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.type}
                  >
                    <option value="">Sélectionner le type</option>
                    <option value="Client">Client</option>
                    <option value="Fournisseur">Fournisseur</option>
                    <option value="Autre">Autre</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.type}
                  </Form.Control.Feedback>
                </Form.Group>
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
                <Form.Group>
                  <Form.Label>MF/CIN</Form.Label>
                  <Form.Control
                    type="text"
                    name="MF_CIN"
                    value={newTier.MF_CIN}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.MF_CIN}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.MF_CIN}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="tel"
                    value={newTier.tel}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.tel}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.tel}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newTier.email}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={newTier.adresse}
                    onChange={handleModalChange}
                    isInvalid={tierErrors.adresse}
                  />
                  <Form.Control.Feedback type="invalid">
                    {tierErrors.adresse}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Banques</Form.Label>
                  <Select
                    isMulti
                    name="banques"
                    options={bankOptions}
                    value={newTier.banques}
                    onChange={handleMultiSelectChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <button type="submit" className="btn btn-primary">
                  Ajouter
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalClose}
                >
                  Annuler
                </button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddAchat;

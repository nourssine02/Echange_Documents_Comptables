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
    document_fichier: null,
  });

  const [errors, setErrors] = useState({});
  const [codeTiers, setCodeTiers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    { value: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)", label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)" },
    { value: "BH BANK", label: "BH BANK" },
    { value: "BANQUE ZITOUNA", label: "BANQUE ZITOUNA" },
    { value: "UNION INTERNATIONALE DE BANQUES", label: "UNION INTERNATIONALE DE BANQUES" },
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

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleNewTierSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosWithAuth().post("/tiers", newTier);
      const addedTier = response.data;
      toast.success("Tier ajouté avec succès !");

      setAchat((prevAchat) => ({
        ...prevAchat,
        code_tiers: `${addedTier.code_tiers} - ${addedTier.identite}`,
        tiers_saisie: addedTier.identite,
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
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setNewTier({
      ...newTier,
      banques: selectedOptions.map((option) => option.value),
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(achat).forEach((key) => {
      const error = validateField(key, achat[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      const axiosInstance = axiosWithAuth();

      try {
        const postData = { ...achat };

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
          message: "Achat ajouté avec succès",
        });

        setAchat({
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
          document_fichier: null,
        });

        navigate("/achats");
      } catch (error) {
        console.error("Error submitting form:", error);
        setAlert({
          type: "danger",
          message: "Erreur lors de l'ajout de l'achat",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      setAlert({
        type: "danger",
        message: "Veuillez corriger les erreurs dans le formulaire",
      });
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
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <form onSubmit={handleClick}>
        <div className="form-group">
          <label htmlFor="code_tiers">Tiers</label>
          <div className="input-group">
            <input
              list="codeTiers"
              id="code_tiers"
              name="code_tiers"
              className={`form-control ${errors.code_tiers ? "is-invalid" : ""}`}
              onChange={handleChange}
              value={achat.code_tiers}
            />
            <datalist id="codeTiers">
              {codeTiers.map((tiers) => (
                <option key={tiers.id} value={`${tiers.code_tiers} - ${tiers.identite}`}>
                  {tiers.code_tiers} - {tiers.identite}
                </option>
              ))}
            </datalist>
            {errors.code_tiers && <div className="invalid-feedback">{errors.code_tiers}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tiers_saisie">Saisir un nouveau Tiers</label>
          <div className="input-group">
            <input
              id="tiers_saisie"
              name="tiers_saisie"
              className={`form-control ${errors.tiers_saisie ? "is-invalid" : ""}`}
              onChange={handleChange}
              value={achat.tiers_saisie}
            />
            {errors.tiers_saisie && <div className="invalid-feedback">{errors.tiers_saisie}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="type_piece">Type de la Pièce</label>
          <input
            type="text"
            id="type_piece"
            name="type_piece"
            className={`form-control ${errors.type_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.type_piece}
          />
          {errors.type_piece && <div className="invalid-feedback">{errors.type_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="num_piece">N° de la Pièce</label>
          <input
            type="text"
            id="num_piece"
            name="num_piece"
            className={`form-control ${errors.num_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.num_piece}
          />
          {errors.num_piece && <div className="invalid-feedback">{errors.num_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="date_piece">Date de la Pièce</label>
          <input
            type="date"
            id="date_piece"
            name="date_piece"
            className={`form-control ${errors.date_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.date_piece}
          />
          {errors.date_piece && <div className="invalid-feedback">{errors.date_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="statut">Statut</label>
          <input
            type="text"
            id="statut"
            name="statut"
            className={`form-control ${errors.statut ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.statut}
          />
          {errors.statut && <div className="invalid-feedback">{errors.statut}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="montant_HT_piece">Montant HT</label>
          <input
            type="text"
            id="montant_HT_piece"
            name="montant_HT_piece"
            className={`form-control ${errors.montant_HT_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.montant_HT_piece}
          />
          {errors.montant_HT_piece && <div className="invalid-feedback">{errors.montant_HT_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="FODEC_piece">FODEC</label>
          <input
            type="text"
            id="FODEC_piece"
            name="FODEC_piece"
            className={`form-control ${errors.FODEC_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.FODEC_piece}
          />
          {errors.FODEC_piece && <div className="invalid-feedback">{errors.FODEC_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="TVA_piece">TVA</label>
          <input
            type="text"
            id="TVA_piece"
            name="TVA_piece"
            className={`form-control ${errors.TVA_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.TVA_piece}
          />
          {errors.TVA_piece && <div className="invalid-feedback">{errors.TVA_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="timbre_piece">Timbre</label>
          <input
            type="text"
            id="timbre_piece"
            name="timbre_piece"
            className={`form-control ${errors.timbre_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.timbre_piece}
          />
          {errors.timbre_piece && <div className="invalid-feedback">{errors.timbre_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="autre_montant_piece">Autres Montants</label>
          <input
            type="text"
            id="autre_montant_piece"
            name="autre_montant_piece"
            className={`form-control ${errors.autre_montant_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.autre_montant_piece}
          />
          {errors.autre_montant_piece && <div className="invalid-feedback">{errors.autre_montant_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="montant_total_piece">Montant Total</label>
          <input
            type="text"
            id="montant_total_piece"
            name="montant_total_piece"
            className={`form-control ${errors.montant_total_piece ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.montant_total_piece}
          />
          {errors.montant_total_piece && <div className="invalid-feedback">{errors.montant_total_piece}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="observations">Observations</label>
          <textarea
            id="observations"
            name="observations"
            className={`form-control ${errors.observations ? "is-invalid" : ""}`}
            onChange={handleChange}
            value={achat.observations}
          />
          {errors.observations && <div className="invalid-feedback">{errors.observations}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="document_fichier">Document de la Pièce</label>
          <input
            type="file"
            id="document_fichier"
            name="document_fichier"
            className={`form-control ${errors.document_fichier ? "is-invalid" : ""}`}
            onChange={handleChange}
          />
          {errors.document_fichier && <div className="invalid-feedback">{errors.document_fichier}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Ajout en cours..." : "Ajouter Achat"}
        </button>
      </form>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau Tier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleClick}>
            <Form.Group>
              <Form.Label>Nom du Tiers</Form.Label>
              <Form.Control type="text" name="tiers_saisie" value={achat.tiers_saisie} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </div>
      </div>
      </div>
    </div>
  );
};

export default AddAchat;


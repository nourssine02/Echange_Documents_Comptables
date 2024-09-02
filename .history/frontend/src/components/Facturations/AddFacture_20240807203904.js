import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TiersSaisie from "../TiersSaisie";
import Swal from "sweetalert2";

const AddFacture = ({ isSidebarOpen }) => {
  const initialFactureState = {
    date_facture: new Date().toISOString().split("T")[0],
    num_facture: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_livraison: "",
    montant_HT_facture: "",
    FODEC_sur_facture: "",
    TVA_facture: "",
    timbre_facture: "",
    autre_montant_facture: "",
    montant_total_facture: "",
    observations: "",
    document_fichier: "",
    etat_payement: false, // Default to false
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleModalShow = () => setShowModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      const data = { facture };

      axios
        .post("http://localhost:5000/facture", data)
        .then((response) => {
          console.log(response.data.message);
          setFacture(initialFactureState);
          Swal.fire({
            icon: "success",
            title: "Succès",
            text: "Facture ajoutée avec succès!",
          });
          navigate("/facturations");
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout du Facture :", error);

          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: "Erreur lors de l'ajout du Facture. Veuillez réessayer.",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Erreur",
        text: "Veuillez corriger les erreurs dans le formulaire.",
      });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "date_facture":
        if (!value) return "La date de la facture est obligatoire.";
        break;
      case "num_facture":
        if (!value) return "Le numéro de la facture est obligatoire.";
        break;
      case "montant_HT_facture":
        if (!value) return "Le montant HT de la facture est obligatoire.";
        break;
      case "FODEC_sur_facture":
        if (!value) return "Le FODEC sur la facture est obligatoire.";
        break;
      case "TVA_facture":
        if (!value) return "La TVA de la facture est obligatoire.";
        break;
      case "timbre_facture":
        if (!value) return "Le timbre sur la facture est obligatoire.";
        break;
      case "montant_total_facture":
        if (!value) return "Le montant total de la facture est obligatoire.";
        break;
      default:
        return null;
    }
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(facture).forEach((key) => {
      const error = validateField(key, facture[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [codeTiers, setCodeTiers] = useState([]);
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFacture((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url }));

        // Appeler l'OCR et ChatGPT
        handleOCR(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFacture((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
    }

    // Validation à la volée
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleOCR = async (base64Image) => {
    try {
      const response = await axios.post("http://localhost:3000/upload", {
        image: base64Image,
      });

      const data = response.data;
      setFacture((prev) => ({
        ...prev,
        date_facture: data.date || prev.date_facture,
        num_facture: data.invoiceNumber || prev.num_facture,
        montant_HT_facture: data.amount || prev.montant_HT_facture,
      }));
    } catch (error) {
      console.error("Erreur lors de l'OCR et de l'analyse :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'analyse de la facture. Veuillez réessayer.",
      });
    }
  };

  const [refLivraisons, setRefLivraisons] = useState([]);

  useEffect(() => {
    const fetchRefLivraison = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/reference_livraison"
        );
        setRefLivraisons(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRefLivraison();
  }, []);

  const handleCancel = () => {
    navigate("/facturations");
  };


  // const handleCodeTiersChange = (value) => {
  //   setFacture((prev) => ({ ...prev, code_tiers: value }));
  //   setShowModal(false);
  // };

  return (
    <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <h1>Ajouter une Facture</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="date_facture">Date de la facture:</label>
          <input
            type="date"
            id="date_facture"
            name="date_facture"
            value={facture.date_facture}
            onChange={handleChange}
          />
          {errors.date_facture && (
            <span className="text-danger">{errors.date_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="num_facture">Numéro de facture:</label>
          <input
            type="text"
            id="num_facture"
            name="num_facture"
            value={facture.num_facture}
            onChange={handleChange}
          />
          {errors.num_facture && (
            <span className="text-danger">{errors.num_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="code_tiers">Code tiers:</label>
          <select
            id="code_tiers"
            name="code_tiers"
            value={facture.code_tiers}
            onChange={handleChange}
          >
            <option value="">Sélectionner un code tiers</option>
            {codeTiers.map((codeTiersItem) => (
              <option key={codeTiersItem.id} value={codeTiersItem.code}>
                {codeTiersItem.code} - {codeTiersItem.identite}
              </option>
            ))}
          </select>
        </div>


        <div className="form-group">
          <label htmlFor="reference_livraison">Référence livraison:</label>
          <select
            id="reference_livraison"
            name="reference_livraison"
            value={facture.reference_livraison}
            onChange={handleChange}
          >
            <option value="">Sélectionner une référence</option>
            {refLivraisons.map((refLivraison) => (
              <option key={refLivraison.id} value={refLivraison.reference}>
                {refLivraison.reference}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="montant_HT_facture">Montant HT de la facture:</label>
          <input
            type="number"
            step="0.001"
            id="montant_HT_facture"
            name="montant_HT_facture"
            value={facture.montant_HT_facture}
            onChange={handleChange}
          />
          {errors.montant_HT_facture && (
            <span className="text-danger">{errors.montant_HT_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="FODEC_sur_facture">FODEC sur la facture:</label>
          <input
            type="number"
            step="0.001"
            id="FODEC_sur_facture"
            name="FODEC_sur_facture"
            value={facture.FODEC_sur_facture}
            onChange={handleChange}
          />
          {errors.FODEC_sur_facture && (
            <span className="text-danger">{errors.FODEC_sur_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="TVA_facture">TVA de la facture:</label>
          <input
            type="number"
            step="0.001"
            id="TVA_facture"
            name="TVA_facture"
            value={facture.TVA_facture}
            onChange={handleChange}
          />
          {errors.TVA_facture && (
            <span className="text-danger">{errors.TVA_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="timbre_facture">Timbre sur la facture:</label>
          <input
            type="number"
            step="0.001"
            id="timbre_facture"
            name="timbre_facture"
            value={facture.timbre_facture}
            onChange={handleChange}
          />
          {errors.timbre_facture && (
            <span className="text-danger">{errors.timbre_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="autre_montant_facture">
            Autre montant sur la facture:
          </label>
          <input
            type="number"
            step="0.001"
            id="autre_montant_facture"
            name="autre_montant_facture"
            value={facture.autre_montant_facture}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="montant_total_facture">
            Montant total de la facture:
          </label>
          <input
            type="number"
            step="0.001"
            id="montant_total_facture"
            name="montant_total_facture"
            value={facture.montant_total_facture}
            onChange={handleChange}
          />
          {errors.montant_total_facture && (
            <span className="text-danger">{errors.montant_total_facture}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="observations">Observations:</label>
          <textarea
            id="observations"
            name="observations"
            value={facture.observations}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="document_fichier">Document fichier:</label>
          <input
            type="file"
            id="document_fichier"
            name="document_fichier"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="etat_payement">État du paiement:</label>
          <input
            type="checkbox"
            id="etat_payement"
            name="etat_payement"
            checked={facture.etat_payement}
            onChange={handleChange}
          />
          <span
            style={{ marginLeft: "10px" }}
            className="text-info"
          >{`${
            facture.etat_payement ? "Payé" : "Non payé"
          }`}</span>
        </div>

        <button type="submit" className="btn btn-primary">
          Ajouter Facture
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          style={{ marginLeft: "10px" }}
        >
          Annuler
        </button>
      </form>
      {showModal && (
        <TiersSaisie
          showModal={showModal} setShowModal={setShowModal}
          //show={showModal}
          //handleClose={handleModalHide}
          //handleCodeTiersChange={handleCodeTiersChange}
        />
      )}
    </div>
  );
};

export default AddFacture;

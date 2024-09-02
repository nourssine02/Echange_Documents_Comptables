import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TiersSaisie from "../TiersSaisie";
import Swal from "sweetalert2";

const AddFacture = ({ isSidebarOpen }) => {
  const initialFactureState = {
    date_facture: "",
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
    etat_payement: false,
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [codeTiers, setCodeTiers] = useState([]);
  const [refLivraisons, setRefLivraisons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCodeTiers();
  }, []);

  useEffect(() => {
    const fetchRefLivraison = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reference_livraison");
        setRefLivraisons(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRefLivraison();
  }, []);

  const handleAzureFormRecognizer = async () => {
    if (!file) {
      Swal.fire("Avertissement", "Veuillez télécharger un fichier.", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Remplacez par votre clé API Azure et l'endpoint
      const apiKey = "53fa9f341277462ab1327e5037165f93";
      const endpoint = "https://form-recognizer-service.cognitiveservices.azure.com/";

      const config = {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "multipart/form-data",
        },
      };

      const analyzeResponse = await axios.post(
        `${endpoint}/formrecognizer/v2.1/prebuilt/invoice/analyze`,
        formData,
        config
      );

      const operationLocation = analyzeResponse.headers["operation-location"];

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let resultResponse;
      let status = "running";

      while (status === "running" || status === "notStarted") {
        resultResponse = await axios.get(operationLocation, config);
        status = resultResponse.data.status;
        if (status === "succeeded") {
          const fields = resultResponse.data.analyzeResult.documentResults[0].fields;
          setFacture({
            date_facture: fields.InvoiceDate?.valueDate || "",
            num_facture: fields.InvoiceId?.valueString || "",
            montant_HT_facture: fields.Subtotal?.valueNumber ?? "",
            TVA_facture: fields.Tax?.valueNumber ?? "",
            FODEC_sur_facture: fields.Fodec?.valueNumber ?? "",
            timbre_facture: fields.Timbre?.valueNumber ?? "",
            montant_total_facture: fields.Total?.valueNumber ?? "",
          });
          Swal.fire("Succès", "Les données de la facture ont été extraites!", "success");
          break;
        }
        await delay(2000); // Attendre 2 secondes avant de vérifier à nouveau
      }

      if (status !== "succeeded") {
        Swal.fire("Erreur", "L'analyse de la facture a échoué.", "error");
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de la facture :", error);
      Swal.fire("Erreur", "Impossible d'extraire les données de la facture.", "error");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFacture((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      handleFileChange(e);
    } else {
      setFacture((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value || ""),
    }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "date_facture":
      case "num_facture":
      case "montant_HT_facture":
      case "FODEC_sur_facture":
      case "TVA_facture":
      case "timbre_facture":
      case "montant_total_facture":
      case "document_fichier":
        if (!value) return `Le champ ${name.replace('_', ' ')} est obligatoire.`;
        return null;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      const data = { facture };

      axios
        .post("http://localhost:5000/facture", data)
        .then((response) => {
          console.log(response.data.message);
          setFacture(initialFactureState);
          Swal.fire("Succès", "Facture ajoutée avec succès!", "success");
          navigate("/facturations");
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de la Facture :", error);
          Swal.fire("Erreur", "Erreur lors de l'ajout de la Facture. Veuillez réessayer.", "error");
        });
    } else {
      Swal.fire("Erreur", "Veuillez corriger les erreurs dans le formulaire.", "warning");
    }
  };

  const handleCancel = () => {
    navigate("/facturations");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter une Facture</h1>
            <br />
            <form
              className="forms-sample"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de la Facture:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_facture && "is-invalid"}`}
                      name="date_facture"
                      onChange={handleChange}
                      value={facture.date_facture}
                    />
                    {errors.date_facture && <div className="text-danger">{errors.date_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>N° de la Facture:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.num_facture && "is-invalid"}`}
                      name="num_facture"
                      onChange={handleChange}
                      value={facture.num_facture}
                      placeholder="N° de la Facture"
                    />
                    {errors.num_facture && <div className="text-danger">{errors.num_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      className={`form-control ${errors.code_tiers && "is-invalid"}`}
                      name="code_tiers"
                      onChange={handleChange}
                      value={facture.code_tiers}
                    >
                      <option value="">Sélectionner un code</option>
                      {codeTiers.map((code) => (
                        <option key={code.id} value={code.code}>{code.code}</option>
                      ))}
                    </select>
                    {errors.code_tiers && <div className="text-danger">{errors.code_tiers}</div>}
                  </div>

                  <div className="form-group">
                    <label>Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.tiers_saisie && "is-invalid"}`}
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={facture.tiers_saisie}
                      placeholder="Tiers"
                    />
                    {errors.tiers_saisie && <div className="text-danger">{errors.tiers_saisie}</div>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Référence Livraison:</label>
                    <select
                      className={`form-control ${errors.reference_livraison && "is-invalid"}`}
                      name="reference_livraison"
                      onChange={handleChange}
                      value={facture.reference_livraison}
                    >
                      <option value="">Sélectionner une référence</option>
                      {refLivraisons.map((ref) => (
                        <option key={ref.id} value={ref.ref}>{ref.ref}</option>
                      ))}
                    </select>
                    {errors.reference_livraison && <div className="text-danger">{errors.reference_livraison}</div>}
                  </div>

                  <div className="form-group">
                    <label>Montant HT:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.montant_HT_facture && "is-invalid"}`}
                      name="montant_HT_facture"
                      onChange={handleChange}
                      value={facture.montant_HT_facture}
                      placeholder="Montant HT"
                      step="0.01"
                    />
                    {errors.montant_HT_facture && <div className="text-danger">{errors.montant_HT_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>FODEC:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.FODEC_sur_facture && "is-invalid"}`}
                      name="FODEC_sur_facture"
                      onChange={handleChange}
                      value={facture.FODEC_sur_facture}
                      placeholder="FODEC"
                      step="0.01"
                    />
                    {errors.FODEC_sur_facture && <div className="text-danger">{errors.FODEC_sur_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>TVA:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.TVA_facture && "is-invalid"}`}
                      name="TVA_facture"
                      onChange={handleChange}
                      value={facture.TVA_facture}
                      placeholder="TVA"
                      step="0.01"
                    />
                    {errors.TVA_facture && <div className="text-danger">{errors.TVA_facture}</div>}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Timbre:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.timbre_facture && "is-invalid"}`}
                      name="timbre_facture"
                      onChange={handleChange}
                      value={facture.timbre_facture}
                      placeholder="Timbre"
                      step="0.01"
                    />
                    {errors.timbre_facture && <div className="text-danger">{errors.timbre_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>Autre Montant:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.autre_montant_facture && "is-invalid"}`}
                      name="autre_montant_facture"
                      onChange={handleChange}
                      value={facture.autre_montant_facture}
                      placeholder="Autre Montant"
                      step="0.01"
                    />
                    {errors.autre_montant_facture && <div className="text-danger">{errors.autre_montant_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>Montant Total:</label>
                    <input
                      type="number"
                      className={`form-control ${errors.montant_total_facture && "is-invalid"}`}
                      name="montant_total_facture"
                      onChange={handleChange}
                      value={facture.montant_total_facture}
                      placeholder="Montant Total"
                      step="0.01"
                    />
                    {errors.montant_total_facture && <div className="text-danger">{errors.montant_total_facture}</div>}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className={`form-control ${errors.observations && "is-invalid"}`}
                      name="observations"
                      onChange={handleChange}
                      value={facture.observations}
                      placeholder="Observations"
                    />
                    {errors.observations && <div className="text-danger">{errors.observations}</div>}
                  </div>

                  <div className="form-group">
                    <label>Document:</label>
                    <input
                      type="file"
                      className={`form-control ${errors.document_fichier && "is-invalid"}`}
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    {errors.document_fichier && <div className="text-danger">{errors.document_fichier}</div>}
                  </div>
                </div>
              </div>

              <div className="form-group text-center">
                <button type="button" className="btn btn-primary mr-2" onClick={handleAzureFormRecognizer}>
                  Extraire les données
                </button>
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <button type="button" className="btn btn-secondary ml-2" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showModal && <TiersSaisie onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AddFacture;

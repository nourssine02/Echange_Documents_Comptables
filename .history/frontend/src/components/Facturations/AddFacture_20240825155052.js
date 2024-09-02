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

  // Fonction pour utiliser Azure Form Recognizer pour extraire les informations d'une facture
  const handleAzureFormRecognizer = async () => {
    if (!file) {
      Swal.fire("Avertissement", "Veuillez télécharger un fichier.", "warning");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const apiKey = "53fa9f341277462ab1327e5037165f93";
      const endpoint =
        "https://form-recognizer-service.cognitiveservices.azure.com";

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
          const fields =
            resultResponse.data.analyzeResult.documentResults[0].fields;

          // Extraction des champs avec les données appropriées
          const montantHT =
            fields.SubTotal?.text || fields["Total HT"]?.text || "";
          const tva = fields.TotalTax?.text || fields["Total TVA"]?.text || "";
          const timbre = fields.Timbre?.text || fields["Timbre"]?.text || "";
          const fodec = fields.Fodec?.text || fields["FODEC"]?.text || "";
          const montantTotal =
            fields.InvoiceTotal?.text ||
            fields["Net A Payer"]?.text ||
            fields["Total TTC"]?.text ||
            "";

          // Mettre à jour les champs de la facture avec les valeurs extraites
          setFacture({
            ...facture,
            date_facture: fields.InvoiceDate?.valueDate || "",
            num_facture: fields.InvoiceId?.valueString || "",
            montant_HT_facture: montantHT,
            TVA_facture: tva,
            FODEC_sur_facture: fodec,
            timbre_facture: timbre,
            montant_total_facture: montantTotal,
          });

          console.log("Données extraites :", fields);

          Swal.fire(
            "Succès",
            "Les données de la facture ont été extraites avec succès !",
            "success"
          );
          break;
        }

        await delay(2000);
      }

      if (status !== "succeeded") {
        Swal.fire("Erreur", "L'analyse de la facture a échoué.", "error");
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse de la facture :", error);
      Swal.fire(
        "Erreur",
        "Impossible d'extraire les données de la facture.",
        "error"
      );
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
    } else {
      setFacture((prev) => ({ ...prev, document_fichier: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFacture((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      handleFileChange(e);
    } else {
      setFacture((prev) => ({ ...prev, [name]: value || "" }));
    }

    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value || ""),
    }));
  };

  const handleModalShow = () => setShowModal(true);

  const validateField = (name, value) => {
    switch (name) {
      case "date_facture":
        if (!value) return "La date de la facture est obligatoire.";
        break;
      case "num_facture":
        if (!value) return "Le numéro de la facture est obligatoire.";
        break;
      case "montant_total_facture":
        if (!value) return "Le montant total de la facture est obligatoire.";
        break;
      case "document_fichier":
        if (!value) return "Document de la facture est obligatoire.";
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de Facture</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_facture"
                      value={facture.date_facture}
                      onChange={handleChange}
                    />
                    {errors.date_facture && <span className="text-danger">{errors.date_facture}</span>}
                  </div>
                  <div className="form-group">
                    <label>Numéro de Facture</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_facture"
                      value={facture.num_facture}
                      onChange={handleChange}
                    />
                    {errors.num_facture && <span className="text-danger">{errors.num_facture}</span>}
                  </div>
                  <div className="form-group">
                    <label>Code Tiers</label>
                    <select
                      className="form-control"
                      name="code_tiers"
                      value={facture.code_tiers}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner un code tiers</option>
                      {codeTiers.map((tier) => (
                        <option key={tier.id} value={tier.code}>
                          {tier.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Référence Livraison</label>
                    <select
                      className="form-control"
                      name="reference_livraison"
                      value={facture.reference_livraison}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner une référence de livraison</option>
                      {refLivraisons.map((ref) => (
                        <option key={ref.id} value={ref.reference}>
                          {ref.reference}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Montant HT</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_HT_facture"
                      value={facture.montant_HT_facture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>FODEC</label>
                    <input
                      type="number"
                      className="form-control"
                      name="FODEC_sur_facture"
                      value={facture.FODEC_sur_facture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>TVA</label>
                    <input
                      type="number"
                      className="form-control"
                      name="TVA_facture"
                      value={facture.TVA_facture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Timbre</label>
                    <input
                      type="number"
                      className="form-control"
                      name="timbre_facture"
                      value={facture.timbre_facture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Autre Montant</label>
                    <input
                      type="number"
                      className="form-control"
                      name="autre_montant_facture"
                      value={facture.autre_montant_facture}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Montant Total</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_total_facture"
                      value={facture.montant_total_facture}
                      onChange={handleChange}
                    />
                    {errors.montant_total_facture && <span className="text-danger">{errors.montant_total_facture}</span>}
                  </div>
                  <div className="form-group">
                    <label>Observations</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={facture.observations}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Document de Facture</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleFileChange}
                    />
                    {errors.document_fichier && <span className="text-danger">{errors.document_fichier}</span>}
                  </div>
                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="etat_payement"
                      checked={facture.etat_payement}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Etat de paiement</label>
                  </div>
                </div>
                <div className="col-md-6">
                  {facture.document_fichier && <img src={facture.document_fichier} alt="Facture" className="img-fluid" />}
                </div>
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={handleAzureFormRecognizer}>
                  Analyser avec Azure
                </button>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mr-2">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
            <TiersSaisie showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFacture;

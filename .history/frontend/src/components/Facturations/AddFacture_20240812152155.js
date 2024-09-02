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
    etat_payement: false, // Default to false
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);

  // Fonction pour appeler l'API Hugging Face avec un modèle NER
  // const fetchNER = async (text) => {
  //   let attempts = 3; // Nombre de tentatives
  //   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //   for (let i = 0; i < attempts; i++) {
  //     try {
  //       const response = await axios.post(
  //         "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english", // Modèle NER adapté
  //         { inputs: text },
  //         {
  //           headers: {
  //             Authorization: `Bearer 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`, // Remplacez par votre clé API
  //           },
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       if (error.response && error.response.status === 503) {
  //         console.warn(
  //           `Tentative ${
  //             i + 1
  //           } : Modèle en cours de chargement. Réessai dans 10 secondes...`
  //         );
  //         await delay(10000); // Attendre 10 secondes avant de réessayer
  //       } else {
  //         console.error("Erreur lors de l'appel à l'IA :", error);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Erreur",
  //           text: "Erreur lors de l'appel à l'IA. Veuillez réessayer.",
  //         });
  //         break;
  //       }
  //     }
  //   }
  //   return null; // Retourner null si toutes les tentatives échouent
  // };


  // Fonction pour structurer les informations extraites
  // const structureInfoWithNER = async (extractedText) => {
  //   const nerData = await fetchNER(extractedText);

  //   if (nerData && nerData.entities) {
  //     let date_facture = "";
  //     let num_facture = "";
  //     let montant_HT_facture = "";
  //     let FODEC_sur_facture = "";
  //     let TVA_facture = "";
  //     let timbre_facture = "";
  //     let montant_total_facture = "";

  //     // Boucle sur les entités extraites par le modèle NER
  //     nerData.entities.forEach((entity) => {
  //       if (entity.label === "DATE") {
  //         date_facture = entity.word;
  //       } else if (
  //         entity.label === "MISC" &&
  //         entity.word.match(/facture|Facture/)
  //       ) {
  //         num_facture = entity.word;
  //       } else if (entity.label === "MONEY") {
  //         // Ajustez ces conditions en fonction de la structure de vos factures
  //         if (montant_HT_facture === "") montant_HT_facture = entity.word;
  //         else if (FODEC_sur_facture === "") FODEC_sur_facture = entity.word;
  //         else if (TVA_facture === "") TVA_facture = entity.word;
  //         else if (timbre_facture === "") timbre_facture = entity.word;
  //         else if (montant_total_facture === "")
  //           montant_total_facture = entity.word;
  //       }
  //     });

  //     setFacture((prev) => ({
  //       ...prev,
  //       date_facture,
  //       num_facture,
  //       montant_HT_facture,
  //       FODEC_sur_facture,
  //       TVA_facture,
  //       timbre_facture,
  //       montant_total_facture,
  //     }));
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Avertissement",
  //       text: "Aucune information n'a pu être extraite automatiquement.",
  //     });
  //   }
  // };

  // Fonction pour extraire les informations des factures à l'aide de RegEx
const extractInfoWithRegex = (extractedText) => {
  let date_facture = "";
  let num_facture = "";
  let montant_HT_facture = "";
  let FODEC_sur_facture = "";
  let TVA_facture = "";
  let timbre_facture = "";
  let montant_total_facture = "";

  // Exemples de motifs pour extraire les informations. Ajustez-les selon vos besoins.
  const datePattern = /(\d{2}\/\d{2}\/\d{4})/; // Format de date DD/MM/YYYY
  const numFacturePattern = /Facture\s+N°\s*:\s*(\S+)/i;
  const montantHTPattern = /Montant\s+HT\s*:\s*(\d+[\.,]?\d*)/i;
  const FODECPattern = /FODEC\s*:\s*(\d+[\.,]?\d*)/i;
  const TVAPattern = /TVA\s*:\s*(\d+[\.,]?\d*)/i;
  const timbrePattern = /Timbre\s*:\s*(\d+[\.,]?\d*)/i;
  const montantTotalPattern = /Montant\s+Total\s*:\s*(\d+[\.,]?\d*)/i;

  // Extraction des données
  const dateMatch = extractedText.match(datePattern);
  const numFactureMatch = extractedText.match(numFacturePattern);
  const montantHTMatch = extractedText.match(montantHTPattern);
  const FODECMatch = extractedText.match(FODECPattern);
  const TVAMatch = extractedText.match(TVAPattern);
  const timbreMatch = extractedText.match(timbrePattern);
  const montantTotalMatch = extractedText.match(montantTotalPattern);

  if (dateMatch) date_facture = dateMatch[1];
  if (numFactureMatch) num_facture = numFactureMatch[1];
  if (montantHTMatch) montant_HT_facture = montantHTMatch[1];
  if (FODECMatch) FODEC_sur_facture = FODECMatch[1];
  if (TVAMatch) TVA_facture = TVAMatch[1];
  if (timbreMatch) timbre_facture = timbreMatch[1];
  if (montantTotalMatch) montant_total_facture = montantTotalMatch[1];

  return {
      date_facture,
      num_facture,
      montant_HT_facture,
      FODEC_sur_facture,
      TVA_facture,
      timbre_facture,
      montant_total_facture,
  };
};


  const handleOCR = async (formData) => {
    try {
      console.log("Uploading file...");
      const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            apikey: "K83177635088957", // Remplacez par votre clé API
          },
        }
      );

      const extractedText = response.data.ParsedResults[0]?.ParsedText || "";
      if (extractedText) {
        console.log(extractedText);
        // Appeler l'IA pour structurer et remplir les champs
        await structureInfoWithNER(extractedText);

        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Facture analysée et structurée avec succès!",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Avertissement",
          text: "Aucun texte n'a été extrait de la facture.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'OCR et de l'analyse :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'analyse de la facture. Veuillez réessayer.",
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url || "" }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

//   const handleOCRClick = async () => {
//     if (file) {
//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const response = await handleOCR(formData);

//             const extractedText = response.data.ParsedResults[0]?.ParsedText || "";
//             if (extractedText) {
//                 console.log(extractedText);
//                 // Appeler l'IA pour structurer et remplir les champs du formulaire
//                 await structureInfoWithNER(extractedText);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Succès",
//                     text: "Facture analysée et structurée avec succès!",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "warning",
//                     title: "Avertissement",
//                     text: "Aucun texte n'a été extrait de la facture.",
//                 });
//             }
//         } catch (error) {
//             console.error("Erreur lors de l'OCR et de l'analyse :", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Erreur",
//                 text: "Erreur lors de l'analyse de la facture. Veuillez réessayer.",
//             });
//         }
//     } else {
//         Swal.fire({
//             icon: "warning",
//             title: "Avertissement",
//             text: "Veuillez télécharger un fichier avant d'utiliser l'OCR.",
//         });
//     }
// };


  const handleModalShow = () => setShowModal(true);

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
        setFacture((prev) => ({ ...prev, document_fichier: url || "" }));
      };
      reader.readAsDataURL(e.target.files[0]);
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
                      className={`form-control ${
                        errors.date_facture && "is-invalid"
                      }`}
                      name="date_facture"
                      onChange={handleChange}
                      value={facture.date_facture || ""}
                    />
                    {errors.date_facture && (
                      <div className="text-danger">{errors.date_facture}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>N° de la Facture:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_facture && "is-invalid"
                      }`}
                      name="num_facture"
                      onChange={handleChange}
                      value={facture.num_facture || ""}
                      placeholder="N° de la Facture"
                    />
                    {errors.num_facture && (
                      <div className="text-danger">{errors.num_facture}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      onChange={handleChange}
                      value={facture.code_tiers || ""}
                    >
                      <option value="" style={{ color: "black" }}>
                        Sélectionner le Code Tiers
                      </option>
                      {codeTiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {`${tier.code_tiers} - ${tier.identite}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Référence de la Livraison:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="reference_livraison"
                      onChange={handleChange}
                      value={facture.reference_livraison || ""}
                    >
                      <option value="" style={{ color: "black" }}>
                        Référence Livraison
                      </option>
                      {refLivraisons.map((refLivraison) => (
                        <option
                          key={refLivraison.num_BL}
                          value={refLivraison.num_BL}
                          style={{ color: "black" }}
                        >
                          {refLivraison.num_BL}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tier à ajouter:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      onClick={handleModalShow}
                      value={facture.tiers_saisie || ""}
                      disabled={!!facture.code_tiers}
                    />
                  </div>
                  <div className="form-group">
                    <label>TVA de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.TVA_facture && "is-invalid"
                        }`}
                        name="TVA_facture"
                        value={facture.TVA_facture || ""}
                        onChange={handleChange}
                        placeholder="TVA de la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.TVA_facture && (
                      <div className="text-danger">{errors.TVA_facture}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant HT de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_HT_facture && "is-invalid"
                        }`}
                        name="montant_HT_facture"
                        value={facture.montant_HT_facture || ""}
                        onChange={handleChange}
                        placeholder="Montant HT de la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_HT_facture && (
                      <div className="text-danger">
                        {errors.montant_HT_facture}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.FODEC_sur_facture && "is-invalid"
                        }`}
                        name="FODEC_sur_facture"
                        value={facture.FODEC_sur_facture || ""}
                        onChange={handleChange}
                        placeholder="FODEC sur la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.FODEC_sur_facture && (
                      <div className="text-danger">
                        {errors.FODEC_sur_facture}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Timbre sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.timbre_facture && "is-invalid"
                        }`}
                        name="timbre_facture"
                        value={facture.timbre_facture || ""}
                        onChange={handleChange}
                        placeholder="Timbre sur la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.timbre_facture && (
                      <div className="text-danger">{errors.timbre_facture}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Montant Total de la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_total_facture && "is-invalid"
                        }`}
                        name="montant_total_facture"
                        value={facture.montant_total_facture || ""}
                        onChange={handleChange}
                        placeholder="Montant Total de la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_total_facture && (
                      <div className="text-danger">
                        {errors.montant_total_facture}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Autre montant sur la Facture:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="autre_montant_facture"
                        value={facture.autre_montant_facture || ""}
                        onChange={handleChange}
                        placeholder="Autre montant sur la Facture"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.document_fichier && "is-invalid"
                      }`}
                      name="document_fichier"
                      onChange={handleFileChange}
                    />
                    {errors.document_fichier && (
                      <div className="text-danger">
                        {errors.document_fichier}
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={handleOCRClick}
                    >
                      Utiliser OCR
                    </button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={facture.observations || ""}
                      onChange={handleChange}
                      placeholder="Entrez vos observations ici..."
                    />
                  </div>
                </div>

                <div className="col-md-4 mt-4">
                  <div className="form-group">
                    <label>Etat de paiement</label>
                    <div>
                      <input
                        type="checkbox"
                        name="etat_payement"
                        value={facture.etat_payement || ""}
                        checked={facture.etat_payement}
                        onChange={handleChange}
                      />
                      <span
                        style={{
                          color: facture.etat_payement ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {facture.etat_payement ? " Payée" : " Non Payée"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mr-2">
                  Ajouter
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
